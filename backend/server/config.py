from pydantic import BaseSettings

class Settings(BaseSettings):
  app_name: str = "PuppySignal API"
  JWT_SECRET: str = None
  aws_application_key_id: str = None
  aws_application_key: str = None
  s3_bucket: str = None
  s3_region: str = None

  redis_host: str = None
  redis_port: str = None

settings = Settings()
