"""
The live voice coach.

POST /coach/feedback  → one short line for the coach to say out loud
"""

from fastapi import APIRouter, Depends

from app.models import User
from app.schemas.coach import CoachReply, CoachRequest
from app.security.current_user import get_current_user
from app.services.coach import SYSTEM_PROMPT, build_coach_message, fallback_line
from app.services.llm import AIUnavailable, ask_ai

router = APIRouter(prefix="/coach", tags=["coach"])


@router.post("/feedback", response_model=CoachReply)
def coach_feedback(request: CoachRequest, user: User = Depends(get_current_user)):
    try:
        text = ask_ai(SYSTEM_PROMPT, build_coach_message(user, request))
    except AIUnavailable as error:
        print(f"Coach AI unavailable, using fallback: {error}")
        text = fallback_line(request)

    # Keep it to one clean spoken line.
    return CoachReply(text=text.replace("\n", " ").strip().strip('"'))
