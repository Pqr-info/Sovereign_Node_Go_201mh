package runlevels

import (
	"fmt"
	"log"

	"pqr.info/pqrcloud/internal/remote"
)

type RunlevelOrchestrator struct {
	SSHKeyPath string
}

func NewRunlevelOrchestrator(sshKeyPath string) *RunlevelOrchestrator {
	return &RunlevelOrchestrator{
		SSHKeyPath: sshKeyPath,
	}
}

func (o *RunlevelOrchestrator) RemoteBoot(ip, user, archivePath string) error {
	log.Printf("[PQRCLOUD-RUNLEVELS] Bootstrapping node runlevel stack at %s...", ip)

	client, err := remote.NewSSHClient(ip, user, o.SSHKeyPath)
	if err != nil {
		return err
	}

	// 1. Upload the code archive to /tmp/
	log.Printf("[PQRCLOUD-RUNLEVELS] Uploading code archive %s to /tmp/mev.tar.gz...", archivePath)
	if err := client.Upload(archivePath, "/tmp/mev.tar.gz"); err != nil {
		return fmt.Errorf("failed to upload archive: %w", err)
	}

	// 2. Unpack, build, and trigger runlevel activation
	commands := []string{
		"sudo mkdir -p /etc/sos /var/lib/pqrl /app/mev",
		"sudo tar -xzf /tmp/mev.tar.gz -C /app/mev",
		// Copy runlevels TOML configurations
		"sudo cp /app/mev/runlevels.toml /etc/sos/runlevels.toml",
		// Run PQRL.d executor inside systemd
		"sudo cp /app/pqrld/pqrld.service /etc/systemd/system/pqrld.service",
		"sudo systemctl daemon-reload",
		"sudo systemctl enable pqrld.service",
		"sudo systemctl restart pqrld.service",
	}

	for _, cmd := range commands {
		log.Printf("[PQRCLOUD-RUNLEVELS] Executing: %s", cmd)
		output, err := client.Execute(cmd)
		if err != nil {
			return fmt.Errorf("execution failed (%s): %w. Output: %s", cmd, err, output)
		}
	}

	log.Println("[PQRCLOUD-RUNLEVELS] Remote runlevel activation triggered successfully.")
	return nil
}

func (o *RunlevelOrchestrator) RemoteRollback(ip, user string, runlevel int) error {
	log.Printf("[PQRCLOUD-RUNLEVELS] Triggering remote rollback on %s to runlevel %d...", ip, runlevel)

	client, err := remote.NewSSHClient(ip, user, o.SSHKeyPath)
	if err != nil {
		return err
	}

	// Rollback by invoking the local remote control endpoint of pqrld or systemctl stop
	cmd := fmt.Sprintf("sudo systemctl stop pqrld && echo '{\"state\":\"ROLLBACK\",\"current_runlevel\":\"PQRL%d\"}' | sudo tee /var/lib/pqrl/state.json", runlevel)
	output, err := client.Execute(cmd)
	if err != nil {
		return fmt.Errorf("rollback failed: %w. Output: %s", err, output)
	}

	log.Printf("[PQRCLOUD-RUNLEVELS] Rollback successful on node %s.", ip)
	return nil
}
