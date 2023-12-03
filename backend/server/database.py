import os
import sys
import databases
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

if "unittest" in sys.modules or "pytest" in sys.modules:
  SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db?check_same_thread=False"
  database = databases.Database(SQLALCHEMY_DATABASE_URL, force_rollback=True)
else:
  db_engine = os.environ.get("db_engine")
  db_username = os.environ.get("db_username")
  db_password = os.environ.get("db_password")
  db_host = os.environ.get("db_host")
  db_name = os.environ.get("db_name")

  SQLALCHEMY_DATABASE_URL = f"{db_engine}://{db_username}:{db_password}@{db_host}/{db_name}"
  database = databases.Database(SQLALCHEMY_DATABASE_URL)

engine = create_engine(SQLALCHEMY_DATABASE_URL, future=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()