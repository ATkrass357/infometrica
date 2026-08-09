import os
import json
import uuid
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv()

EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY")
MODEL_PROVIDER = "gemini"
MODEL_NAME = "gemini-3-flash-preview"

SYSTEM_MESSAGE = (
    "Du bist ein QA-Experte, der professionelle App-Test-Aufgaben auf Deutsch fuer "
    "ein internes Mitarbeiter-Panel erstellt. Du kennst mobile Apps aus dem App Store "
    "und Google Play (Banking, Fintech, Krypto, Social, Shopping, Reise usw.). "
    "Du schreibst klare, konkrete und realistische Testanweisungen. "
    "Antworte AUSSCHLIESSLICH mit einem gueltigen JSON-Objekt, ohne Markdown, ohne Code-Fences, "
    "ohne zusaetzlichen Text."
)


def _build_prompt(app_name: str, existing_apps: list[str]) -> str:
    existing = ", ".join(existing_apps) if existing_apps else "keine"
    return f"""Erstelle eine App-Test-Aufgabe fuer die App: "{app_name}".

Die Aufgabe wird einem Mitarbeiter zugewiesen, der die App auf Benutzerfreundlichkeit,
Funktionalitaet und moegliche Fehler testet. Schreibe konkret auf diese App bezogen
(typische Funktionen, Onboarding, Kernfeatures).

Bereits vorhandene App-Test-Aufgaben (NICHT wiederholen, erzeuge etwas Eigenstaendiges): {existing}

Gib ein JSON-Objekt mit GENAU diesen Schluesseln zurueck:
{{
  "title": "Kurzer, praeziser Titel der Aufgabe (max. 80 Zeichen), inkl. App-Name",
  "einleitung": "Mindestens 4 Saetze: Ueberblick was getestet wird und warum.",
  "schritt1": "Mindestens 3 Saetze: konkreter erster Testschritt (Installation/Onboarding/Registrierung).",
  "schritt2": "Mindestens 3 Saetze: konkreter zweiter Testschritt (Kernfunktionen der App testen).",
  "schritt3": "Mindestens 3 Saetze: konkreter dritter Testschritt (Fehler dokumentieren, Report erstellen)."
}}

Nur das JSON-Objekt, sonst nichts."""


def _extract_json(text: str) -> dict:
    t = (text or "").strip()
    if t.startswith("```"):
        t = t.split("```", 2)[1] if "```" in t[3:] else t.strip("`")
        if t.lstrip().lower().startswith("json"):
            t = t.lstrip()[4:]
    start = t.find("{")
    end = t.rfind("}")
    if start != -1 and end != -1 and end > start:
        t = t[start:end + 1]
    return json.loads(t)


async def generate_app_test_task(app_name: str, existing_apps: list[str]) -> dict:
    """Generate a structured German app-test task via Gemini 3 Flash. Returns dict with
    title, einleitung, schritt1, schritt2, schritt3."""
    if not EMERGENT_LLM_KEY:
        raise RuntimeError("EMERGENT_LLM_KEY nicht konfiguriert")

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"apptask-{uuid.uuid4()}",
        system_message=SYSTEM_MESSAGE,
    ).with_model(MODEL_PROVIDER, MODEL_NAME)

    user_message = UserMessage(text=_build_prompt(app_name, existing_apps))
    response = await chat.send_message(user_message)

    data = _extract_json(response if isinstance(response, str) else str(response))
    return {
        "title": (data.get("title") or "").strip(),
        "einleitung": (data.get("einleitung") or "").strip(),
        "schritt1": (data.get("schritt1") or "").strip(),
        "schritt2": (data.get("schritt2") or "").strip(),
        "schritt3": (data.get("schritt3") or "").strip(),
    }
