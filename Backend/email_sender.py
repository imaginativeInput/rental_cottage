from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import BaseModel, EmailStr
from datetime import date
from typing import List

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

conf = ConnectionConfig(
    MAIL_USERNAME="platynski@gmail.com",
    MAIL_PASSWORD="gaxy kybk ermd sxjn",
    MAIL_FROM=f"imaginative.input@gmail.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)


class AvailabilityRequest(BaseModel):
    startDate: date
    endDate: date
    people: int
    email: EmailStr


async def send_notification(client_email: str, client_name: str, message_content: str):
    fm = FastMail(conf)

    message = MessageSchema(
        subject="Rezerwacja!",
        recipients=["platynski@gmail.com"],
        body=f"Message from {client_name} ({client_email}):\n\n{message_content}",
        subtype="plain",
        headers={
            "From": client_email,
            "Reply-To": client_email,
        },
    )

    await fm.send_message(message)


@app.get("/check-availability")
async def check_availability(request: AvailabilityRequest):
    if request.startDate >= request.endDate:
        raise HTTPException(
            status_code=400, detail="End date must be after start date."
        )

    is_available = True

    if is_available:
        await send_notification(
            client_email=request.email,
            client_name="Client Name",
            message_content=f"Availability request for {request.startDate} to {request.endDate} with {request.people} people.",
        )

        return {"message": "The house is available. We will contact you shortly!"}
    else:
        return {"message": "The house is not available for the selected dates."}
