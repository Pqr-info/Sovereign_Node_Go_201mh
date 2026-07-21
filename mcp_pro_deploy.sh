#!/bin/bash
# Sovereign MCP One-Click Setup
echo "Initializing MCP Pro Deployment..."
go build -o swend-mcp ./cmd/mcp
echo "Deploying to Termux environment..."
