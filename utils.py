import requests
from pathlib import Path
import fitz
import os

def get_pdf_text(url):
    filename = Path('temp.pdf')
    response = requests.get(url)
    filename.write_bytes(response.content)
    try:
        doc = fitz.open("temp.pdf")
    except:
        return None
    text = ""
    for page in doc:
        text += page.get_text()
    os.remove("temp.pdf")
    return text.replace("\n", "").replace(",", "")

def url_classifier(url):
    if "pdf" in url:
        return "pdf"
    if "jpeg" in url or "png" in url:
        return "image"
    c_type = get_content_type(url)
    if c_type:
        return c_type
    if "event" in url:
        return "event"
    else:
        return "default"

def get_content_type(url):
    header = requests.head(url).headers
    ctype = header.get('content-type')
    if ctype is None:
        return False
    if "pdf" in ctype:
        return "pdf"
    elif "image" in ctype:
        return "image"
    else:
        return False
