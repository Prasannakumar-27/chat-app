import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import axios from "axios";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import io from "socket.io-client";
import ScrollableChat from "./ScrollableChat";
import useViewport from "../hooks/useViewport";
import "./SingleChat.css";

const ENDPOINT = import.meta.env.VITE_BACKEND_URL;
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);

    const { user, selectedChat, setSelectedChat, notification, setNotification } =
        ChatState();

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(
                `${ENDPOINT}/api/message/${selectedChat._id}`,
                config
            );

            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            alert("Failed to Load the Messages");
        }
    };

    const sendMessage = async (event) => {
        if ((event.key === "Enter" || event.type === "click") && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                const { data } = await axios.post(
                    `${ENDPOINT}/api/message`,
                    {
                        content: newMessage,
                        chatId: selectedChat,
                    },
                    config
                );
                socket.emit("new message", data);
                setMessages([...messages, data]);
            } catch (error) {
                alert("Failed to send the Message");
            }
        }
    };

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, []);

    useEffect(() => {
        fetchMessages();

        selectedChatCompare = selectedChat;
        // eslint-disable-next-line
    }, [selectedChat]);

    useEffect(() => {
        if (!socket) return;

        const messageRecievedHandler = (newMessageRecieved) => {
            if (
                !selectedChatCompare ||
                selectedChatCompare._id !== newMessageRecieved.chat._id
            ) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
            }
        };

        socket.on("message recieved", messageRecievedHandler);

        return () => {
            socket.off("message recieved", messageRecievedHandler);
        };
    });

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    const getChatName = () => {
        if (selectedChat.isGroupChat) {
            return selectedChat.chatName;
        }
        return selectedChat.users[0]._id === user._id
            ? selectedChat.users[1].name
            : selectedChat.users[0].name;
    };

    const getChatPic = () => {
        if (selectedChat.isGroupChat) {
            return null;
        }
        return selectedChat.users[0]._id === user._id
            ? selectedChat.users[1].pic
            : selectedChat.users[0].pic;
    };

    const { isMobile, isTablet } = useViewport();
    const backButtonPadding = isMobile ? '0.625rem' : '0.75rem';
    const titleFontSize = isMobile ? '1rem' : isTablet ? '1.125rem' : '1.25rem';
    const typingFontSize = isMobile ? '0.8rem' : '0.85rem';
    const avatarSize = isMobile ? 40 : isTablet ? 44 : 48;
    const headerSpacing = isMobile ? '0.75rem' : '1rem';
    const messagesPadding = isMobile ? '0.75rem' : '1rem';
    const messageMargin = isMobile ? '0.75rem' : '1rem';
    const inputGap = isMobile ? '0.5rem' : '0.75rem';
    const inputDirection = isMobile ? 'column' : 'row';
    const inputPadding = isMobile ? '0.75rem 1rem' : '1rem 1.25rem';
    const inputRadius = isMobile ? '12px' : '16px';
    const inputFontSize = isMobile ? '0.9rem' : '0.95rem';
    const sendButtonWidth = isMobile ? '44px' : 'auto';
    const emptyCircleSize = isMobile ? 80 : isTablet ? 100 : 120;
    const emptyIconSize = isMobile ? '2rem' : isTablet ? '2.5rem' : '3rem';
    const emptyTitleFont = isMobile ? '1.25rem' : isTablet ? '1.5rem' : '1.75rem';
    const emptyTextFont = isMobile ? '0.875rem' : '1rem';
    const emptyGap = isMobile ? '0.75rem' : '1rem';
    const emptyCircleMargin = isMobile ? '0.5rem' : '1rem';

    return (
        <>
            {selectedChat ? (
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
                    {/* Chat Header */}
                    <div className="fade-in chat-header" style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingBottom: headerSpacing,
                        marginBottom: headerSpacing,
                        borderBottom: "1px solid var(--border-color)",
                        gap: headerSpacing,
                        flexWrap: 'wrap'
                    }}>
                        <button
                            onClick={() => setSelectedChat("")}
                            className="back-button md:hidden"
                            style={{
                                display: isMobile ? "flex" : "none",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: backButtonPadding,
                                borderRadius: "var(--radius-md)",
                                background: "var(--bg-tertiary)",
                                border: "1px solid var(--border-color)",
                                cursor: "pointer",
                                transition: "all var(--transition-normal)",
                                minWidth: '44px',
                                minHeight: '44px'
                            }}
                            onMouseOver={(e) => e.target.style.background = "rgba(139, 92, 246, 0.2)"}
                            onMouseOut={(e) => e.target.style.background = "rgba(139, 92, 246, 0.1)"}
                        >
                            <FaArrowLeft style={{ color: 'var(--primary-start)', fontSize: isMobile ? '1rem' : '1.125rem' }} />
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: headerSpacing, flex: 1, minWidth: 0 }}>
                            {!selectedChat.isGroupChat && (
                                <img
                                    src={getChatPic()}
                                    alt="User"
                                    className="chat-header-avatar"
                                    style={{
                                        width: `${avatarSize}px`,
                                        height: `${avatarSize}px`,
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '3px solid var(--primary-start)',
                                        boxShadow: 'var(--shadow-md)',
                                        flexShrink: 0
                                    }}
                                />
                            )}
                            <div style={{ minWidth: 0, flex: 1 }}>
                                <h2 style={{
                                    fontSize: titleFontSize,
                                    fontWeight: '700',
                                    color: 'var(--text-primary)',
                                    marginBottom: '0.125rem',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {getChatName()}
                                </h2>
                                {istyping && (
                                    <p style={{
                                        fontSize: typingFontSize,
                                        color: 'var(--primary-start)',
                                        fontStyle: 'italic'
                                    }}>
                                        typing...
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="messages-area" style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        padding: messagesPadding,
                        background: 'var(--bg-tertiary)',
                        width: "100%",
                        flex: 1,
                        borderRadius: 'var(--radius-lg)',
                        overflowY: "hidden",
                        marginBottom: messageMargin,
                        border: '1px solid var(--border-color)'
                    }}>
                        {loading ? (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%'
                            }}>
                                <div className="spinner"></div>
                            </div>
                        ) : (
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                overflowY: "scroll",
                                paddingRight: '0.5rem'
                            }}>
                                <ScrollableChat messages={messages} />
                            </div>
                        )}
                    </div>

                    {/* Message Input */}
                    <div className="message-input-container" style={{
                        display: 'flex',
                        flexDirection: inputDirection,
                        gap: inputGap,
                        alignItems: isMobile ? 'stretch' : 'center'
                    }}>
                        <input
                            className="form-input message-input"
                            style={{
                                flex: 1,
                                padding: inputPadding,
                                borderRadius: inputRadius,
                                fontSize: inputFontSize
                            }}
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={typingHandler}
                            onKeyDown={sendMessage}
                        />
                        <button
                            className="btn btn-primary hover-lift send-button"
                            onClick={sendMessage}
                            disabled={!newMessage}
                            style={{
                                padding: inputPadding,
                                borderRadius: inputRadius,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                opacity: newMessage ? 1 : 0.5,
                                cursor: newMessage ? 'pointer' : 'not-allowed',
                                minWidth: sendButtonWidth,
                                width: isMobile ? '100%' : 'auto',
                                minHeight: '44px'
                            }}
                        >
                            <FaPaperPlane />
                            <span className="mobile-hide">Send</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="fade-in empty-state" style={{
                    display: "flex",
                    flexDirection: 'column',
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    gap: emptyGap,
                    padding: '1rem'
                }}>
                    <div style={{
                        width: `${emptyCircleSize}px`,
                        height: `${emptyCircleSize}px`,
                        borderRadius: '50%',
                        background: 'var(--gradient-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: emptyIconSize,
                        color: 'white',
                        boxShadow: 'var(--shadow-glow)',
                        marginBottom: emptyCircleMargin
                    }}>
                        💬
                    </div>
                    <p className="gradient-text" style={{
                        fontSize: emptyTitleFont,
                        fontWeight: '700',
                        textAlign: 'center',
                        maxWidth: '400px',
                        padding: '0 1rem'
                    }}>
                        Select a chat to start messaging
                    </p>
                    <p style={{
                        fontSize: emptyTextFont,
                        color: 'var(--text-secondary)',
                        textAlign: 'center',
                        maxWidth: '350px',
                        padding: '0 1rem'
                    }}>
                        Choose from your existing conversations or search for someone new
                    </p>
                </div>
            )}
        </>
    );
};

export default SingleChat;
