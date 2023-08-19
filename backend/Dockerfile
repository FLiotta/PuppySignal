FROM python:3.10

WORKDIR /srv/ps_backend
ADD ../.. .

RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y

RUN pip install poetry
RUN poetry config virtualenvs.create false
RUN poetry install -n --no-root --no-dev

EXPOSE 8000
CMD ["python", "main.py"]