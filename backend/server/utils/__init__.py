import logging

import jwt
import boto3
from mypy_boto3_s3 import S3Client

from typing import Optional
from botocore.exceptions import ClientError

from functools import lru_cache

from fastapi import Header
from fastapi.param_functions import Depends
from fastapi.exceptions import HTTPException

from server.database import SessionLocal
from server import config


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@lru_cache()
def get_settings() -> config.Settings:
    return config.Settings()


settings = get_settings()


def get_boto3_client(settings: config.Settings = Depends(get_settings)) -> S3Client:
    try:
        s3: S3Client = boto3.client(
            "s3",
            aws_access_key_id=settings.aws_application_key_id,
            aws_secret_access_key=settings.aws_application_key,
            region_name=settings.s3_region,
            config=boto3.session.Config(
                signature_version="s3v4",
                s3={
                    "signature_version": "s3v4",
                    "use_accelerate_endpoint": False,
                },
            ),
        )
    except Exception:
        raise HTTPException(status_code=500, detail="Cannot initialize s3.")

    return s3


def presign_url(
    boto3_client: S3Client, object_name: str, expiration: int = 3600
) -> Optional[str]:
    try:
        presigned_url = boto3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": settings.s3_bucket, "Key": object_name},
            ExpiresIn=expiration,
        )
    except ClientError as e:
        logging.error(
            f"Failed to generate presigned-url for object {object_name} at bucket {settings.s3_bucket}: {e}"
        )
        return None

    return presigned_url


async def get_user(
    token: str = Header(...), settings: config.Settings = Depends(get_settings)
):
    decoded_user = jwt.decode(token, settings.JWT_SECRET, algorithms="HS256")

    return decoded_user


async def protected_route(
    token: str = Header(...), settings: config.Settings = Depends(get_settings)
):
    if token is None:
        raise HTTPException(status_code=401, detail="Authorization token not found.")

    try:
        jwt.decode(token, settings.JWT_SECRET, algorithms="HS256")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Token.")
