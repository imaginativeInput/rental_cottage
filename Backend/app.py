from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr

from datetime import date
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # allow_origins=["*"], # FOR TESTING LOCALLY, DO NOT RUN THIS LINE IN PRODUCTION
    allow_origins=["https://domekrzepiska.pl"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

conf = ConnectionConfig(
    MAIL_USERNAME="platynski@gmail.com",
    MAIL_PASSWORD="gaxy kybk ermd sxjn",
    MAIL_FROM="platynski@gmail.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)


class RequestPayload(BaseModel):
    email: EmailStr
    phone: str
    message: str
    startDate: date
    endDate: date
    people: int


async def send_notification(client_email: str, client_phone: str, message_content: str):
    fm = FastMail(conf)

    message = MessageSchema(
        subject="Rezerwacja",
        recipients=["platynski@gmail.com"],
        # body=f"Wiadomość od {client_email}\nTelefon: {client_phone}\n\n{message_content}",
        body=f"""
                <h2>Rezerwacja</h2>
                <p><strong>Email:</strong> {client_email}</p>
                <p><strong>Telefon:</strong> {client_phone}</p>
                \n\n
                {message_content}
            """,

        # subtype="plain",
        subtype="html",
        headers={
            "From": client_email,
            "Reply-To": client_email,
        },
    )

    await fm.send_message(message)


@app.get("/api/data")
def get_data():
    return {"message", "Hello from FastAPI!"}


@app.post("/api/send-message")
async def send_message(payload: RequestPayload):
    if payload.startDate >= payload.endDate:
        raise HTTPException(
            status_code=400,
            detail='\nProsimy ustawić datę planowanego pobytu w sekcji "REZERWACJA" lub klikając na datę w pasku pod tytułem strony.',
        )

    is_available = True

    if is_available:
        await send_notification(
            client_email=payload.email,
            client_phone=payload.phone,
            # client_name="Imię klienta",
            # message_content=f"Liczba osób: {payload.people}\nOd dnia: {payload.startDate}\nDo dnia: {payload.endDate}\n\nTreść:\n{payload.message}",
            message_content=f"""
                <p><strong>Liczba osób:</strong> {payload.people}</p>
                <p><strong>Od dnia:</strong> {payload.startDate}</p>
                <p><strong>Do dnia:</strong> {payload.endDate}</p>
                <p><strong>Treść wiadomości:</strong></p>
                <p>{payload.message}</p>
            """,
        )

        return {"message": "Dziękujemy za złożenie rezerwacji, odezwiemy się wkrótce!"}
    else:
        return {
            "message": "Niestety dom nie jest dostępny w tym terminie. W razie pytań prosimy dzwonić na numer xxx-xxx-xxx"
        }

# For local testing only, it is necessary for local hosting. !IMPORTANT
# app.mount("/", StaticFiles(directory="../Frontend/dist", html=True), name="static")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=10000)
