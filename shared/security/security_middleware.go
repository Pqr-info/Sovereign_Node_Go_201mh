package security

import (
	"context"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5"
	"pqr.info/shared/go_sidecar/crypto5d"
)

type contextKey string

const FiveDAddressKey contextKey = "FiveDAddress"

type AuditLog struct {
	Timestamp    time.Time
	FiveDAddress crypto5d.FiveDAddress
	Method       string
	Path         string
	Status       int
}

type SecurityMiddleware struct {
	Conn *pgx.Conn
}

type responseWriter struct {
	http.ResponseWriter
	status int
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.status = code
	rw.ResponseWriter.WriteHeader(code)
}

func (sm *SecurityMiddleware) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		apiKey := r.Header.Get("X-API-Key")
		
		// Parse X-API-Key to extract FiveDAddress. 
		address := crypto5d.FiveDAddress{
			Base27: apiKey,
		}

		// Inject FiveDAddress into the request context
		ctx := context.WithValue(r.Context(), FiveDAddressKey, address)
		r = r.WithContext(ctx)

		rw := &responseWriter{
			ResponseWriter: w,
			status:         http.StatusOK, // Default to 200 OK
		}

		// Process request
		next.ServeHTTP(rw, r)

		// Audit logging
		logEntry := AuditLog{
			Timestamp:    time.Now(),
			FiveDAddress: address,
			Method:       r.Method,
			Path:         r.URL.Path,
			Status:       rw.status,
		}

		// Log API hits to CockroachDB (pgx.Conn)
		query := `INSERT INTO audit_logs (timestamp, fived_address_base27, method, path, status) VALUES ($1, $2, $3, $4, $5)`
		_, _ = sm.Conn.Exec(context.Background(), query, logEntry.Timestamp, logEntry.FiveDAddress.Base27, logEntry.Method, logEntry.Path, logEntry.Status)
	})
}
