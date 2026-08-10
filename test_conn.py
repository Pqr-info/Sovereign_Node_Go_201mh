import psycopg2

hosts = ["127.0.0.1", "localhost", "204.168.138.60"]
for host in hosts:
    try:
        print(f"Testing connection to {host}...")
        conn = psycopg2.connect(
            host=host,
            port=26257,
            user="root",
            dbname="defaultdb",
            connect_timeout=3
        )
        print(f"SUCCESS: Connected to {host}!")
        conn.close()
    except Exception as e:
        print(f"FAILED for {host}: {e}")
