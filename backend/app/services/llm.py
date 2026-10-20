"""
Talks to the Groq AI model.

ask_ai(system, user)       → a short text reply
ask_ai_json(system, user)  → a reply that is valid JSON (a Python dict)
"""

import json

from groq import Groq

from app.config import GROQ_API_KEY, GROQ_MODEL


class AIUnavailable(Exception):
    """The AI couldn't answer (no key, network problem, bad reply…)."""


_client = Groq(api_key=GROQ_API_KEY, timeout=15) if GROQ_API_KEY else None


def _ask(system: str, user: str, *, json_mode: bool, max_tokens: int) -> str:
    if _client is None:
        raise AIUnavailable("GROQ_API_KEY is missing in api/.env")

    options = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        "temperature": 0.6,
        "max_completion_tokens": max_tokens,
        "reasoning_effort": "low",  # quick answers: this model "thinks" before replying
    }
    if json_mode:
        options["response_format"] = {"type": "json_object"}

    try:
        response = _client.chat.completions.create(**options)
    except Exception as error:  # network error, rate limit, bad key…
        raise AIUnavailable(str(error)) from error

    text = (response.choices[0].message.content or "").strip()
    if not text:
        raise AIUnavailable("The AI sent back an empty reply")
    return text


def ask_ai(system: str, user: str) -> str:
    return _ask(system, user, json_mode=False, max_tokens=400)


def ask_ai_json(system: str, user: str) -> dict:
    text = _ask(system, user, json_mode=True, max_tokens=2500)
    try:
        return json.loads(text)
    except json.JSONDecodeError as error:
        raise AIUnavailable("The AI reply was not valid JSON") from error
