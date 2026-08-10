import sys
import os
import gkeepapi
import psycopg2

def main():
    email = "thealanphipps@gmail.com"
    password = os.environ.get("KEEP_APP_PASSWORD")
    if not password:
        print("ERROR: KEEP_APP_PASSWORD environment variable is not set!")
        sys.exit(1)
        
    db_url = os.environ.get("DATABASE_URL", "postgresql://root@46.224.219.174:5196/defaultdb?sslmode=disable")
    
    print(f"Connecting to Google Keep for {email}...")
    keep = gkeepapi.Keep()
    try:
        keep.login(email, password)
    except Exception as e:
        print(f"Failed to login to Google Keep: {e}")
        sys.exit(1)
        
    print("Logged in successfully. Syncing notes...")
    keep.sync()
    
    notes = list(keep.all())
    print(f"Found {len(notes)} notes. Importing to CockroachDB...")
    
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    
    # Create critical_data table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS critical_data (
        id VARCHAR(255) PRIMARY KEY,
        title TEXT,
        content TEXT,
        created_at TIMESTAMP,
        updated_at TIMESTAMP,
        labels TEXT,
        is_archived BOOLEAN,
        is_trashed BOOLEAN
    );
    """)
    conn.commit()
    
    imported = 0
    for note in notes:
        labels = ",".join([label.name for label in note.labels.all()])
        # Google Keep notes can be lists or text
        content = note.text
        if isinstance(note, gkeepapi.node.List):
            items = []
            for item in note.items:
                status = "[x]" if item.checked else "[ ]"
                items.append(f"{status} {item.text}")
            content = "\n".join(items)
            
        cursor.execute("""
        INSERT INTO critical_data (id, title, content, created_at, updated_at, labels, is_archived, is_trashed)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            content = EXCLUDED.content,
            updated_at = EXCLUDED.updated_at,
            labels = EXCLUDED.labels,
            is_archived = EXCLUDED.is_archived,
            is_trashed = EXCLUDED.is_trashed;
        """, (
            note.id,
            note.title or "",
            content or "",
            note.timestamps.created,
            note.timestamps.updated,
            labels,
            note.archived,
            note.trashed
        ))
        imported += 1
        
    conn.commit()
    cursor.close()
    conn.close()
    
    print(f"Successfully imported {imported} notes into critical_data table in CockroachDB!")

if __name__ == "__main__":
    main()
