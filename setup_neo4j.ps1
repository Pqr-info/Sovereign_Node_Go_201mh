$ErrorActionPreference = "Stop"

$neo4jEnv = "C:\pqr.info\neo4j_env"
if (-not (Test-Path $neo4jEnv)) {
    New-Item -ItemType Directory -Force -Path $neo4jEnv | Out-Null
}

Write-Host "Downloading Adoptium JDK 17..."
$jdkUrl = "https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.10%2B7/OpenJDK17U-jdk_x64_windows_hotspot_17.0.10_7.zip"
$jdkZip = "$neo4jEnv\jdk.zip"
if (-not (Test-Path $jdkZip)) {
    Invoke-WebRequest -Uri $jdkUrl -OutFile $jdkZip
}
Write-Host "Extracting JDK 17..."
Expand-Archive -Path $jdkZip -DestinationPath "$neo4jEnv\jdk" -Force

Write-Host "Downloading Neo4j Community 5.21.2..."
$neo4jUrl = "https://neo4j.com/artifact.php?name=neo4j-community-5.21.2-windows.zip"
$neo4jZip = "$neo4jEnv\neo4j.zip"
if (-not (Test-Path $neo4jZip)) {
    Invoke-WebRequest -Uri $neo4jUrl -OutFile $neo4jZip
}
Write-Host "Extracting Neo4j..."
Expand-Archive -Path $neo4jZip -DestinationPath "$neo4jEnv\neo4j_extracted" -Force
Move-Item -Path "$neo4jEnv\neo4j_extracted\neo4j-community-5.21.2" -Destination "$neo4jEnv\neo4j" -Force
Remove-Item -Recurse -Force "$neo4jEnv\neo4j_extracted"

Write-Host "Downloading APOC Core 5.21.2..."
$apocUrl = "https://github.com/neo4j/apoc/releases/download/5.21.2/apoc-5.21.2-core.jar"
$apocPath = "$neo4jEnv\neo4j\plugins\apoc-5.21.2-core.jar"
if (-not (Test-Path $apocPath)) {
    Invoke-WebRequest -Uri $apocUrl -OutFile $apocPath
}

Write-Host "Neo4j setup downloaded successfully."
