import ipaddress
import os

from dotenv import load_dotenv
from fastapi import Request
from datetime import datetime, timezone

load_dotenv()

DEMO_MODE = os.getenv("DEMO_MODE", "false").lower() == "true"
DEFAULT_DEMO_COUNTRY = "IN"


def get_client_ip(request: Request):
    if DEMO_MODE and request.headers.get("x-demo-ip"):
        return request.headers["x-demo-ip"].strip()
    return request.client.host if request.client else None


def truncate_ip(ip):
    """Keep only the network part (/24 for IPv4, /48 for IPv6), never the full address."""
    if not ip:
        return None
    try:
        addr = ipaddress.ip_address(ip)
    except ValueError:
        return None
    prefix = 24 if addr.version == 4 else 48
    return str(ipaddress.ip_network(f"{ip}/{prefix}", strict=False))


def summarize_ua(user_agent):
    """Reduce the full user-agent string to e.g. 'Chrome / Windows'."""
    if not user_agent:
        return "Unknown"
    s = user_agent.lower()
    if "edg/" in s:
        browser = "Edge"
    elif "opr/" in s or "opera" in s:
        browser = "Opera"
    elif "chrome" in s:
        browser = "Chrome"
    elif "firefox" in s:
        browser = "Firefox"
    elif "safari" in s:
        browser = "Safari"
    else:
        browser = "Other"
    if "windows" in s:
        os_name = "Windows"
    elif "android" in s:
        os_name = "Android"
    elif "iphone" in s or "ipad" in s:
        os_name = "iOS"
    elif "mac os" in s or "macintosh" in s:
        os_name = "macOS"
    elif "linux" in s:
        os_name = "Linux"
    else:
        os_name = "Other"
    return f"{browser} / {os_name}"


def get_country(request: Request):
    """Country only, never a city. In production this would be an offline GeoIP lookup."""
    if DEMO_MODE:
        header = request.headers.get("x-demo-country")
        if header:
            return header.strip().upper()[:2]
        return DEFAULT_DEMO_COUNTRY
    return None

def get_hour(request: Request) -> int:
    """Hour of day in UTC (0-23). In demo mode an X-Demo-Hour header overrides it."""
    if DEMO_MODE:
        header = request.headers.get("x-demo-hour")
        if header and header.isdigit() and 0 <= int(header) <= 23:
            return int(header)
    return datetime.now(timezone.utc).hour