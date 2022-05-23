from server.factory import create_app

app = create_app()

if __name__ == "__main__":
  import uvicorn

  uvicorn.run(
    "main:app", 
    log_level="debug", 
    reload=True,
    host="192.168.0.140",
    port=8005
  )