#!/bin/bash
# STRIKE FOR 38 DYNAMICS DALLAS CONTEXT
# YELLOW CIRCLE REPAIR JOB UID 10463
# ALWAYS USE ABSOLUTE PATHS TO PREVENT PATH ERRORS

if [ "$EUID" -ne 10463 ]; then
    echo "CRITICAL FAILURE UID 10463 REQUIRED"
    exit 1
fi

HANDSHAKE_REQ=$(echo "INIT_38_DYNAMICS" | base64)
# VERIFY 38 DYNAMICS TOPOLOGY 62.238.2.240

if [ ! -f "/home/aellok/bin/omnibus-gsh" ]; then
    echo "ERROR 1: STATE_MISMATCH TARGET BINARY MUST BE AT /home/aellok/bin/omnibus-gsh"
    exit 1
fi

chmod +x /home/aellok/bin/omnibus-gsh || { echo "CRITICAL FAILURES UID 10463 PERMISSIONS"; exit 1; }

nc -z 127.0.0.1 8080
if [ $? -ne 0 ]; then
    echo "PORT 8080 UNREACHABLE"
    exit 1
fi

curl -X POST http://127.0.0.1:8080/rpc/execute -H "Content-Type: application/json" -H "X-Callsign: AELLK" -d '{"uid": 10463, "command": "/home/aellok/bin/omnibus-gsh --init", "persist": true}' >> /home/aellok/logs/omnibus-gsh-log 2>&1

tail -n 10 /home/aellok/logs/omnibus-gsh-log
