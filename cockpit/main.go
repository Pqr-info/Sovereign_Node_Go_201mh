package main

import (
	"log"
	"os"

	"github.com/charmbracelet/bubbletea"

	"pqr.info/cockpit/internal/config"
	"pqr.info/cockpit/ui"
)

func main() {
	cfg, err := config.LoadTenantConfig("cockpit.yaml")
	if err != nil {
		log.Printf("warning: failed to load cockpit.yaml: %v", err)
	}

	m := ui.NewCockpitModel(cfg)

	p := tea.NewProgram(m, tea.WithAltScreen())
	if _, err := p.Run(); err != nil {
		log.Println("error running cockpit:", err)
		os.Exit(1)
	}
}
