import json
import psycopg2
from bs4 import BeautifulSoup

def main():
    with open(r"C:\Users\theal\.gemini\antigravity-cli\brain\27cc7b87-864e-4692-aae4-745760bc1eb9\scratch\keep_dom.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    dom = data["dom"]
    soup = BeautifulSoup(dom, "html.parser")
    
    cards = soup.find_all("div", class_="IZ65Hb-n0tgWb")
    print(f"Found {len(cards)} note cards.")
    
    db_url = "postgresql://root@46.224.219.174:5196/antigravity?sslmode=disable"
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    
    # Create critical_data table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS critical_data (
        id SERIAL PRIMARY KEY,
        title TEXT,
        content TEXT,
        created_at TIMESTAMP DEFAULT NOW()
    );
    """)
    conn.commit()
    
    imported = 0
    for card in cards:
        # Extract all text in order
        all_text = card.get_text(separator="\n").strip()
        lines = [line.strip() for line in all_text.split("\n") if line.strip()]
        if not lines:
            continue
            
        title = lines[0]
        content = "\n".join(lines[1:]) if len(lines) > 1 else ""
        
        # Skip empty notes
        if not title and not content:
            continue
            
        # Avoid duplicate titles
        cursor.execute("SELECT id FROM critical_data WHERE title = %s;", (title,))
        if cursor.fetchone():
            continue
            
        cursor.execute("""
        INSERT INTO critical_data (title, content)
        VALUES (%s, %s);
        """, (title, content))
        imported += 1
        
    conn.commit()
    cursor.close()
    conn.close()
    print(f"Successfully imported {imported} notes from Keep DOM into CockroachDB 'critical_data' table!")

if __name__ == "__main__":
    main()
