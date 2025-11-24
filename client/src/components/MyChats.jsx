import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import axios from "axios";
import { FaPlus } from "react-icons/fa";

const MyChats = () => {
    const [loggedUser, setLoggedUser] = useState();
    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const API_URL = import.meta.env.VITE_BACKEND_URL;
            const { data } = await axios.get(`${API_URL}/api/chat`, config);
            setChats(data);
        } catch (error) {
            alert("Failed to Load the chats");
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
        // eslint-disable-next-line
    }, []);

    const getSender = (loggedUser, users) => {
        return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
    };

    const getSenderPic = (loggedUser, users) => {
        return users[0]._id === loggedUser._id ? users[1].pic : users[0].pic;
    };

    return (
        <div
            className={`glass-card ${selectedChat ? "hidden md:flex" : "flex"
                } flex-col fade-in my-chats-container`}
            style={{
                display: selectedChat ? "none" : "flex",
                flexDirection: "column",
                padding: window.innerWidth <= 640 ? '1rem' : window.innerWidth <= 1024 ? '1.25rem' : '1.5rem',
                width: "100%",
                height: "100%",
                borderRadius: window.innerWidth <= 640 ? '20px' : '24px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: 'var(--shadow-lg)'
            }}
        >
            <div className="my-chats-header" style={{
                paddingBottom: "1rem",
                fontSize: window.innerWidth <= 640 ? '1.25rem' : window.innerWidth <= 1024 ? '1.375rem' : '1.5rem',
                fontWeight: "700",
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: '1rem',
                flexWrap: 'wrap',
                gap: '0.5rem'
            }}>
                <span className="gradient-text">My Chats</span>
                <button className="btn btn-ghost flex items-center gap-2 hover-lift" style={{
                    fontSize: window.innerWidth <= 640 ? '0.85rem' : '0.9rem',
                    padding: window.innerWidth <= 640 ? '0.5rem 0.75rem' : '0.5rem 1rem'
                }}>
                    <FaPlus /> <span className="mobile-hide">New Group</span>
                </button>
            </div>
            <div style={{
                display: "flex",
                flexDirection: "column",
                padding: "1rem",
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                width: "100%",
                height: "100%",
                borderRadius: "20px",
                overflowY: "hidden"
            }}>
                {chats ? (
                    <div style={{ overflowY: "scroll", paddingRight: '0.5rem' }}>
                        {chats.map((chat, index) => (
                            <div
                                onClick={() => setSelectedChat(chat)}
                                className="hover-lift slide-in chat-item"
                                style={{
                                    cursor: "pointer",
                                    padding: window.innerWidth <= 640 ? '0.75rem' : window.innerWidth <= 1024 ? '0.875rem' : '1rem',
                                    borderRadius: window.innerWidth <= 640 ? '12px' : '16px',
                                    marginBottom: window.innerWidth <= 640 ? '0.5rem' : '0.75rem',
                                    background: selectedChat === chat
                                        ? "linear-gradient(135deg, var(--primary-start), var(--primary-end))"
                                        : "white",
                                    color: selectedChat === chat ? "white" : "var(--text-primary)",
                                    boxShadow: selectedChat === chat ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                                    transition: 'all var(--transition-normal)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: window.innerWidth <= 640 ? '0.75rem' : '1rem',
                                    animationDelay: `${index * 0.05}s`
                                }}
                                key={chat._id}
                            >
                                {!chat.isGroupChat && loggedUser && (
                                    <img
                                        src={getSenderPic(loggedUser, chat.users)}
                                        alt="User"
                                        className="chat-avatar"
                                        style={{
                                            width: window.innerWidth <= 640 ? '40px' : window.innerWidth <= 1024 ? '44px' : '48px',
                                            height: window.innerWidth <= 640 ? '40px' : window.innerWidth <= 1024 ? '44px' : '48px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            border: selectedChat === chat ? '3px solid white' : '3px solid var(--primary-start)',
                                            boxShadow: 'var(--shadow-sm)',
                                            flexShrink: 0
                                        }}
                                    />
                                )}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{
                                        fontWeight: '600',
                                        fontSize: window.innerWidth <= 640 ? '0.9rem' : '1rem',
                                        marginBottom: '0.25rem',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {!chat.isGroupChat
                                            ? getSender(loggedUser, chat.users)
                                            : chat.chatName}
                                    </p>
                                    {chat.latestMessage && (
                                        <p style={{
                                            fontSize: window.innerWidth <= 640 ? '0.8rem' : '0.85rem',
                                            opacity: 0.8,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {chat.latestMessage.content}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <div className="spinner"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyChats;
