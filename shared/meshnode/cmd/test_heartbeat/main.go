package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"pqr.info/shared/meshnode"
)

func main() {
	ctx := context.Background()
	
	// Connect to CockroachDB
	dbUrl := "postgres://root@localhost:5196/defaultdb?sslmode=disable"
	pool, err := pgxpool.New(ctx, dbUrl)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	defer pool.Close()

	registry := meshnode.NewRegistry(pool)

	node := &meshnode.MeshNode{
		Address:      "test-addr",
		Hostname:     "test-node-ted",
		NodeRole:     "test-worker",
		Capabilities: map[string]bool{"llm": true, "tor": false},
		Status:       "offline",
	}

	fmt.Println("Starting heartbeat client...")
	hb := meshnode.NewHeartbeatClient(registry, node, 1*time.Second)
	hb.Start()

	time.Sleep(2 * time.Second)

	fmt.Println("Querying online nodes...")
	nodes, err := registry.ListOnline(ctx)
	if err != nil {
		log.Fatalf("ListOnline failed: %v", err)
	}

	found := false
	for _, n := range nodes {
		fmt.Printf("Found Node: %s (Role: %s)\n", n.Hostname, n.NodeRole)
		if n.Hostname == "test-node-ted" {
			found = true
		}
	}

	hb.Stop()

	if !found {
		log.Fatal("Test node not found in online list!")
	}
	fmt.Println("SUCCESS: Heartbeat verified and node registered in CockroachDB!")
}
