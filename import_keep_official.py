import os
import sys
import json
import psycopg2
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

def main():
    # Load OAuth2 credentials
    adc_path = "application_default_credentials.json"
    if not os.path.exists(adc_path):
        print(f"ERROR: {adc_path} not found!")
        sys.exit(1)
        
    with open(adc_path, "r") as f:
        creds_data = json.load(f)
        
    # Check if this is an authorized_user credential
    if creds_data.get("type") != "authorized_user":
        print("ERROR: Credential type must be authorized_user!")
        sys.exit(1)
        
    # Build credentials object
    creds = Credentials(
        token=None,  # will be refreshed
        refresh_token=creds_data["refresh_token"],
        token_uri="https://oauth2.googleapis.com/token",
        client_id=creds_data["client_id"],
        client_secret=creds_data["client_secret"]
    )
    
    db_url = os.environ.get("DATABASE_URL", "postgresql://root@46.224.219.174:5196/defaultdb?sslmode=disable")
    
    print("Building Google Keep service client...")
    try:
        service = build("keep", "v1", credentials=creds)
    except Exception as e:
        print(f"Failed to build Keep service: {e}")
        sys.exit(1)
        
    print("Listing Keep notes...")
    try:
        # Fetch notes
        result = service.notes().list().execute()
        notes = result.get("notes", [])
    except Exception as e:
        print(f"Failed to list Keep notes: {e}")
        print("Note: Google Keep API only supports Workspace domain accounts. Personal @gmail.com accounts are not supported by the official API.")
        sys.exit(1)
        
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
        # Official API returns details differently
        note_name = note.get("name", "")
        note_id = note_name.split("/")[-1] if "/" in note_name else note_name
        title = note.get("title", "")
        
        # Get content body
        body = note.get("body", {})
        text = body.get("text", {}).get("text", "")
        
        # Get list items if it's a list note
        list_items = []
        for item in note.get("listItems", []):
            checked = "[x]" if item.get("checked") else "[ ]"
            item_text = item.get("text", {}).get("text", "")
            list_items.append(f"{checked} {item_text}")
        if list_items:
            text = "\n".join(list_items)
            
        cursor.execute("""
        INSERT INTO critical_data (id, title, content, created_at, updated_at, labels, is_archived, is_trashed)
        VALUES (%s, %s, %s, NOW(), NOW(), %s, %s, %s)
        ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            content = EXCLUDED.content,
            updated_at = EXCLUDED.updated_at,
            labels = EXCLUDED.labels,
            is_archived = EXCLUDED.is_archived,
            is_trashed = EXCLUDED.is_trashed;
        """, (
            note_id,
            title,
            text,
            "", # labels
            False, # is_archived
            False  # is_trashed
        ))
        imported += 1
        
    conn.commit()
    cursor.close()
    conn.close()
    print(f"Successfully imported {imported} notes into critical_data table in CockroachDB!")

if __name__ == "__main__":
    main()
