// ADER Knowledge Graph Seed Data
// Generated from 49x49 relational ticketing cube

MERGE (p:Problem {id: 'ticket_8_logs'})
SET p.title = 'ticket_ticket_8_logs',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 8)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:02:40Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'logs'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_8_logs_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:02:40Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_12_logs'})
SET p.title = 'ticket_ticket_12_logs',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 12)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:02:40Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'logs'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_12_logs_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:02:40Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_38_logs'})
SET p.title = 'ticket_ticket_38_logs',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 38)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:02:40Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'logs'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_38_logs_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:02:40Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_34_logs'})
SET p.title = 'ticket_ticket_34_logs',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 34)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:02:40Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'logs'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_34_logs_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:02:40Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_21_4ce83396-dcd2-4026-8522-198b26d6fdc8'})
SET p.title = 'ticket_ticket_21_4ce83396-dcd2-4026-8522-198b26d6fdc8',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 31)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:02:40Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: '4ce83396-dcd2-4026-8522-198b26d6fdc8'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_21_4ce83396-dcd2-4026-8522-198b26d6fdc8_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:02:40Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_36_4ce83396-dcd2-4026-8522-198b26d6fdc8'})
SET p.title = 'ticket_ticket_36_4ce83396-dcd2-4026-8522-198b26d6fdc8',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 30)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:02:40Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: '4ce83396-dcd2-4026-8522-198b26d6fdc8'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_36_4ce83396-dcd2-4026-8522-198b26d6fdc8_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:02:40Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_35_logs'})
SET p.title = 'ticket_ticket_35_logs',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 35)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:02:40Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'logs'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_35_logs_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:02:40Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_40_logs'})
SET p.title = 'ticket_ticket_40_logs',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 40)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:02:40Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'logs'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_40_logs_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:02:40Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_20_5919c155-256e-4374-898f-b5d6b2a4d36b'})
SET p.title = 'ticket_ticket_20_5919c155-256e-4374-898f-b5d6b2a4d36b',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 32)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:02:40Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: '5919c155-256e-4374-898f-b5d6b2a4d36b'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_20_5919c155-256e-4374-898f-b5d6b2a4d36b_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:02:40Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_15_5919c155-256e-4374-898f-b5d6b2a4d36b'})
SET p.title = 'ticket_ticket_15_5919c155-256e-4374-898f-b5d6b2a4d36b',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 46)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:02:40Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: '5919c155-256e-4374-898f-b5d6b2a4d36b'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_15_5919c155-256e-4374-898f-b5d6b2a4d36b_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:02:40Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_25_logs'})
SET p.title = 'ticket_ticket_25_logs',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 25)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:02:40Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'logs'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_25_logs_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:02:40Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_29_28'})
SET p.title = 'ticket_ticket_29_28',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 37)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:02:40Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: '28'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_29_28_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:02:40Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_15_logs'})
SET p.title = 'ticket_ticket_15_logs',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 15)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:02:40Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'logs'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_15_logs_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:02:40Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_33_logs'})
SET p.title = 'ticket_ticket_33_logs',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 33)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:02:40Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'logs'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_33_logs_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:02:40Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_1_logs'})
SET p.title = 'ticket_ticket_1_logs',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 1)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:02:40Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'logs'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_1_logs_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:02:40Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_43_remote-windows-admin-master'})
SET p.title = 'ticket_ticket_43_remote-windows-admin-master',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 43)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:02:40Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'remote-windows-admin-master'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_43_remote-windows-admin-master_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:02:40Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_37_remote-windows-admin-master'})
SET p.title = 'ticket_ticket_37_remote-windows-admin-master',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 37)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:02:40Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'remote-windows-admin-master'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_37_remote-windows-admin-master_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:02:40Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_40_remote-windows-admin-master'})
SET p.title = 'ticket_ticket_40_remote-windows-admin-master',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 40)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:02:40Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'remote-windows-admin-master'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_40_remote-windows-admin-master_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:02:40Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_33_remote-windows-admin-master'})
SET p.title = 'ticket_ticket_33_remote-windows-admin-master',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 33)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:02:40Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'remote-windows-admin-master'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_33_remote-windows-admin-master_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:02:40Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_32_antigravity'})
SET p.title = 'ticket_ticket_32_antigravity',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 32)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:15Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_32_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:15Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_17_antigravity'})
SET p.title = 'ticket_ticket_17_antigravity',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 17)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:15Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_17_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:15Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_12_antigravity'})
SET p.title = 'ticket_ticket_12_antigravity',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 12)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:15Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_12_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:15Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_38_antigravity'})
SET p.title = 'ticket_ticket_38_antigravity',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 38)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:15Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_38_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:15Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_3_antigravity'})
SET p.title = 'ticket_ticket_3_antigravity',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 3)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:16Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_3_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:16Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_16_antigravity'})
SET p.title = 'ticket_ticket_16_antigravity',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 16)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:16Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_16_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:16Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_20_antigravity'})
SET p.title = 'ticket_ticket_20_antigravity',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 20)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:16Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_20_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:16Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_39_antigravity'})
SET p.title = 'ticket_ticket_39_antigravity',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 39)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:18Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_39_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:18Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_26_antigravity'})
SET p.title = 'ticket_ticket_26_antigravity',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 26)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:18Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_26_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:18Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_41_antigravity'})
SET p.title = 'ticket_ticket_41_antigravity',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 41)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:18Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_41_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:18Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_47_antigravity'})
SET p.title = 'ticket_ticket_47_antigravity',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 47)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:18Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_47_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:18Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_1_antigravity'})
SET p.title = 'ticket_ticket_1_antigravity',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 1)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:18Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_1_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:18Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_13_antigravity'})
SET p.title = 'ticket_ticket_13_antigravity',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 13)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:18Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_13_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:18Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_9_antigravity'})
SET p.title = 'ticket_ticket_9_antigravity',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 9)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:18Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_9_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:18Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_40_antigravity'})
SET p.title = 'ticket_ticket_40_antigravity',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 40)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:18Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_40_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:18Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_45_antigravity'})
SET p.title = 'ticket_ticket_45_antigravity',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 45)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:19Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_45_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:19Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_21_antigravity'})
SET p.title = 'ticket_ticket_21_antigravity',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 21)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:19Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_21_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:19Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_43_antigravity'})
SET p.title = 'ticket_ticket_43_antigravity',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 43)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:19Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_43_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:19Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_25_antigravity'})
SET p.title = 'ticket_ticket_25_antigravity',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 25)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:19Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_25_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:19Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_35_antigravity'})
SET p.title = 'ticket_ticket_35_antigravity',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 35)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:19Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_35_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:19Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_2_antigravity'})
SET p.title = 'ticket_ticket_2_antigravity',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 2)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:20Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_2_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:20Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_14_antigravity'})
SET p.title = 'ticket_ticket_14_antigravity',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 14)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:22Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_14_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:22Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_48_antigravity'})
SET p.title = 'ticket_ticket_48_antigravity',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 48)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:24Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_48_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:24Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_0_antigravity'})
SET p.title = 'ticket_ticket_0_antigravity',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 0)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:24Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_0_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:24Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_11_antigravity'})
SET p.title = 'ticket_ticket_11_antigravity',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 11)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:30Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_11_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:30Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_24_antigravity'})
SET p.title = 'ticket_ticket_24_antigravity',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 24)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:36Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_24_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:36Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_31_antigravity'})
SET p.title = 'ticket_ticket_31_antigravity',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 31)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:36Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_31_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:36Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_8_antigravity'})
SET p.title = 'ticket_ticket_8_antigravity',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 8)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:36Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_8_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:36Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_15_antigravity'})
SET p.title = 'ticket_ticket_15_antigravity',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 15)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:37Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_15_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:37Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_37_antigravity'})
SET p.title = 'ticket_ticket_37_antigravity',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 37)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:37Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_37_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:37Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_42_antigravity'})
SET p.title = 'ticket_ticket_42_antigravity',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 42)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:37Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_42_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:37Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_33_antigravity'})
SET p.title = 'ticket_ticket_33_antigravity',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 33)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:37Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_33_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:37Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_34_antigravity'})
SET p.title = 'ticket_ticket_34_antigravity',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 34)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:38Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_34_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:38Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_27_antigravity'})
SET p.title = 'ticket_ticket_27_antigravity',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 27)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:39Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_27_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:39Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_23_antigravity'})
SET p.title = 'ticket_ticket_23_antigravity',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 23)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:39Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_23_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:39Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_29_antigravity'})
SET p.title = 'ticket_ticket_29_antigravity',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 29)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:40Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_29_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:40Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_19_antigravity'})
SET p.title = 'ticket_ticket_19_antigravity',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 19)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:40Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_19_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:40Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_22_antigravity'})
SET p.title = 'ticket_ticket_22_antigravity',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 22)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:41Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_22_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:41Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_7_antigravity'})
SET p.title = 'ticket_ticket_7_antigravity',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 7)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:41Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_7_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:41Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_36_antigravity'})
SET p.title = 'ticket_ticket_36_antigravity',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 36)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:47Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_36_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:47Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_28_antigravity'})
SET p.title = 'ticket_ticket_28_antigravity',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 28)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:47Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_28_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:47Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_6_antigravity'})
SET p.title = 'ticket_ticket_6_antigravity',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 6)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:47Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_6_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:47Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_4_antigravity'})
SET p.title = 'ticket_ticket_4_antigravity',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 4)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:53Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_4_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:53Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_44_antigravity'})
SET p.title = 'ticket_ticket_44_antigravity',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 44)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:53Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_44_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:53Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_5_antigravity'})
SET p.title = 'ticket_ticket_5_antigravity',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 5)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:59Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_5_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:59Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_46_antigravity'})
SET p.title = 'ticket_ticket_46_antigravity',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 46)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:07:59Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_46_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:07:59Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_18_antigravity'})
SET p.title = 'ticket_ticket_18_antigravity',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 18)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:08:07Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_18_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:08:07Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_30_antigravity'})
SET p.title = 'ticket_ticket_30_antigravity',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 30)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:08:09Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_30_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:08:09Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_10_antigravity'})
SET p.title = 'ticket_ticket_10_antigravity',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 10)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:08:27Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_10_antigravity_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:08:27Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_45_antigravity-backup'})
SET p.title = 'ticket_ticket_45_antigravity-backup',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 45)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:07Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_45_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:07Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_11_antigravity-backup'})
SET p.title = 'ticket_ticket_11_antigravity-backup',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 11)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:07Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_11_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:07Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_15_antigravity-backup'})
SET p.title = 'ticket_ticket_15_antigravity-backup',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 15)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:07Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_15_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:07Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_31_antigravity-backup'})
SET p.title = 'ticket_ticket_31_antigravity-backup',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 31)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:07Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_31_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:07Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_18_antigravity-backup'})
SET p.title = 'ticket_ticket_18_antigravity-backup',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 18)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:07Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_18_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:07Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_16_antigravity-backup'})
SET p.title = 'ticket_ticket_16_antigravity-backup',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 16)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:07Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_16_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:07Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_19_antigravity-backup'})
SET p.title = 'ticket_ticket_19_antigravity-backup',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 19)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:07Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_19_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:07Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_46_antigravity-backup'})
SET p.title = 'ticket_ticket_46_antigravity-backup',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 46)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:07Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_46_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:07Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_20_antigravity-backup'})
SET p.title = 'ticket_ticket_20_antigravity-backup',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 20)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:07Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_20_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:07Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_0_antigravity-backup'})
SET p.title = 'ticket_ticket_0_antigravity-backup',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 0)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:08Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_0_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:08Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_22_antigravity-backup'})
SET p.title = 'ticket_ticket_22_antigravity-backup',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 22)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:08Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_22_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:08Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_39_antigravity-backup'})
SET p.title = 'ticket_ticket_39_antigravity-backup',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 39)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:08Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_39_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:08Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_47_antigravity-backup'})
SET p.title = 'ticket_ticket_47_antigravity-backup',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 47)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:08Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_47_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:08Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_17_antigravity-backup'})
SET p.title = 'ticket_ticket_17_antigravity-backup',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 17)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:08Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_17_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:08Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_25_antigravity-backup'})
SET p.title = 'ticket_ticket_25_antigravity-backup',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 25)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:08Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_25_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:08Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_37_antigravity-backup'})
SET p.title = 'ticket_ticket_37_antigravity-backup',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 37)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:08Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_37_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:08Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_42_antigravity-backup'})
SET p.title = 'ticket_ticket_42_antigravity-backup',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 42)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:08Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_42_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:08Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_43_antigravity-backup'})
SET p.title = 'ticket_ticket_43_antigravity-backup',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 43)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:09Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_43_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:09Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_27_antigravity-backup'})
SET p.title = 'ticket_ticket_27_antigravity-backup',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 27)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:09Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_27_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:09Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_35_antigravity-backup'})
SET p.title = 'ticket_ticket_35_antigravity-backup',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 35)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:09Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_35_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:09Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_30_antigravity-backup'})
SET p.title = 'ticket_ticket_30_antigravity-backup',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 30)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:11Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_30_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:11Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_3_antigravity-backup'})
SET p.title = 'ticket_ticket_3_antigravity-backup',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 3)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:13Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_3_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:13Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_32_antigravity-backup'})
SET p.title = 'ticket_ticket_32_antigravity-backup',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 32)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:13Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_32_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:13Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_38_antigravity-backup'})
SET p.title = 'ticket_ticket_38_antigravity-backup',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 38)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:14Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_38_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:14Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_48_antigravity-backup'})
SET p.title = 'ticket_ticket_48_antigravity-backup',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 48)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:14Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_48_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:14Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_7_antigravity-backup'})
SET p.title = 'ticket_ticket_7_antigravity-backup',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 7)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:14Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_7_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:14Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_5_antigravity-backup'})
SET p.title = 'ticket_ticket_5_antigravity-backup',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 5)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:14Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_5_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:14Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_13_antigravity-backup'})
SET p.title = 'ticket_ticket_13_antigravity-backup',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 13)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:15Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_13_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:15Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_29_antigravity-backup'})
SET p.title = 'ticket_ticket_29_antigravity-backup',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 29)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:15Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_29_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:15Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_33_antigravity-backup'})
SET p.title = 'ticket_ticket_33_antigravity-backup',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 33)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:15Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_33_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:15Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_14_antigravity-backup'})
SET p.title = 'ticket_ticket_14_antigravity-backup',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 14)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:15Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_14_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:15Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_23_antigravity-backup'})
SET p.title = 'ticket_ticket_23_antigravity-backup',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 23)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:15Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_23_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:15Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_41_antigravity-backup'})
SET p.title = 'ticket_ticket_41_antigravity-backup',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 41)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:15Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_41_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:15Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_9_antigravity-backup'})
SET p.title = 'ticket_ticket_9_antigravity-backup',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 9)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:23Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_9_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:23Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_26_antigravity-backup'})
SET p.title = 'ticket_ticket_26_antigravity-backup',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 26)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:29Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_26_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:29Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_28_antigravity-backup'})
SET p.title = 'ticket_ticket_28_antigravity-backup',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 28)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:29Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-backup'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_28_antigravity-backup_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:29Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_40_antigravity-cli'})
SET p.title = 'ticket_ticket_40_antigravity-cli',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 40)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:31Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-cli'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_40_antigravity-cli_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:31Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_0_antigravity-cli'})
SET p.title = 'ticket_ticket_0_antigravity-cli',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 0)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:32Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-cli'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_0_antigravity-cli_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:32Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_29_antigravity-cli'})
SET p.title = 'ticket_ticket_29_antigravity-cli',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 29)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:33Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-cli'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_29_antigravity-cli_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:33Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_4_antigravity-cli'})
SET p.title = 'ticket_ticket_4_antigravity-cli',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 4)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:33Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-cli'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_4_antigravity-cli_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:33Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_35_antigravity-cli'})
SET p.title = 'ticket_ticket_35_antigravity-cli',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 35)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:33Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-cli'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_35_antigravity-cli_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:33Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_26_antigravity-cli'})
SET p.title = 'ticket_ticket_26_antigravity-cli',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 26)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:33Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-cli'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_26_antigravity-cli_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:33Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_16_antigravity-cli'})
SET p.title = 'ticket_ticket_16_antigravity-cli',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 16)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:34Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-cli'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_16_antigravity-cli_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:34Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_6_antigravity-cli'})
SET p.title = 'ticket_ticket_6_antigravity-cli',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 6)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:35Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-cli'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_6_antigravity-cli_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:35Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_14_antigravity-cli'})
SET p.title = 'ticket_ticket_14_antigravity-cli',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 14)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:36Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-cli'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_14_antigravity-cli_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:36Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_46_antigravity-cli'})
SET p.title = 'ticket_ticket_46_antigravity-cli',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 46)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:36Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-cli'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_46_antigravity-cli_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:36Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_3_antigravity-cli'})
SET p.title = 'ticket_ticket_3_antigravity-cli',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 3)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:36Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-cli'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_3_antigravity-cli_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:36Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_34_antigravity-cli'})
SET p.title = 'ticket_ticket_34_antigravity-cli',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 34)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:37Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-cli'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_34_antigravity-cli_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:37Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_48_antigravity-cli'})
SET p.title = 'ticket_ticket_48_antigravity-cli',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 48)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:37Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-cli'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_48_antigravity-cli_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:37Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_13_antigravity-cli'})
SET p.title = 'ticket_ticket_13_antigravity-cli',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 13)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:37Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-cli'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_13_antigravity-cli_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:37Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_15_antigravity-cli'})
SET p.title = 'ticket_ticket_15_antigravity-cli',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 15)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:37Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-cli'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_15_antigravity-cli_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:37Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_42_antigravity-cli'})
SET p.title = 'ticket_ticket_42_antigravity-cli',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 42)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:37Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-cli'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_42_antigravity-cli_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:37Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_38_antigravity-cli'})
SET p.title = 'ticket_ticket_38_antigravity-cli',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 38)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:37Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-cli'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_38_antigravity-cli_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:37Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_27_antigravity-cli'})
SET p.title = 'ticket_ticket_27_antigravity-cli',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 27)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:38Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-cli'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_27_antigravity-cli_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:38Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_44_antigravity-cli'})
SET p.title = 'ticket_ticket_44_antigravity-cli',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 44)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:38Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-cli'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_44_antigravity-cli_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:38Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_32_antigravity-cli'})
SET p.title = 'ticket_ticket_32_antigravity-cli',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 32)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:38Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-cli'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_32_antigravity-cli_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:38Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_23_antigravity-cli'})
SET p.title = 'ticket_ticket_23_antigravity-cli',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 23)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:38Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-cli'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_23_antigravity-cli_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:38Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_22_antigravity-cli'})
SET p.title = 'ticket_ticket_22_antigravity-cli',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 22)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:38Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-cli'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_22_antigravity-cli_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:38Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_37_antigravity-cli'})
SET p.title = 'ticket_ticket_37_antigravity-cli',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 37)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:39Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-cli'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_37_antigravity-cli_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:39Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_1_antigravity-cli'})
SET p.title = 'ticket_ticket_1_antigravity-cli',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 1)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:39Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-cli'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_1_antigravity-cli_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:39Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_5_antigravity-cli'})
SET p.title = 'ticket_ticket_5_antigravity-cli',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 5)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:39Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-cli'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_5_antigravity-cli_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:39Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_36_antigravity-cli'})
SET p.title = 'ticket_ticket_36_antigravity-cli',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 36)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:40Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-cli'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_36_antigravity-cli_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:40Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_43_antigravity-cli'})
SET p.title = 'ticket_ticket_43_antigravity-cli',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 43)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:41Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-cli'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_43_antigravity-cli_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:41Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_7_antigravity-cli'})
SET p.title = 'ticket_ticket_7_antigravity-cli',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 7)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:41Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-cli'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_7_antigravity-cli_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:41Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_17_antigravity-cli'})
SET p.title = 'ticket_ticket_17_antigravity-cli',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 17)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:42Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-cli'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_17_antigravity-cli_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:42Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_34_antigravity-ide'})
SET p.title = 'ticket_ticket_34_antigravity-ide',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 34)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:43Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_34_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:43Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_6_antigravity-ide'})
SET p.title = 'ticket_ticket_6_antigravity-ide',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 6)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:43Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_6_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:43Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_9_antigravity-ide'})
SET p.title = 'ticket_ticket_9_antigravity-ide',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 9)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:44Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_9_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:44Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_14_antigravity-ide'})
SET p.title = 'ticket_ticket_14_antigravity-ide',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 14)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:44Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_14_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:44Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_2_antigravity-ide'})
SET p.title = 'ticket_ticket_2_antigravity-ide',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 2)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:44Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_2_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:44Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_28_antigravity-ide'})
SET p.title = 'ticket_ticket_28_antigravity-ide',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 28)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:44Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_28_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:44Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_20_antigravity-ide'})
SET p.title = 'ticket_ticket_20_antigravity-ide',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 20)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:44Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_20_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:44Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_8_antigravity-ide'})
SET p.title = 'ticket_ticket_8_antigravity-ide',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 8)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:45Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_8_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:45Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_17_antigravity-ide'})
SET p.title = 'ticket_ticket_17_antigravity-ide',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 17)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:45Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_17_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:45Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_24_antigravity-ide'})
SET p.title = 'ticket_ticket_24_antigravity-ide',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 24)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:45Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_24_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:45Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_12_antigravity-ide'})
SET p.title = 'ticket_ticket_12_antigravity-ide',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 12)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:45Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_12_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:45Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_13_antigravity-ide'})
SET p.title = 'ticket_ticket_13_antigravity-ide',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 13)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:45Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_13_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:45Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_36_antigravity-ide'})
SET p.title = 'ticket_ticket_36_antigravity-ide',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 36)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:45Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_36_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:45Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_47_antigravity-ide'})
SET p.title = 'ticket_ticket_47_antigravity-ide',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 47)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:46Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_47_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:46Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_5_antigravity-ide'})
SET p.title = 'ticket_ticket_5_antigravity-ide',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 5)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:46Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_5_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:46Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_11_antigravity-ide'})
SET p.title = 'ticket_ticket_11_antigravity-ide',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 11)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:46Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_11_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:46Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_26_antigravity-ide'})
SET p.title = 'ticket_ticket_26_antigravity-ide',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 26)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:46Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_26_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:46Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_1_antigravity-ide'})
SET p.title = 'ticket_ticket_1_antigravity-ide',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 1)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:46Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_1_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:46Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_22_antigravity-ide'})
SET p.title = 'ticket_ticket_22_antigravity-ide',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 22)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:46Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_22_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:46Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_25_antigravity-ide'})
SET p.title = 'ticket_ticket_25_antigravity-ide',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 25)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:46Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_25_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:46Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_7_antigravity-ide'})
SET p.title = 'ticket_ticket_7_antigravity-ide',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 7)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:47Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_7_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:47Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_45_antigravity-ide'})
SET p.title = 'ticket_ticket_45_antigravity-ide',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 45)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:47Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_45_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:47Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_48_antigravity-ide'})
SET p.title = 'ticket_ticket_48_antigravity-ide',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 48)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:47Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_48_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:47Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_15_antigravity-ide'})
SET p.title = 'ticket_ticket_15_antigravity-ide',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 15)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:47Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_15_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:47Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_33_antigravity-ide'})
SET p.title = 'ticket_ticket_33_antigravity-ide',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 33)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:47Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_33_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:47Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_38_antigravity-ide'})
SET p.title = 'ticket_ticket_38_antigravity-ide',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 38)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:47Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_38_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:47Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_18_antigravity-ide'})
SET p.title = 'ticket_ticket_18_antigravity-ide',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 18)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:47Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_18_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:47Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_40_antigravity-ide'})
SET p.title = 'ticket_ticket_40_antigravity-ide',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 40)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:48Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_40_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:48Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_19_antigravity-ide'})
SET p.title = 'ticket_ticket_19_antigravity-ide',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 19)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:48Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_19_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:48Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_29_antigravity-ide'})
SET p.title = 'ticket_ticket_29_antigravity-ide',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 29)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:48Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_29_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:48Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_30_antigravity-ide'})
SET p.title = 'ticket_ticket_30_antigravity-ide',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 30)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:53Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_30_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:53Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_32_antigravity-ide'})
SET p.title = 'ticket_ticket_32_antigravity-ide',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 32)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:53Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_32_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:53Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_0_antigravity-ide'})
SET p.title = 'ticket_ticket_0_antigravity-ide',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 0)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:55Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_0_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:55Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_16_antigravity-ide'})
SET p.title = 'ticket_ticket_16_antigravity-ide',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 16)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:55Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_16_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:55Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_31_antigravity-ide'})
SET p.title = 'ticket_ticket_31_antigravity-ide',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 31)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:13:57Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_31_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:13:57Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_35_antigravity-ide'})
SET p.title = 'ticket_ticket_35_antigravity-ide',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 35)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:04Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_35_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:04Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_37_antigravity-ide'})
SET p.title = 'ticket_ticket_37_antigravity-ide',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 37)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:04Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_37_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:04Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_21_antigravity-ide'})
SET p.title = 'ticket_ticket_21_antigravity-ide',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 21)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:04Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_21_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:04Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_23_antigravity-ide'})
SET p.title = 'ticket_ticket_23_antigravity-ide',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 23)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:04Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_23_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:04Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_43_antigravity-ide'})
SET p.title = 'ticket_ticket_43_antigravity-ide',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 43)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:06Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_43_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:06Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_10_antigravity-ide'})
SET p.title = 'ticket_ticket_10_antigravity-ide',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 10)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:08Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_10_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:08Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_3_antigravity-ide'})
SET p.title = 'ticket_ticket_3_antigravity-ide',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 3)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:09Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_3_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:09Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_46_antigravity-ide'})
SET p.title = 'ticket_ticket_46_antigravity-ide',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 46)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:09Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_46_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:09Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_44_antigravity-ide'})
SET p.title = 'ticket_ticket_44_antigravity-ide',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 44)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:10Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_44_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:10Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_41_antigravity-ide'})
SET p.title = 'ticket_ticket_41_antigravity-ide',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 41)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:10Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_41_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:10Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_4_antigravity-ide'})
SET p.title = 'ticket_ticket_4_antigravity-ide',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 4)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:15Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_4_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:15Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_27_antigravity-ide'})
SET p.title = 'ticket_ticket_27_antigravity-ide',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 27)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:18Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_27_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:18Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_42_antigravity-ide'})
SET p.title = 'ticket_ticket_42_antigravity-ide',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 42)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:18Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'antigravity-ide'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_42_antigravity-ide_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:18Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_3_config'})
SET p.title = 'ticket_ticket_3_config',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 3)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:20Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_3_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:20Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_9_config'})
SET p.title = 'ticket_ticket_9_config',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 9)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:20Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_9_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:20Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_18_config'})
SET p.title = 'ticket_ticket_18_config',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 18)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:20Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_18_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:20Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_35_config'})
SET p.title = 'ticket_ticket_35_config',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 35)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:21Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_35_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:21Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_44_config'})
SET p.title = 'ticket_ticket_44_config',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 44)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:21Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_44_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:21Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_2_config'})
SET p.title = 'ticket_ticket_2_config',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 2)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:21Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_2_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:21Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_26_config'})
SET p.title = 'ticket_ticket_26_config',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 26)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:21Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_26_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:21Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_38_config'})
SET p.title = 'ticket_ticket_38_config',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 38)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:21Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_38_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:21Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_23_config'})
SET p.title = 'ticket_ticket_23_config',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 23)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:21Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_23_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:21Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_22_config'})
SET p.title = 'ticket_ticket_22_config',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 22)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:21Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_22_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:21Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_34_config'})
SET p.title = 'ticket_ticket_34_config',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 34)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:21Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_34_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:21Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_39_config'})
SET p.title = 'ticket_ticket_39_config',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 39)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:21Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_39_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:21Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_33_config'})
SET p.title = 'ticket_ticket_33_config',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 33)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:21Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_33_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:21Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_14_config'})
SET p.title = 'ticket_ticket_14_config',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 14)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:21Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_14_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:21Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_12_config'})
SET p.title = 'ticket_ticket_12_config',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 12)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:21Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_12_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:21Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_27_config'})
SET p.title = 'ticket_ticket_27_config',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 27)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:21Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_27_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:21Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_10_config'})
SET p.title = 'ticket_ticket_10_config',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 10)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:22Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_10_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:22Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_48_config'})
SET p.title = 'ticket_ticket_48_config',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 48)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:22Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_48_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:22Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_30_config'})
SET p.title = 'ticket_ticket_30_config',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 30)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:22Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_30_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:22Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_0_config'})
SET p.title = 'ticket_ticket_0_config',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 0)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:22Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_0_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:22Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_6_config'})
SET p.title = 'ticket_ticket_6_config',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 6)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:22Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_6_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:22Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_13_config'})
SET p.title = 'ticket_ticket_13_config',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 13)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:24Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_13_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:24Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_31_config'})
SET p.title = 'ticket_ticket_31_config',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 31)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:25Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_31_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:25Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_17_config'})
SET p.title = 'ticket_ticket_17_config',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 17)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:25Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_17_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:25Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_24_config'})
SET p.title = 'ticket_ticket_24_config',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 24)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:25Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_24_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:25Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_45_config'})
SET p.title = 'ticket_ticket_45_config',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 45)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:25Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_45_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:25Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_36_config'})
SET p.title = 'ticket_ticket_36_config',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 36)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:26Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_36_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:26Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_25_config'})
SET p.title = 'ticket_ticket_25_config',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 25)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:26Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_25_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:26Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_5_config'})
SET p.title = 'ticket_ticket_5_config',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 5)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:26Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_5_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:26Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_1_config'})
SET p.title = 'ticket_ticket_1_config',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 1)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:26Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_1_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:26Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_16_config'})
SET p.title = 'ticket_ticket_16_config',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 16)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:26Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_16_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:26Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_20_config'})
SET p.title = 'ticket_ticket_20_config',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 20)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:26Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_20_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:26Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_40_config'})
SET p.title = 'ticket_ticket_40_config',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 40)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:26Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_40_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:26Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_32_config'})
SET p.title = 'ticket_ticket_32_config',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 32)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:26Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_32_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:26Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_4_config'})
SET p.title = 'ticket_ticket_4_config',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 4)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:26Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_4_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:26Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_8_config'})
SET p.title = 'ticket_ticket_8_config',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 8)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:27Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_8_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:27Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_28_config'})
SET p.title = 'ticket_ticket_28_config',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 28)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:32Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_28_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:32Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_42_config'})
SET p.title = 'ticket_ticket_42_config',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 42)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:33Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_42_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:33Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_29_config'})
SET p.title = 'ticket_ticket_29_config',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 29)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:33Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_29_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:33Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_21_config'})
SET p.title = 'ticket_ticket_21_config',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 21)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:33Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_21_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:33Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_11_config'})
SET p.title = 'ticket_ticket_11_config',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 11)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:37Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_11_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:37Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_7_config'})
SET p.title = 'ticket_ticket_7_config',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 7)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:37Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_7_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:37Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_46_config'})
SET p.title = 'ticket_ticket_46_config',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 46)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:38Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_46_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:38Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_37_config'})
SET p.title = 'ticket_ticket_37_config',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 37)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:38Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_37_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:38Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_19_config'})
SET p.title = 'ticket_ticket_19_config',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 19)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:38Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_19_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:38Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_41_config'})
SET p.title = 'ticket_ticket_41_config',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 41)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:40Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_41_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:40Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_43_config'})
SET p.title = 'ticket_ticket_43_config',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 43)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:46Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_43_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:46Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_47_config'})
SET p.title = 'ticket_ticket_47_config',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 47)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:46Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'config'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_47_config_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:46Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_42_skills'})
SET p.title = 'ticket_ticket_42_skills',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 42)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:47Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'skills'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_42_skills_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:47Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_7_skills'})
SET p.title = 'ticket_ticket_7_skills',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 7)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:47Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'skills'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_7_skills_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:47Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_1_skills'})
SET p.title = 'ticket_ticket_1_skills',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 1)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:47Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'skills'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_1_skills_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:47Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_16_skills'})
SET p.title = 'ticket_ticket_16_skills',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 16)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:47Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'skills'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_16_skills_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:47Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_36_skills'})
SET p.title = 'ticket_ticket_36_skills',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 36)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:47Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'skills'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_36_skills_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:47Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_33_skills'})
SET p.title = 'ticket_ticket_33_skills',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 33)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:47Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'skills'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_33_skills_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:47Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_19_skills'})
SET p.title = 'ticket_ticket_19_skills',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 19)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:47Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'skills'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_19_skills_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:47Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_43_skills'})
SET p.title = 'ticket_ticket_43_skills',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 43)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:47Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'skills'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_43_skills_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:47Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_27_skills'})
SET p.title = 'ticket_ticket_27_skills',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 27)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:47Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'skills'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_27_skills_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:47Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_5_skills'})
SET p.title = 'ticket_ticket_5_skills',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 5)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:47Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'skills'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_5_skills_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:47Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_22_skills'})
SET p.title = 'ticket_ticket_22_skills',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 22)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:47Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'skills'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_22_skills_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:47Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_40_skills'})
SET p.title = 'ticket_ticket_40_skills',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 40)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:47Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'skills'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_40_skills_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:47Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_48_skills'})
SET p.title = 'ticket_ticket_48_skills',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 48)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:47Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'skills'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_48_skills_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:47Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_28_skills'})
SET p.title = 'ticket_ticket_28_skills',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 28)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:48Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'skills'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_28_skills_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:48Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_32_skills'})
SET p.title = 'ticket_ticket_32_skills',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 32)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:48Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'skills'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_32_skills_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:48Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_21_skills'})
SET p.title = 'ticket_ticket_21_skills',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 21)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:48Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'skills'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_21_skills_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:48Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_41_skills'})
SET p.title = 'ticket_ticket_41_skills',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 41)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:48Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'skills'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_41_skills_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:48Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_37_skills'})
SET p.title = 'ticket_ticket_37_skills',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 37)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:48Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'skills'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_37_skills_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:48Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_35_skills'})
SET p.title = 'ticket_ticket_35_skills',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 35)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:48Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'skills'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_35_skills_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:48Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_4_skills'})
SET p.title = 'ticket_ticket_4_skills',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 4)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:48Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'skills'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_4_skills_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:48Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_46_skills'})
SET p.title = 'ticket_ticket_46_skills',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 46)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:48Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'skills'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_46_skills_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:48Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_45_skills'})
SET p.title = 'ticket_ticket_45_skills',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 45)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:48Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'skills'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_45_skills_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:48Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_26_skills'})
SET p.title = 'ticket_ticket_26_skills',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 26)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:48Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'skills'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_26_skills_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:48Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_30_skills'})
SET p.title = 'ticket_ticket_30_skills',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 30)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:49Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'skills'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_30_skills_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:49Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_23_skills'})
SET p.title = 'ticket_ticket_23_skills',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 23)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:49Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'skills'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_23_skills_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:49Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_44_skills'})
SET p.title = 'ticket_ticket_44_skills',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 44)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:49Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'skills'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_44_skills_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:49Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_3_skills'})
SET p.title = 'ticket_ticket_3_skills',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 3)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:49Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'skills'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_3_skills_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:49Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_2_skills'})
SET p.title = 'ticket_ticket_2_skills',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 2)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:49Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'skills'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_2_skills_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:49Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_29_skills'})
SET p.title = 'ticket_ticket_29_skills',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 29)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:49Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'skills'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_29_skills_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:49Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_31_skills'})
SET p.title = 'ticket_ticket_31_skills',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 31)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:50Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'skills'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_31_skills_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:50Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_1_sovereign_mesh'})
SET p.title = 'ticket_ticket_1_sovereign_mesh',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 1)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:50Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'sovereign_mesh'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_1_sovereign_mesh_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:50Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_34_tmp'})
SET p.title = 'ticket_ticket_34_tmp',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 34)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:50Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_34_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:50Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_31_tmp'})
SET p.title = 'ticket_ticket_31_tmp',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 31)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:50Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_31_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:50Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_4_tmp'})
SET p.title = 'ticket_ticket_4_tmp',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 4)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:50Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_4_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:50Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_48_tmp'})
SET p.title = 'ticket_ticket_48_tmp',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 48)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:50Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_48_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:50Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_33_tmp'})
SET p.title = 'ticket_ticket_33_tmp',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 33)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:50Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_33_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:50Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_26_tmp'})
SET p.title = 'ticket_ticket_26_tmp',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 26)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:50Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_26_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:50Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_46_tmp'})
SET p.title = 'ticket_ticket_46_tmp',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 46)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:50Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_46_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:50Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_12_tmp'})
SET p.title = 'ticket_ticket_12_tmp',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 12)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:50Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_12_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:50Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_0_tmp'})
SET p.title = 'ticket_ticket_0_tmp',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 0)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:50Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_0_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:50Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_10_tmp'})
SET p.title = 'ticket_ticket_10_tmp',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 10)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:51Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_10_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:51Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_39_tmp'})
SET p.title = 'ticket_ticket_39_tmp',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 39)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:51Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_39_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:51Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_17_tmp'})
SET p.title = 'ticket_ticket_17_tmp',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 17)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:51Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_17_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:51Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_35_tmp'})
SET p.title = 'ticket_ticket_35_tmp',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 35)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:51Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_35_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:51Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_23_tmp'})
SET p.title = 'ticket_ticket_23_tmp',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 23)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:51Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_23_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:51Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_43_tmp'})
SET p.title = 'ticket_ticket_43_tmp',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 43)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:51Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_43_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:51Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_22_tmp'})
SET p.title = 'ticket_ticket_22_tmp',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 22)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:51Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_22_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:51Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_14_tmp'})
SET p.title = 'ticket_ticket_14_tmp',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 14)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:51Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_14_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:51Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_2_tmp'})
SET p.title = 'ticket_ticket_2_tmp',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 2)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:51Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_2_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:51Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_28_tmp'})
SET p.title = 'ticket_ticket_28_tmp',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 28)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:52Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_28_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:52Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_29_tmp'})
SET p.title = 'ticket_ticket_29_tmp',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 29)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:52Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_29_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:52Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_6_tmp'})
SET p.title = 'ticket_ticket_6_tmp',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 6)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:52Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_6_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:52Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_1_tmp'})
SET p.title = 'ticket_ticket_1_tmp',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 1)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:52Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_1_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:52Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_36_tmp'})
SET p.title = 'ticket_ticket_36_tmp',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 36)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:52Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_36_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:52Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_19_tmp'})
SET p.title = 'ticket_ticket_19_tmp',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 19)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:52Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_19_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:52Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_7_tmp'})
SET p.title = 'ticket_ticket_7_tmp',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 7)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:52Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_7_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:52Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_45_tmp'})
SET p.title = 'ticket_ticket_45_tmp',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 45)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:52Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_45_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:52Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_44_tmp'})
SET p.title = 'ticket_ticket_44_tmp',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 44)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:53Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_44_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:53Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_27_tmp'})
SET p.title = 'ticket_ticket_27_tmp',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 27)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:53Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_27_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:53Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_18_tmp'})
SET p.title = 'ticket_ticket_18_tmp',
    p.severity = 2,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 18)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:53Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_18_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:53Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_5_tmp'})
SET p.title = 'ticket_ticket_5_tmp',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 5)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:53Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_5_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:53Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_47_tmp'})
SET p.title = 'ticket_ticket_47_tmp',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 47)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:53Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_47_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:53Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_41_tmp'})
SET p.title = 'ticket_ticket_41_tmp',
    p.severity = 5,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 41)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:53Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_41_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:53Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_38_tmp'})
SET p.title = 'ticket_ticket_38_tmp',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 38)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:53Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_38_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:53Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_21_tmp'})
SET p.title = 'ticket_ticket_21_tmp',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 21)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:53Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_21_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:53Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_9_tmp'})
SET p.title = 'ticket_ticket_9_tmp',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 9)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:54Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_9_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:54Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_32_tmp'})
SET p.title = 'ticket_ticket_32_tmp',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 32)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:54Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_32_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:54Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_3_tmp'})
SET p.title = 'ticket_ticket_3_tmp',
    p.severity = 1,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 3)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:54Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_3_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:54Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_25_tmp'})
SET p.title = 'ticket_ticket_25_tmp',
    p.severity = 3,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 25)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:56Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_25_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:56Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)

MERGE (p:Problem {id: 'ticket_37_tmp'})
SET p.title = 'ticket_ticket_37_tmp',
    p.severity = 4,
    p.description = 'Historical ticket migrated from 49x49 cube (Index: 37)',
    p.status = 'resolved',
    p.source_system = 'rqlite_cube',
    p.created_at = '2026-07-22T02:14:57Z',
    p.tags = ['historical_ticket']

MERGE (e:Entity {id: 'tmp'})
SET e.type = 'agent'

MERGE (p)-[r:MENTIONS {role: 'affected'}]->(e)

// Default Observation Node
MERGE (o:Observation {id: 'ticket_37_tmp_obs'})
SET o.extracted_signal = 'Historical ticket imported from rqlite cube',
    o.confidence_score = 0.50,
    o.anomaly_type = 'historical_import',
    o.source_system = 'rqlite_cube',
    o.created_at = '2026-07-22T02:14:57Z',
    o.tags = ['default_historical']

MERGE (p)-[lo:LEADS_TO {evidence_strength: 0.1, method: 'inductive'}]->(o)
