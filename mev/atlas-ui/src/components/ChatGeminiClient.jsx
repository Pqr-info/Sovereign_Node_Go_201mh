import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, Globe, Zap, Clock, Maximize2, X, ChevronRight, Check, Activity, Folder, File, RefreshCw,
  Send, Bot, User, Cpu, Database, ShieldAlert, Layers, Edit, History, AlertTriangle, Save 
} from 'lucide-react';
import { CopilotFsTab } from './CopilotFsTab';
import { GeminiFsTab } from './GeminiFsTab';
import GovernanceTab from './GovernanceTab';
import TemporalFusionTab from './TemporalFusionTab';
import ContextSchedulerTab from './ContextSchedulerTab';
import MemoryTab from './MemoryTab';
import NegotiationTab from './NegotiationTab';
import ArchitectLoopTab from './ArchitectLoopTab';

export default function ChatGeminiClient() {
  const createPhase23Message = (role, content, subsystem = 'Generic', target = null, turnIndex = 0) => {
    return {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,
      role,
      content,
      type: 'primary',
      subsystem,
      target_agent: target,
      created_at: new Date().toISOString(),
      policies: {
        priority_tags: [],
        decay_profile: 'default',
        allow_compaction: true,
        allow_drop: true
      },
      compaction: {
        status: 'uncompacted',
        summary_3_sentence: null,
        summary_1_sentence: null,
        summary_1_line: null,
        last_compacted_at: null
      },
      meta: {
        turn_index: turnIndex,
        token_estimate: Math.ceil(content.length / 4),
        origin: 'ui',
        jetweb_state_ref: null
      }
    };
  };

  // UI State
  const [messages, setMessages] = useState([
    createPhase23Message('system', 'Sovereign-27 Nexus Console initialized.\nTarget agent defaulting to [ZETA L7 WORKER].\nAvailable LLM dispatch routes active.', 'Governance', null, 0)
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [targetAgent, setTargetAgent] = useState('ALL');
  const [contextWindowTokens, setContextWindowTokens] = useState(8192);
  const [injectMemory, setInjectMemory] = useState(false);
  const [isPermanent, setIsPermanent] = useState(false);
  const [isSystemCritical, setIsSystemCritical] = useState(false);

  const [showContextEditor, setShowContextEditor] = useState(false);
  const [contextEditText, setContextEditText] = useState('');

  const [timeMachineStatus, setTimeMachineStatus] = useState('');
  const [bridgeStatus, setBridgeStatus] = useState('');
  
  const [activeTab, setActiveTab] = useState("chat");

  const messagesEndRef = useRef(null);

  // Auto-sync polling loop for Copilot Bridge
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('http://localhost:4052/api/bridge/copilot/poll', { method: 'POST' });
        const data = await res.json();
        
        if (data.status === 'COPILOT_BRIDGE_ERROR' && data.error_type === 'OUTPUT_READ_FAILURE') {
          setBridgeStatus('⚠️ Unable to read Copilot Bridge output directory.');
          setTimeout(() => setBridgeStatus(''), 5000);
          return;
        }
        
        if (data.ok && data.blocks && data.blocks.length > 0) {
          setBridgeStatus(`Auto-synced ${data.blocks.length} blocks.`);
          setMessages(prev => {
            const nextLength = prev.length;
            const newMsgs = data.blocks.map((block, i) => {
              const msg = createPhase23Message(
                'assistant', 
                `[MASTER ARCHITECT]\nFile: ${block.filename}\n\`\`\`\n${block.content}\n\`\`\``, 
                'Governance', 
                'COPILOT_ARCHITECT', 
                nextLength + i + 1
              );
              msg.policies = {
                priority_tags: ["constitution", "never_drop"],
                decay_profile: "governance_ultra",
                allow_compaction: false,
                allow_drop: false
              };
              msg.meta.origin = "copilot_bridge";
              return msg;
            });
            return [...prev, ...newMsgs];
          });
          setTimeout(() => setBridgeStatus(''), 5000);
        }
      } catch (e) {}
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const injectCopilotFileIntoContext = ({ path, content }) => {
    const msg = createPhase23Message(
        'assistant', 
        content, 
        'Governance', 
        'COPILOT_ARCHITECT', 
        messages.length + 1
    );
    msg.policies = {
      priority_tags: ["constitution", "never_drop"],
      decay_profile: "governance_ultra",
      allow_compaction: false,
      allow_drop: false
    };
    msg.meta.origin = "copilotfs";
    msg.meta.path = path;
    setMessages(prev => [...prev, msg]);
  };

  const injectGeminiFileIntoContext = ({ path, content }) => {
    const msg = createPhase23Message(
        'assistant', 
        `[GEMINIFS REPLAY]\nFile: ${path}\n\`\`\`markdown\n${content}\n\`\`\``, 
        'TSRE', 
        null, 
        messages.length + 1
    );
    msg.policies = {
      priority_tags: ["trading_state"],
      decay_profile: "tsre_fast",
      allow_compaction: true,
      allow_drop: true
    };
    msg.meta.origin = "geminifs";
    msg.meta.path = path;
    setMessages(prev => [...prev, msg]);
  };

  const handleTimeMachineRestore = (snapshotId) => {
    const msg = createPhase23Message(
      'assistant',
      `[COPILOT · ARCHITECT] CopilotFS restored to snapshot: ${snapshotId}`,
      'Governance',
      'COPILOT_ARCHITECT',
      messages.length + 1
    );
    msg.policies = {
      priority_tags: ["constitution", "never_drop"],
      decay_profile: "governance_ultra",
      allow_compaction: false,
      allow_drop: false
    };
    msg.meta.origin = "time_machine";
    setMessages(prev => [...prev, msg]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = createPhase23Message('user', input, 'Generic', targetAgent, messages.length);
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:4052/antigravity/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg.content, 
          target_agent: targetAgent,
          context_window: contextWindowTokens,
          full_context: messages
        })
      });
      const data = await response.json();

      if (data.status === 'COPILOT_BRIDGE_ERROR') {
        if (data.error_type === 'LISTENER_UNREACHABLE') {
          const agentMsg = createPhase23Message('system', '[COPILOT · ARCHITECT] Bridge offline — retrying…', 'Governance', 'COPILOT_ARCHITECT', messages.length + 1);
          setMessages(prev => [...prev, agentMsg]);
        } else if (data.error_type === 'INVALID_MCP_PAYLOAD') {
          setMessages(prev => {
            const next = [...prev];
            if (next.length > 0) {
              next[next.length - 1].content = `[INVALID MCP PAYLOAD] ${next[next.length - 1].content}`;
            }
            return next;
          });
          setShowContextEditor(true);
        } else if (data.error_type === 'TOOL_INVOCATION_FAILED') {
          const agentMsg = createPhase23Message('system', '[COPILOT · ARCHITECT] Tool invocation failed — check arguments.', 'Governance', 'COPILOT_ARCHITECT', messages.length + 1);
          agentMsg.policies = { priority_tags: ['never_drop'] };
          setMessages(prev => [...prev, agentMsg]);
        }
        return;
      }
      
      if (data.processed_context && Array.isArray(data.processed_context)) {
        const agentMsg = createPhase23Message('agent', data.reply || '[No Reply]', 'LLM_Response', null, data.processed_context.length);
        setMessages([...data.processed_context, agentMsg]);
      } else if (data.reply) {
        const agentMsg = createPhase23Message('agent', data.reply, 'LLM_Response', null, messages.length + 1);
        setMessages(prev => [...prev, agentMsg]);
      }
    } catch (error) {
      console.warn('Backend not connected:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const saveContextEdit = () => {
    try {
      setMessages(JSON.parse(contextEditText));
      setShowContextEditor(false);
    } catch (e) { alert("Invalid JSON"); }
  };

  const triggerTimeMachineEvent = async (action) => {
    setTimeMachineStatus(`Executing ${action}...`);
    setTimeout(() => setTimeMachineStatus(''), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', background: '#050505', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* Header with Tabs */}
      <div style={{ padding: '1rem 2rem', background: 'rgba(15, 20, 25, 0.9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--color-blue), var(--color-purple))', padding: '0.6rem', borderRadius: '12px' }}>
            <Terminal size={24} color="#fff" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.5px', background: 'linear-gradient(90deg, #fff, #a0aec0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Chat Gemini
            </h1>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-blue)', fontWeight: 600, letterSpacing: '1px' }}>SOVEREIGN-27 NEXUS</span>
          </div>
        </div>
        
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => setActiveTab("chat")} 
            style={{ 
              padding: '0.5rem 1rem', 
              background: activeTab === 'chat' ? 'rgba(59,130,246,0.2)' : 'transparent', 
              border: activeTab === 'chat' ? '1px solid var(--color-blue)' : '1px solid rgba(255,255,255,0.1)', 
              color: activeTab === 'chat' ? 'var(--color-blue)' : 'var(--text-secondary)', 
              borderRadius: '8px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 600
            }}>
            💬 Chat
          </button>
          <button 
            onClick={() => setActiveTab("copilotfs")} 
            style={{ 
              padding: '0.5rem 1rem', 
              background: activeTab === 'copilotfs' ? 'rgba(59,130,246,0.2)' : 'transparent', 
              border: activeTab === 'copilotfs' ? '1px solid var(--color-blue)' : '1px solid rgba(255,255,255,0.1)', 
              color: activeTab === 'copilotfs' ? 'var(--color-blue)' : 'var(--text-secondary)', 
              borderRadius: '8px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 600
            }}>
            <Folder size={16} /> CopilotFS
          </button>
          <button 
            onClick={() => setActiveTab("geminifs")} 
            style={{ 
              padding: '0.5rem 1rem', 
              background: activeTab === 'geminifs' ? 'rgba(59,130,246,0.2)' : 'transparent', 
              border: activeTab === 'geminifs' ? '1px solid var(--color-blue)' : '1px solid rgba(255,255,255,0.1)', 
              color: activeTab === 'geminifs' ? 'var(--color-blue)' : 'var(--text-secondary)', 
              borderRadius: '8px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 600
            }}>
            <Folder size={16} /> GeminiFS
          </button>
          <button 
            onClick={() => setActiveTab("governance")} 
            style={{ 
              padding: '0.5rem 1rem', 
              background: activeTab === 'governance' ? 'rgba(59,130,246,0.2)' : 'transparent', 
              border: activeTab === 'governance' ? '1px solid var(--color-blue)' : '1px solid rgba(255,255,255,0.1)', 
              color: activeTab === 'governance' ? 'var(--color-blue)' : 'var(--text-secondary)', 
              borderRadius: '8px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 600
            }}>
            <ShieldAlert size={16} /> Governance
          </button>
          <button 
            onClick={() => setActiveTab("fusion")} 
            style={{ 
              padding: '0.5rem 1rem', 
              background: activeTab === 'fusion' ? 'rgba(59,130,246,0.2)' : 'transparent', 
              border: activeTab === 'fusion' ? '1px solid var(--color-blue)' : '1px solid rgba(255,255,255,0.1)', 
              color: activeTab === 'fusion' ? 'var(--color-blue)' : 'var(--text-secondary)', 
              borderRadius: '8px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 600
            }}>
            <Layers size={16} /> Fusion Engine
          </button>
          <button 
            onClick={() => setActiveTab("scheduler")} 
            style={{ 
              padding: '0.5rem 1rem', 
              background: activeTab === 'scheduler' ? 'rgba(59,130,246,0.2)' : 'transparent', 
              border: activeTab === 'scheduler' ? '1px solid var(--color-blue)' : '1px solid rgba(255,255,255,0.1)', 
              color: activeTab === 'scheduler' ? 'var(--color-blue)' : 'var(--text-secondary)', 
              borderRadius: '8px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 600
            }}>
            <Activity size={16} /> Scheduler
          </button>
          <button 
            onClick={() => setActiveTab("memory")} 
            style={{ 
              padding: '0.5rem 1rem', 
              background: activeTab === 'memory' ? 'rgba(168,85,247,0.2)' : 'transparent', 
              border: activeTab === 'memory' ? '1px solid var(--color-purple)' : '1px solid rgba(255,255,255,0.1)', 
              color: activeTab === 'memory' ? 'var(--color-purple)' : 'var(--text-secondary)', 
              borderRadius: '8px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 600
            }}>
            <Database size={16} /> Memory
          </button>
          <button 
            onClick={() => setActiveTab("negotiation")} 
            style={{ 
              padding: '0.5rem 1rem', 
              background: activeTab === 'negotiation' ? 'rgba(249,115,22,0.2)' : 'transparent', 
              border: activeTab === 'negotiation' ? '1px solid var(--color-orange)' : '1px solid rgba(255,255,255,0.1)', 
              color: activeTab === 'negotiation' ? 'var(--color-orange)' : 'var(--text-secondary)', 
              borderRadius: '8px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 600
            }}>
            <Users size={16} /> Negotiation
          </button>
          <button 
            onClick={() => setActiveTab("architect")} 
            style={{ 
              padding: '0.5rem 1rem', 
              background: activeTab === 'architect' ? 'rgba(234,179,8,0.2)' : 'transparent', 
              border: activeTab === 'architect' ? '1px solid var(--color-yellow)' : '1px solid rgba(255,255,255,0.1)', 
              color: activeTab === 'architect' ? 'var(--color-yellow)' : 'var(--text-secondary)', 
              borderRadius: '8px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 600
            }}>
            <Eye size={16} /> Architect Loop
          </button>
        </nav>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {activeTab === "chat" && (
          <>
            {/* Main Chat Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-panel)', margin: '1rem 0 1rem 1rem', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.map((msg, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', 
                    gap: '1rem', 
                    alignItems: 'flex-start',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                  }}>
                    <div style={{
                      background: msg.role === 'user' ? 'rgba(0, 163, 255, 0.15)' : 'rgba(255,255,255,0.05)', 
                      padding: '0.6rem', 
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                      {msg.role === 'user' ? <User size={18} color="var(--color-blue)" /> : 
                       msg.role === 'system' ? <Terminal size={18} color="var(--color-yellow)" /> :
                       <Bot size={18} color="var(--color-green)" />}
                    </div>
                    <div style={{
                      background: msg.role === 'user' ? 'rgba(0, 163, 255, 0.08)' : 'rgba(255,255,255,0.03)',
                      border: msg.role === 'user' ? '1px solid rgba(0, 163, 255, 0.3)' : '1px solid rgba(255,255,255,0.08)',
                      padding: '1rem 1.25rem',
                      borderRadius: '12px',
                      maxWidth: '75%',
                      fontSize: '0.95rem',
                      lineHeight: '1.6',
                      color: msg.role === 'system' ? 'var(--color-yellow)' : 'var(--text-primary)',
                      fontFamily: msg.role === 'system' ? 'monospace' : 'inherit',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                    }}>
                      {msg.meta?.target && msg.meta.target !== 'ALL' && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-blue)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '1px' }}>
                          [{msg.meta.target}]
                        </div>
                      )}
                      {msg.compaction?.status === 'compacted' && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-yellow)', marginBottom: '8px', fontStyle: 'italic' }}>
                          [COMPACTED SUMMARY]
                        </div>
                      )}
                      <div style={{ whiteSpace: 'pre-wrap' }}>
                        {msg.compaction?.status === 'compacted' 
                          ? (msg.compaction.summary_1_line || msg.compaction.summary_1_sentence || msg.compaction.summary_3_sentence || msg.content)
                          : msg.content}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', opacity: 0.6, fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                    <Bot size={18} color="var(--color-green)" />
                    <span className="pulse">Agent is generating response...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem', padding: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.25)' }}>
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    targetAgent === 'QWEN_CODER_CLI' ? "root@sovereign-27:~# Enter command..." : 
                    targetAgent === 'COPILOT_ARCHITECT' ? "Draft Copilot prompt or request Canon spec..." :
                    "Enter instruction for the sovereign mesh..."
                  }
                  style={{
                    flex: 1,
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    padding: '1rem 1.25rem',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    outline: 'none',
                    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)'
                  }}
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  style={{
                    background: 'linear-gradient(135deg, var(--color-blue), #2563eb)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0 1.5rem',
                    color: '#fff',
                    cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
                    opacity: input.trim() && !isTyping ? 1 : 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontWeight: 600,
                    fontSize: '1rem',
                    boxShadow: '0 4px 15px rgba(37, 99, 235, 0.4)',
                    transition: 'all 0.2s'
                  }}
                >
                  <Send size={18} /> Transmit
                </button>
              </form>
            </div>

            {/* Right Sidebar */}
            <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem 1rem 1rem 0' }}>
              
              <div className="glass-card" style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Cpu size={18} color="var(--color-blue)" />
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Target Agent</h3>
                </div>
                <select 
                  value={targetAgent} 
                  onChange={e => setTargetAgent(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', borderRadius: '6px', fontSize: '0.9rem', outline: 'none' }}
                >
                  <option value="ALL">BROADCAST MESH</option>
                  <option value="ZETA">ZETA L7 (Master)</option>
                  <option value="MAX">MAX (192.168.12.204)</option>
                  <option value="TED">TED (192.168.12.110)</option>
                  <option value="COPILOT_ARCHITECT">COPILOT ARCHITECT</option>
                  <option value="QWEN_CODER_CLI">QWEN CODER CLI</option>
                </select>
                
                <button 
                  onClick={() => setShowContextEditor(true)}
                  style={{ width: '100%', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'rgba(59,130,246,0.15)', border: '1px solid var(--color-blue)', color: 'var(--color-blue)', padding: '0.75rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                >
                  <Edit size={16} /> Edit Context Window
                </button>
              </div>

              {/* Time Machine */}
              <div className="glass-card" style={{ padding: '1.25rem', background: 'linear-gradient(180deg, rgba(20,20,25,0.8) 0%, rgba(10,10,15,0.9) 100%)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-purple)' }}>
                  <History size={18} />
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>JetWeb Time Machine</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button onClick={() => triggerTimeMachineEvent('Create Checkpoint')} style={{ width: '100%', padding: '0.75rem', background: 'rgba(139, 92, 246, 0.15)', border: '1px solid var(--color-purple)', color: 'var(--color-purple)', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                    Create Checkpoint
                  </button>
                  <button onClick={() => triggerTimeMachineEvent('Restore Checkpoint')} style={{ width: '100%', padding: '0.75rem', background: 'transparent', border: '1px dashed var(--color-purple)', color: 'var(--color-purple)', borderRadius: '6px', cursor: 'pointer' }}>
                    Restore Checkpoint
                  </button>
                </div>
              </div>

            </div>
          </>
        )}

        {activeTab === "copilotfs" && (
          <div style={{ flex: 1, padding: '2rem', background: 'var(--bg-panel)', margin: '1rem', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <CopilotFsTab onInjectIntoContext={injectCopilotFileIntoContext} onTimeMachineRestore={handleTimeMachineRestore} />
          </div>
        )}

        {activeTab === "geminifs" && (
          <div style={{ flex: 1, padding: '2rem', background: 'var(--bg-panel)', margin: '1rem', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <GeminiFsTab onInjectIntoContext={injectGeminiFileIntoContext} />
          </div>
        )}

        {activeTab === "governance" && (
          <div style={{ flex: 1, padding: '2rem', background: 'var(--bg-panel)', margin: '1rem', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <GovernanceTab onSystemMessage={(content, tags) => {
              const msg = createPhase23Message(
                'assistant',
                content,
                'Governance',
                'COPILOT_ARCHITECT',
                messages.length + 1
              );
              msg.policies = {
                priority_tags: tags,
                decay_profile: "governance_ultra",
                allow_compaction: false,
                allow_drop: false
              };
              msg.meta.origin = "governance_panel";
              setMessages(prev => [...prev, msg]);
            }} />
          </div>
        )}

        {activeTab === "fusion" && (
          <div style={{ flex: 1, padding: '2rem', background: 'var(--bg-panel)', margin: '1rem', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <TemporalFusionTab onSystemMessage={(content, tags) => {
              const msg = createPhase23Message(
                'assistant',
                content,
                'TemporalFusionEngine',
                'COPILOT_ARCHITECT',
                messages.length + 1
              );
              msg.policies = {
                priority_tags: tags,
                decay_profile: "governance_ultra",
                allow_compaction: false,
                allow_drop: false
              };
              msg.meta.origin = "fusion_panel";
              setMessages(prev => [...prev, msg]);
            }} />
          </div>
        )}

        {activeTab === "scheduler" && (
          <div style={{ flex: 1, padding: '2rem', background: 'var(--bg-panel)', margin: '1rem', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <ContextSchedulerTab />
          </div>
        )}

        {activeTab === "memory" && (
          <div style={{ flex: 1, padding: '2rem', background: 'var(--bg-panel)', margin: '1rem', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <MemoryTab onSystemMessage={(content, tags) => {
              const msg = createPhase23Message(
                'assistant',
                content,
                'SovereignMemoryOrgan',
                'COPILOT_ARCHITECT',
                messages.length + 1
              );
              msg.policies = {
                priority_tags: tags,
                decay_profile: "governance_ultra",
                allow_compaction: false,
                allow_drop: false
              };
              msg.meta.origin = "memory_panel";
              setMessages(prev => [...prev, msg]);
            }} />
          </div>
        )}

        {activeTab === "negotiation" && (
          <div style={{ flex: 1, padding: '2rem', background: 'var(--bg-panel)', margin: '1rem', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <NegotiationTab onSystemMessage={(content, tags) => {
              const msg = createPhase23Message(
                'assistant',
                content,
                'MultiAgentNegotiationEngine',
                'COPILOT_ARCHITECT',
                messages.length + 1
              );
              msg.policies = {
                priority_tags: tags,
                decay_profile: "governance_ultra",
                allow_compaction: false,
                allow_drop: false
              };
              msg.meta.origin = "negotiation_panel";
              setMessages(prev => [...prev, msg]);
            }} />
          </div>
        )}

        {activeTab === "architect" && (
          <div style={{ flex: 1, padding: '2rem', background: 'var(--bg-panel)', margin: '1rem', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <ArchitectLoopTab onSystemMessage={(content, tags) => {
              const msg = createPhase23Message(
                'assistant',
                content,
                'ArchitectTemporalLoop',
                'COPILOT_ARCHITECT',
                messages.length + 1
              );
              msg.policies = {
                priority_tags: tags,
                decay_profile: "long_horizon",
                allow_compaction: false,
                allow_drop: false
              };
              msg.meta.origin = "architect_loop_panel";
              setMessages(prev => [...prev, msg]);
            }} />
          </div>
        )}
      </div>

      {showContextEditor && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', zIndex: 9999,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          backdropFilter: 'blur(8px)'
        }}>
          <div className="glass-card" style={{ width: '80%', maxWidth: '900px', height: '80%', display: 'flex', flexDirection: 'column', padding: '2rem', background: '#0f172a', border: '1px solid rgba(59, 130, 246, 0.4)', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                <Edit size={24} color="var(--color-blue)" /> Raw Context Window Editor
              </h2>
              <button onClick={() => setShowContextEditor(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Directly manipulate the JSON payload of the chat history before it is passed to the LLM. You can inject system prompts, alter agent responses, or prune context.
            </p>

            <textarea 
              value={contextEditText}
              onChange={(e) => setContextEditText(e.target.value)}
              style={{
                flex: 1,
                width: '100%',
                background: '#020617',
                color: '#38bdf8',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                padding: '1rem',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '8px',
                outline: 'none',
                resize: 'none'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
              <button 
                onClick={() => setShowContextEditor(false)}
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-primary)', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button 
                onClick={saveContextEdit}
                style={{ background: 'var(--color-blue)', border: 'none', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Save size={18} /> Apply Context Payload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
