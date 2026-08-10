//go:build windows

package service

import (
	"context"
	"fmt"
	"log"
	"os/exec"

	"golang.org/x/sys/windows"
)

func (m *MonitoringService) checkDiskSpace(ctx context.Context) {
	var freeBytesAvailableToCaller, totalNumberOfBytes, totalNumberOfFreeBytes uint64
	err := windows.GetDiskFreeSpaceEx(windows.StringToUTF16Ptr("C:\\"),
		&freeBytesAvailableToCaller,
		&totalNumberOfBytes,
		&totalNumberOfFreeBytes)

	if err != nil {
		log.Printf("[MONITOR] Error checking disk space: %v", err)
		return
	}

	freeMB := freeBytesAvailableToCaller / (1024 * 1024)
	if freeMB < 2048 { // Less than 2GB
		msg := fmt.Sprintf("C:\\ drive has critically low space: %d MB remaining. Initiating autonomous cleanup.", freeMB)
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

	log.Println("[HEAL] Executing Autonomous Cleanup: Purging Temp folder...")
	psCmd := `Get-ChildItem -Path $env:TEMP -Recurse | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue`
	cmd2 := exec.Command("powershell", "-Command", psCmd)
	if err := cmd2.Run(); err != nil {
		log.Printf("[HEAL] Error clearing Temp folder: %v", err)
	}
	
	log.Println("[HEAL] Autonomous Cleanup complete.")
}
