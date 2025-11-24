import React from "react";
import { ChatState } from "../context/ChatProvider";

const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();

    const isSameSender = (messages, m, i, userId) => {
        return (
            i < messages.length - 1 &&
            (messages[i + 1].sender._id !== m.sender._id ||
                messages[i + 1].sender._id === undefined) &&
            messages[i].sender._id !== userId
        );
    };

    const isLastMessage = (messages, i, userId) => {
        return (
            i === messages.length - 1 &&
            messages[messages.length - 1].sender._id !== userId &&
            messages[messages.length - 1].sender._id
        );
    };

    const isSameUser = (messages, m, i) => {
        return i > 0 && messages[i - 1].sender._id === m.sender._id;
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div style={{ overflowX: "hidden" }}>
            {messages &&
                messages.map((m, i) => {
                    const isOwnMessage = m.sender._id === user._id;
                    const showAvatar = (isSameSender(messages, m, i, user._id) ||
                        isLastMessage(messages, i, user._id));
                    const marginTop = isSameUser(messages, m, i) ? 4 : 12;

                    return (
                        <div
                            key={m._id}
                            className="fade-in"
                            style={{
                                display: "flex",
                                justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                                marginTop: `${marginTop}px`,
                                animationDelay: `${i * 0.02}s`
                            }}
                        >
                            {!isOwnMessage && (
                                <div style={{ width: '40px', marginRight: '8px' }}>
                                    {showAvatar && (
                                        <img
                                            className="hover-lift"
                                            style={{
                                                borderRadius: "50%",
                                                width: "40px",
                                                height: "40px",
                                                objectFit: "cover",
                                                border: '2px solid var(--primary-start)',
                                                boxShadow: 'var(--shadow-sm)',
                                                cursor: 'pointer'
                                            }}
                                            src={m.sender.pic}
                                            alt={m.sender.name}
                                            title={m.sender.name}
                                        />
                                    )}
                                </div>
                            )}

                            <div style={{
                                maxWidth: '70%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: isOwnMessage ? 'flex-end' : 'flex-start'
                            }}>
                                {!isOwnMessage && !isSameUser(messages, m, i) && (
                                    <span style={{
                                        fontSize: '0.75rem',
                                        color: 'var(--text-secondary)',
                                        marginBottom: '4px',
                                        marginLeft: '12px',
                                        fontWeight: '600'
                                    }}>
                                        {m.sender.name}
                                    </span>
                                )}

                                <div className="hover-lift" style={{
                                    background: isOwnMessage
                                        ? 'linear-gradient(135deg, var(--primary-start), var(--primary-end))'
                                        : 'white',
                                    color: isOwnMessage ? 'white' : 'var(--text-primary)',
                                    borderRadius: isOwnMessage
                                        ? '20px 20px 4px 20px'
                                        : '20px 20px 20px 4px',
                                    padding: "12px 16px",
                                    boxShadow: isOwnMessage ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                                    wordWrap: 'break-word',
                                    position: 'relative',
                                    border: isOwnMessage ? 'none' : '1px solid rgba(0, 0, 0, 0.05)'
                                }}>
                                    <p style={{
                                        margin: 0,
                                        fontSize: '0.95rem',
                                        lineHeight: '1.5'
                                    }}>
                                        {m.content}
                                    </p>
                                    <span style={{
                                        fontSize: '0.7rem',
                                        opacity: 0.7,
                                        marginTop: '4px',
                                        display: 'block',
                                        textAlign: 'right'
                                    }}>
                                        {formatTime(m.createdAt)}
                                    </span>
                                </div>
                            </div>

                            {isOwnMessage && <div style={{ width: '40px' }}></div>}
                        </div>
                    );
                })}
        </div>
    );
};

export default ScrollableChat;
