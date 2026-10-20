"""
All settings for the backend live here.

Values are read from the .env file, so secrets never go inside the code.
"""

import os

from dotenv import load_dotenv

load_dotenv()

# The address of the frontend. Only this site is allowed to call the backend.
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
