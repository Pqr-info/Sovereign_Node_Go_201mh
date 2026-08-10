import json
import urllib.request
import urllib.parse
import os

RQLITE_URL = 'http://localhost:4001/db/query'
QUERY = 'SELECT ticket_id, agent_id, index_0_48, label, created_at FROM ticket'
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), '..', 'data', 'seed_tickets.cypher')

def fetch_tickets():
    query_params = urllib.parse.urlencode({'q': QUERY})
    url = f"{RQLITE_URL}?{query_params}"
    
    req = urllib.request.Request(url)
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            results = data.get('results', [])
            if not results:
                return []
            
            result_obj = results[0]
            if 'error' in result_obj:
                print(f"Error querying rqlite: {result_obj['error']}")
                return []
                
            columns = result_obj.get('columns', [])
            values = result_obj.get('values', [])
            
            tickets = []
            for val in values:
                ticket = dict(zip(columns, val))
                tickets.append(ticket)
                
            return tickets
    except Exception as e:
        print(f"Failed to fetch tickets: {e}")
        return []

def map_severity(index_0_48):
    """Maps 0-48 index to a 1-5 severity scale."""
    if index_0_48 is None:
        return 3
    # 0-9 -> 1, 10-19 -> 2, 20-29 -> 3, 30-39 -> 4, 40-48 -> 5
    mapped = (index_0_48 // 10) + 1
    return min(5, max(1, mapped))

def escape_cypher_string(s):
    if not s:
        return ""
    return str(s).replace("'", "\\'")

def generate_cypher(tickets):
    cypher_statements = []
    cypher_statements.append("// ADER Knowledge Graph Seed Data")
    cypher_statements.append("// Generated from 49x49 relational ticketing cube")
    cypher_statements.append("")
    
    for t in tickets:
        ticket_id = t.get('ticket_id')
        agent_id = t.get('agent_id')
        index_0_48 = t.get('index_0_48', 0)
        label = escape_cypher_string(t.get('label', ''))
        created_at = escape_cypher_string(t.get('created_at', ''))
        
        severity = map_severity(index_0_48)
        description = f"Historical ticket migrated from 49x49 cube (Index: {index_0_48})"
        
        stmt = f"""
MERGE (p:Problem {{id: '{ticket_id}'}})
SET p.title = '{label}',
    p.severity = {severity},
    p.description = '{description}',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '{created_at}',
    p.tags = ['historical_ticket']

MERGE (e:Entity {{id: '{agent_id}'}})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {{role: 'affected'}}]->(e)

// Default Observation Node
MERGE (o:Observation {{id: '{ticket_id}_obs'}})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '{created_at}',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {{evidence_strength: 0.1, method: 'inductive'}}]->(o)
"""
        cypher_statements.append(stmt.strip())
        cypher_statements.append("")
        
    return "\n".join(cypher_statements)

def main():
    print("Fetching tickets from rqlite...")
    tickets = fetch_tickets()
    print(f"Found {len(tickets)} tickets.")
    
    if not tickets:
        print("No tickets to process.")
        return
        
    print("Generating Cypher seed...")
    cypher_data = generate_cypher(tickets)
    
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(cypher_data)
        
    print(f"Successfully generated seed file: {OUTPUT_FILE}")

if __name__ == '__main__':
    main()
