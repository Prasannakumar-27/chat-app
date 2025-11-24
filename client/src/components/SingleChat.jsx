import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import axios from "axios";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import io from "socket.io-client";
import ScrollableChat from "./ScrollableChat";

const ENDPOINT = "http://localhost:5000";
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
                `/api/message/${selectedChat._id}`,
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
                    "/api/message",
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
        socket.on("message recieved", (newMessageRecieved) => {
            if (
                !selectedChatCompare ||
                selectedChatCompare._id !== newMessageRecieved.chat._id
            ) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
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

    return (
        <>
            {selectedChat ? (
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
                    {/* Chat Header */}
                    <div className="fade-in" style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingBottom: "1rem",
                        marginBottom: "1rem",
                        borderBottom: "2px solid rgba(102, 126, 234, 0.1)",
                        gap: '1rem'
                    }}>
                        <button
                            onClick={() => setSelectedChat("")}
                            style={{
                                display: window.innerWidth <= 768 ? "flex" : "none",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "0.75rem",
                                borderRadius: "12px",
                                background: "rgba(139, 92, 246, 0.1)",
                                border: "none",
                                cursor: "pointer",
                                transition: "all 0.2s"
                            }}
                            onMouseOver={(e) => e.target.style.background = "rgba(139, 92, 246, 0.2)"}
                            onMouseOut={(e) => e.target.style.background = "rgba(139, 92, 246, 0.1)"}
                        >
                            <FaArrowLeft style={{ color: 'var(--primary-start)', fontSize: '1.125rem' }} />
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                            {!selectedChat.isGroupChat && (
                                <img
                                    src={getChatPic()}
                                    alt="User"
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '3px solid var(--primary-start)',
                                        boxShadow: 'var(--shadow-md)'
                                    }}
                                />
                            )}
                            <div>
                                <h2 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: '700',
                                    color: 'var(--text-primary)',
                                    marginBottom: '0.125rem'
                                }}>
                                    {getChatName()}
                                </h2>
                                {istyping && (
                                    <p style={{
                                        fontSize: '0.85rem',
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
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        padding: "1rem",
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%)',
                        width: "100%",
                        flex: 1,
                        borderRadius: "20px",
                        overflowY: "hidden",
                        marginBottom: '1rem'
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
                    <div style={{
                        display: 'flex',
                        gap: '0.75rem',
                        alignItems: 'center'
                    }}>
                        <input
                            className="form-input"
                            style={{
                                flex: 1,
                                padding: '1rem 1.25rem',
                                borderRadius: '16px',
                                fontSize: '0.95rem'
                            }}
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={typingHandler}
                            onKeyDown={sendMessage}
                        />
                        <button
                            className="btn btn-primary hover-lift"
                            onClick={sendMessage}
                            disabled={!newMessage}
                            style={{
                                padding: '1rem 1.25rem',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                opacity: newMessage ? 1 : 0.5,
                                cursor: newMessage ? 'pointer' : 'not-allowed'
                            }}
                        >
                            <FaPaperPlane />
                            <span className="hidden md:inline">Send</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="fade-in" style={{
                    display: "flex",
                    flexDirection: 'column',
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    gap: '1rem'
                }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary-start), var(--primary-end))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem',
                        color: 'white',
                        boxShadow: 'var(--shadow-lg)',
                        marginBottom: '1rem'
                    }}>
                        💬
                    </div>
                    <p className="gradient-text" style={{
                        fontSize: "1.75rem",
                        fontWeight: '700',
                        textAlign: 'center',
                        maxWidth: '400px'
                    }}>
                        Select a chat to start messaging
                    </p>
                    <p style={{
                        fontSize: '1rem',
                        color: 'var(--text-secondary)',
                        textAlign: 'center',
                        maxWidth: '350px'
                    }}>
                        Choose from your existing conversations or search for someone new
                    </p>
                </div>
            )}
        </>
    );
};

export default SingleChat;
