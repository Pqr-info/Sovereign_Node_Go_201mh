FROM python:3.11-alpine

WORKDIR /app
COPY adapter.py discovery.py shamir.py /app/

RUN pip install requests dnspython secretsharing

EXPOSE 8200

CMD ["python", "adapter.py"]
