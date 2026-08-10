#!/bin/bash
# STRIKE FOR 38 DYNAMICS DALLAS CONTEXT
# YELLOW CIRCLE STATUS UID 10463
# ALWAYS USE ABSOLUTE PATHS TO PREVENT PATH ERRORS

if [ "$EUID" -ne 10463 ]; then
    echo "CRITICAL FAILURE UID 10463 REQUIRED"
    exit 1
fi

nc -z 127.0.0.1 8080 || { echo "CRITICAL FAILURE PORT 8080 UNREACHABLE"; exit 1; }

curl -X POST http://127.0.0.1:8080/rpc/execute -H "Content-Type: application/json" -H "X-Callsign: AELLK" -d '{"uid": 10463, "command": "/home/aellok/bin/omnibus-gsh --status", "persist": true}' >> /home/aellok/logs/omnibus-gsh-log 2>&1

tail -n 10 /home/aellok/logs/omnibus-gsh-log
