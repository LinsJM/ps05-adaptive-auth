import os
import sys

# Ensure backend directory is in sys.path when deployed with Root Directory = backend
curr_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.abspath(os.path.join(curr_dir, ".."))

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from main import app
