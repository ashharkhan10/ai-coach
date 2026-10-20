"""
Password hashing.

We never store real passwords. We store a "hash" — a scrambled version
that can't be turned back into the password. To log in, we hash what the
user typed and compare.
"""

from pwdlib import PasswordHash

_hasher = PasswordHash.recommended()  # uses Argon2, the current best practice


def hash_password(password: str) -> str:
    return _hasher.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return _hasher.verify(password, password_hash)
