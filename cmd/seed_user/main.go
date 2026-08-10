package main

import (
	"context"
	"log"
	"os"

	"github.com/google/uuid"
	"pqr.info/internal/domain"
	"pqr.info/internal/infrastructure/db"
)

func main() {
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		connStr = "postgresql://root@localhost:26257/antigravity?sslmode=disable"
	}

	repo, err := db.NewCockroachRepository(connStr)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	ctx := context.Background()

	// Seed Admin User
	admin := &domain.User{
		ID:          uuid.New(),
		Username:    "admin",
		Email:       "admin@pqr.info",
		DisplayName: "System Administrator",
	}

	err = repo.CreateUser(ctx, admin)
	if err != nil {
		log.Fatalf("Failed to create admin user: %v", err)
	}

	log.Printf("✓ Seeded admin user: %s (%s)", admin.Username, admin.Email)
}
