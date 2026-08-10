package swarm

import (
    "context"

    "pqr.info/connectors"
)

type Agent interface {
    ID() string
    Analyze(ctx context.Context, opp connectors.Opportunity) (*BundleProposal, error)
}

type BundleProposal struct {
    OpportunityID string
    AgentID       string
    ExpectedValue float64
    Confidence    float64
    RiskScore     float64
}

type SwarmCoordinator struct {
    InOpp   chan connectors.Opportunity
    Agents  []Agent
    OutProp chan BundleProposal
}

func (s *SwarmCoordinator) Start(ctx context.Context) {
    go func() {
        for {
            select {
            case <-ctx.Done():
                return
            case opp := <-s.InOpp:
                for _, a := range s.Agents {
                    prop, err := a.Analyze(ctx, opp)
                    if err != nil || prop == nil {
                        continue
                    }
                    s.OutProp <- *prop
                }
            }
        }
    }()
}
