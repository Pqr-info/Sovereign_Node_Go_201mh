package service

import (
	"sync"
)

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type Session struct {
	SessionID string    `json:"session_id"`
	Messages  []Message `json:"messages"`
	LastTask  string    `json:"last_task"`
}

type SessionManager struct {
	mu       sync.RWMutex
	sessions map[string]*Session
}

func NewSessionManager() *SessionManager {
	return &SessionManager{
		sessions: make(map[string]*Session),
	}
}

func (s *SessionManager) GetOrCreate(sessionID string) *Session {
	s.mu.Lock()
	defer s.mu.Unlock()

	sess, ok := s.sessions[sessionID]
	if !ok {
		sess = &Session{
			SessionID: sessionID,
			Messages:  []Message{},
		}
		s.sessions[sessionID] = sess
	}
	return sess
}

func (s *SessionManager) AddMessage(sessionID, role, content string) {
	s.mu.Lock()
	defer s.mu.Unlock()

	sess, ok := s.sessions[sessionID]
	if !ok {
		sess = &Session{
			SessionID: sessionID,
			Messages:  []Message{},
		}
		s.sessions[sessionID] = sess
	}
	sess.Messages = append(sess.Messages, Message{Role: role, Content: content})
}

func (s *SessionManager) Clear(sessionID string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.sessions, sessionID)
}
