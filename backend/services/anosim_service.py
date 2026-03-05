"""
Anosim.net Service - Virtual Phone Numbers & SMS Codes
https://anosim.net
"""
import os
import httpx
from typing import Optional, List, Dict
import logging

logger = logging.getLogger(__name__)

ANOSIM_BASE_URL = "https://anosim.net/api/v1"
ANOSIM_API_KEY = os.environ.get("ANOSIM_API_KEY", "")


def get_headers():
    """Get authentication headers for Anosim API"""
    return {
        "Authorization": f"Bearer {ANOSIM_API_KEY}",
        "Content-Type": "application/json"
    }


async def get_numbers() -> dict:
    """
    Get list of all phone numbers owned by the account
    
    Returns:
        dict with status and list of numbers
    """
    if not ANOSIM_API_KEY:
        logger.error("ANOSIM_API_KEY not configured")
        return {"status": "error", "message": "Anosim service not configured"}
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{ANOSIM_BASE_URL}/numbers",
                headers=get_headers()
            )
            
            data = response.json()
            
            if response.status_code == 200:
                logger.info(f"Fetched {len(data.get('numbers', []))} numbers from Anosim")
                return {"status": "success", "numbers": data.get("numbers", [])}
            else:
                logger.error(f"Anosim get_numbers failed: {data}")
                return {"status": "error", "message": data.get("message", "Unknown error")}
                
    except Exception as e:
        logger.error(f"Anosim get_numbers exception: {str(e)}")
        return {"status": "error", "message": str(e)}


async def get_sms_for_number(phone_number: str, limit: int = 20) -> dict:
    """
    Get SMS messages received on a specific number
    
    Args:
        phone_number: The phone number to get SMS for (e.g., +491234567890)
        limit: Maximum number of messages to return
    
    Returns:
        dict with status and list of SMS messages
    """
    if not ANOSIM_API_KEY:
        logger.error("ANOSIM_API_KEY not configured")
        return {"status": "error", "message": "Anosim service not configured"}
    
    # Clean phone number - remove any formatting
    clean_number = phone_number.replace(" ", "").replace("-", "")
    if not clean_number.startswith("+"):
        clean_number = f"+{clean_number}"
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{ANOSIM_BASE_URL}/sms/{clean_number}",
                headers=get_headers(),
                params={"limit": limit}
            )
            
            data = response.json()
            
            if response.status_code == 200:
                messages = data.get("messages", data.get("sms", []))
                logger.info(f"Fetched {len(messages)} SMS for {clean_number[:8]}***")
                return {"status": "success", "messages": messages, "phone_number": clean_number}
            else:
                logger.error(f"Anosim get_sms failed: {data}")
                return {"status": "error", "message": data.get("message", "Unknown error")}
                
    except Exception as e:
        logger.error(f"Anosim get_sms exception: {str(e)}")
        return {"status": "error", "message": str(e)}


async def get_latest_sms(phone_number: str) -> dict:
    """
    Get the latest/most recent SMS for a number
    
    Args:
        phone_number: The phone number to check
    
    Returns:
        dict with the latest SMS or error
    """
    result = await get_sms_for_number(phone_number, limit=1)
    
    if result["status"] == "success" and result.get("messages"):
        return {"status": "success", "sms": result["messages"][0]}
    elif result["status"] == "success":
        return {"status": "success", "sms": None, "message": "Keine SMS vorhanden"}
    
    return result


async def get_balance() -> dict:
    """
    Get current Anosim account balance
    
    Returns:
        dict with balance information
    """
    if not ANOSIM_API_KEY:
        return {"status": "error", "message": "Anosim service not configured"}
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{ANOSIM_BASE_URL}/balance",
                headers=get_headers()
            )
            return response.json()
    except Exception as e:
        logger.error(f"Anosim balance check failed: {str(e)}")
        return {"status": "error", "message": str(e)}


async def rent_number(country: str = "DE") -> dict:
    """
    Rent a new phone number
    
    Args:
        country: Country code (e.g., DE, AT, CH)
    
    Returns:
        dict with the rented number details
    """
    if not ANOSIM_API_KEY:
        return {"status": "error", "message": "Anosim service not configured"}
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{ANOSIM_BASE_URL}/numbers/rent",
                headers=get_headers(),
                json={"country": country}
            )
            
            data = response.json()
            
            if response.status_code == 200:
                logger.info(f"Rented new number: {data.get('number', 'unknown')}")
                return {"status": "success", **data}
            else:
                logger.error(f"Anosim rent_number failed: {data}")
                return {"status": "error", "message": data.get("message", "Unknown error")}
                
    except Exception as e:
        logger.error(f"Anosim rent_number exception: {str(e)}")
        return {"status": "error", "message": str(e)}


# Helper function to extract verification codes from SMS
def extract_verification_code(sms_text: str) -> Optional[str]:
    """
    Try to extract a verification code from SMS text
    
    Args:
        sms_text: The SMS message text
    
    Returns:
        The extracted code or None
    """
    import re
    
    # Common patterns for verification codes
    patterns = [
        r'\b(\d{4,8})\b',  # 4-8 digit numbers
        r'code[:\s]+(\d{4,8})',  # "code: 123456"
        r'Code[:\s]+(\d{4,8})',
        r'CODE[:\s]+(\d{4,8})',
        r'(\d{4,8})\s*ist\s*Ihr',  # German: "123456 ist Ihr Code"
        r'lautet[:\s]+(\d{4,8})',  # German: "lautet: 123456"
    ]
    
    for pattern in patterns:
        match = re.search(pattern, sms_text)
        if match:
            return match.group(1)
    
    return None
