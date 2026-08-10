FROM python:3.10-slim

WORKDIR /app

RUN pip install --no-cache-dir Pillow

COPY anchor_proxy.py .
COPY media/ ./media/

EXPOSE 80

CMD ["python", "-u", "anchor_proxy.py"]
