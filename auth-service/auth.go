package auth

import (
	"errors"
	"time"
)

type DID struct {
	ID        string // did:spacebook:<hash>
	PublicKey string
	CreatedAt int64
}

type WalletSignatureRequest struct {
	Address   string
	Message   string
	Signature string
}

type ZKPProof struct {
	Proof     []byte
	CircuitID string
	IssuedAt  int64
	ExpiresAt int64
}

type AuthSession struct {
	SessionID   string
	DID         string
	IssuedAt    int64
	ExpiresAt   int64
	Epoch       int64
	Cycle       int64
	DriftBudget float64 // max allowed Φ for this session
}

type AuthService interface {
	VerifyWalletSignature(req WalletSignatureRequest) (DID, error)
	GenerateSession(did DID) (AuthSession, error)
	VerifyZKP(proof ZKPProof) bool
}

type DefaultAuthService struct{}

func (s *DefaultAuthService) VerifyWalletSignature(req WalletSignatureRequest) (DID, error) {
	if req.Signature == "" {
		return DID{}, errors.New("invalid signature")
	}
	return DID{
		ID:        "did:spacebook:mock",
		PublicKey: req.Address,
		CreatedAt: time.Now().Unix(),
	}, nil
}

func (s *DefaultAuthService) GenerateSession(did DID) (AuthSession, error) {
	return AuthSession{
		SessionID:   "session-123",
		DID:         did.ID,
		IssuedAt:    time.Now().Unix(),
		ExpiresAt:   time.Now().Add(24 * time.Hour).Unix(),
		Epoch:       1,
		Cycle:       1,
		DriftBudget: 5.0, // Based on Copilot integration
	}, nil
}

func (s *DefaultAuthService) VerifyZKP(proof ZKPProof) bool {
	return len(proof.Proof) > 0
}
