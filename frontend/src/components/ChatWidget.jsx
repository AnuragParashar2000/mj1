import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { MessageSquare, X, Send } from 'lucide-react';

const socketURL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMsg, setInputMsg] = useState('');
    const [user, setUser] = useState(null);
    const socketRef = useRef();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            // Connect to Socket.io server
            socketRef.current = io(socketURL);

            socketRef.current.on('receive_message', (data) => {
                setMessages((prev) => [...prev, data]);
            });

            return () => {
                socketRef.current.disconnect();
            };
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (inputMsg.trim() && user) {
            const messageData = {
                id: Date.now(),
                sender: `${user.name} (${user.role === 'admin' ? 'Admin' : 'Student'})`,
                text: inputMsg,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            socketRef.current.emit('send_message', messageData);
            setMessages((prev) => [...prev, { ...messageData, isMine: true }]);
            setInputMsg('');
        }
    };

    if (!user) return null;

    return (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
            {/* Chat Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="btn"
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)'
                    }}
                >
                    <MessageSquare size={24} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div
                    className="glass-panel"
                    style={{
                        width: '350px',
                        height: '500px',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                        border: '1px solid var(--primary)'
                    }}
                >
                    {/* Header */}
                    <div style={{
                        padding: '1rem',
                        background: 'var(--primary)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: 'white'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                            <MessageSquare size={18} /> Global Lounge
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex' }}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div style={{
                        flex: 1,
                        padding: '1rem',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        background: 'rgba(15, 23, 42, 0.6)'
                    }}>
                        {messages.length === 0 ? (
                            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem', fontSize: '0.9rem' }}>
                                Welcome to the global lounge. Say hi to other students!
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg.id} style={{
                                    alignSelf: msg.isMine ? 'flex-end' : 'flex-start',
                                    maxWidth: '80%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: msg.isMine ? 'flex-end' : 'flex-start'
                                }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px', paddingLeft: msg.isMine ? '0' : '4px', paddingRight: msg.isMine ? '4px' : '0' }}>
                                        {msg.sender}
                                    </div>
                                    <div style={{
                                        background: msg.isMine ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                        color: 'white',
                                        padding: '10px 14px',
                                        borderRadius: '14px',
                                        borderBottomRightRadius: msg.isMine ? '4px' : '14px',
                                        borderBottomLeftRadius: !msg.isMine ? '4px' : '14px',
                                        fontSize: '0.9rem',
                                        lineHeight: 1.4,
                                        wordBreak: 'break-word',
                                        width: 'fit-content',
                                        maxWidth: '100%'
                                    }}>
                                        {msg.text}
                                    </div>
                                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginTop: '4px', padding: '0 4px' }}>
                                        {msg.time}
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={sendMessage} style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '8px', background: 'rgba(15, 23, 42, 0.9)' }}>
                        <input
                            type="text"
                            value={inputMsg}
                            onChange={(e) => setInputMsg(e.target.value)}
                            placeholder="Type a message..."
                            className="input"
                            style={{ margin: 0, padding: '0.75rem 1rem', borderRadius: '50px', background: 'rgba(255,255,255,0.05)', flex: 1 }}
                        />
                        <button type="submit" className="btn" style={{ width: '45px', height: '45px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} disabled={!inputMsg.trim()}>
                            <Send size={18} style={{ marginLeft: '2px' }} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;
