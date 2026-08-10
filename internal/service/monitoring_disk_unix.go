//go:build !windows

package service

import (
	"context"
	"fmt"
	"log"
	"os/exec"

	"golang.org/x/sys/unix"
)

func (m *MonitoringService) checkDiskSpace(ctx context.Context) {
	var stat unix.Statfs_t
	err := unix.Statfs("/", &stat)
	if err != nil {
		log.Printf("[MONITOR] Error checking disk space: %v", err)
		return
	}

	freeBytes := stat.Bavail * uint64(stat.Bsize)
	freeMB := freeBytes / (1024 * 1024)

	if freeMB < 2048 { // Less than 2GB
		msg := fmt.Sprintf("Root partition has critically low space: %d MB remaining. Initiating autonomous cleanup.", freeMB)
		m.triggerHealing(ctx, "LOW_DISK_SPACE", msg)
		m.performAutonomousCleanup(ctx)
	}
}

func (m *MonitoringService) performAutonomousCleanup(ctx context.Context) {
	log.Println("[HEAL] Executing Autonomous Cleanup: Purging Go build cache...")
	cmd := exec.Command("go", "clean", "-cache")
	if err := cmd.Run(); err != nil {
		log.Printf("[HEAL] Error clearing Go cache: %v", err)
	}

	log.Println("[HEAL] Executing Autonomous Cleanup: Purging /tmp directory...")
	cmd2 := exec.Command("rm", "-rf", "/tmp/*")
	if err := cmd2.Run(); err != nil {
		log.Printf("[HEAL] Error clearing /tmp: %v", err)
	}
	
	log.Println("[HEAL] Autonomous Cleanup complete.")
}
