FROM golang:1.26.4-alpine AS builder

WORKDIR /app

# Install dependency tools
RUN apk add --no-cache git

# Copy files
COPY go.mod ./
# If go.sum exists, copy it (might not exist yet)
COPY . .

# Build binary
RUN go build -mod=vendor -o ouroboros-auditor main.go

# Runtime stage
FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/ouroboros-auditor /app/ouroboros-auditor

# Ensure directories exist
RUN mkdir -p /var/lib/pqrl

CMD ["/app/ouroboros-auditor"]
