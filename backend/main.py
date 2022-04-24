from server.factory import create_app

app = create_app()

if __name__ == "__main__":
  import uvicorn

  uvicorn.run(
    "main:app", 
    log_level="debug", 
    reload=True,
    host="localhost",
    port=8000
  )