from pydantic import BaseSettings

class Settings(BaseSettings):
  app_name: str = "PuppySignal API"
  JWT_SECRET: str = None
  TWILIO_ACCOUNT_SID: str = None
  TWILIO_AUTH_TOKEN: str = None
  TWILIO_SERVICE_ID: str = None
  b2_endpoint_url: str = None
  b2_application_key_id: str = None
  b2_application_key: str = None
  b2_bucket: str = None
  
  class Config:
    env_file = ".env"
