import React from "react";
import { ChatState } from "../context/ChatProvider";
import useViewport from "../hooks/useViewport";
import "./ScrollableChat.css";

const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();
    const { isMobile, isTablet } = useViewport();
    const avatarSize = isMobile ? 32 : 40;
    const bubbleMaxWidth = isMobile ? '85%' : isTablet ? '75%' : '70%';
    const senderFontSize = isMobile ? '0.7rem' : '0.75rem';
    const senderMarginLeft = isMobile ? '8px' : '12px';
    const bubblePadding = isMobile ? "10px 14px" : "12px 16px";
    const messageFontSize = isMobile ? '0.875rem' : '0.95rem';
    const timestampFontSize = isMobile ? '0.65rem' : '0.7rem';
    const bubbleBorderRadiusOwn = isMobile ? '16px 16px 4px 16px' : '20px 20px 4px 20px';
    const bubbleBorderRadiusOther = isMobile ? '16px 16px 16px 4px' : '20px 20px 20px 4px';

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
                                <div style={{
                                    width: `${avatarSize}px`,
                                    marginRight: isMobile ? '6px' : '8px',
                                    flexShrink: 0
                                }}>
                                    {showAvatar && (
                                        <img
                                            className="hover-lift message-avatar"
                                            style={{
                                                borderRadius: "50%",
                                                width: `${avatarSize}px`,
                                                height: `${avatarSize}px`,
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

                            <div className="message-bubble-container" style={{
                                maxWidth: bubbleMaxWidth,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: isOwnMessage ? 'flex-end' : 'flex-start'
                            }}>
                                {!isOwnMessage && !isSameUser(messages, m, i) && (
                                    <span style={{
                                        fontSize: senderFontSize,
                                        color: 'var(--text-secondary)',
                                        marginBottom: '4px',
                                        marginLeft: senderMarginLeft,
                                        fontWeight: '600'
                                    }}>
                                        {m.sender.name}
                                    </span>
                                )}

                                <div className="hover-lift message-bubble" style={{
                                    background: isOwnMessage
                                        ? 'var(--gradient-primary)'
                                        : 'var(--surface-light)',
                                    color: isOwnMessage ? 'white' : 'var(--text-primary)',
                                    borderRadius: isOwnMessage
                                        ? bubbleBorderRadiusOwn
                                        : bubbleBorderRadiusOther,
                                    padding: bubblePadding,
                                    boxShadow: isOwnMessage ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                                    wordWrap: 'break-word',
                                    position: 'relative',
                                    border: isOwnMessage ? 'none' : '1px solid var(--border-color)'
                                }}>
                                    <p style={{
                                        margin: 0,
                                        fontSize: messageFontSize,
                                        lineHeight: '1.5'
                                    }}>
                                        {m.content}
                                    </p>
                                    <span style={{
                                        fontSize: timestampFontSize,
                                        opacity: 0.7,
                                        marginTop: '4px',
                                        display: 'block',
                                        textAlign: 'right'
                                    }}>
                                        {formatTime(m.createdAt)}
                                    </span>
                                </div>
                            </div>

                            {isOwnMessage && <div style={{ width: `${avatarSize}px`, flexShrink: 0 }}></div>}
                        </div>
                    );
                })}
        </div>
    );
};

export default ScrollableChat;
