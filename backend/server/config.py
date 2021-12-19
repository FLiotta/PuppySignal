from pydantic import BaseSettings

class Settings(BaseSettings):
  app_name: str = "PuppySignal API"
  JWT_SECRET: str = None
  TWILIO_ACCOUNT_SID: str = None
  TWILIO_AUTH_TOKEN: str = None
  TWILIO_SERVICE_ID: str = None
  
  class Config:
    env_file = ".env"
