from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from typing import Optional
import uvicorn

app = FastAPI(title="Estimated Time of Arrival (ETA) Calculator ")

# Define the base directory (the folder where main.py is located)
BASE_DIR = Path(__file__).resolve().parent

# Mount the 'static' directory to serve CSS, JS, and other assets
# This maps the URL path /static to the local directory {BASE_DIR}/static
app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")

# Ensure your 'templates' directory is correct
templates = Jinja2Templates(directory=BASE_DIR / "templates")

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    # Pass the 'request' object, which is REQUIRED for Jinja2's url_for
    return templates.TemplateResponse("index.html", {"request": request, "active_page": "home"})

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
