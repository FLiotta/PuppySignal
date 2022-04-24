import sys
import databases
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

if "unittest" in sys.modules or "pytest" in sys.modules:
  SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db?check_same_thread=False"
  database = databases.Database(SQLALCHEMY_DATABASE_URL, force_rollback=True)
else:
  SQLALCHEMY_DATABASE_URL = "postgresql://postgres:postgres@localhost/puppysignal"
  database = databases.Database(SQLALCHEMY_DATABASE_URL)

engine = create_engine(SQLALCHEMY_DATABASE_URL, future=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()