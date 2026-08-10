$ErrorActionPreference = "Stop"
$neo4jEnv = "C:\pqr.info\neo4j_env"
$env:JAVA_HOME = "$neo4jEnv\jdk\jdk-17.0.10+7"
$env:PATH = "$env:JAVA_HOME\bin;" + $env:PATH

& "$neo4jEnv\neo4j\bin\cypher-shell.bat" -a bolt://localhost:7687 --non-interactive -d neo4j "MERGE (sp:SuccessPath {id: 'dummy_path_1'}) SET sp.reusabilityScore = 0.5"
