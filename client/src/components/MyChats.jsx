import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import useViewport from "../hooks/useViewport";
import "./MyChats.css";

const MyChats = () => {
    const [loggedUser, setLoggedUser] = useState();
    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
    const { isMobile, isTablet } = useViewport();

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

    const titleFontSize = isMobile ? '1.25rem' : isTablet ? '1.375rem' : '1.5rem';
    const actionFontSize = isMobile ? '0.85rem' : '0.9rem';
    const actionPadding = isMobile ? '0.5rem 0.75rem' : '0.5rem 1rem';
    const containerPadding = isMobile ? '1rem' : '1.5rem';
    const listPadding = isMobile ? '0.75rem' : '1rem';
    const avatarSize = isMobile ? 40 : isTablet ? 44 : 48;
    const nameFontSize = isMobile ? '0.9rem' : '1rem';
    const previewFontSize = isMobile ? '0.8rem' : '0.85rem';

    return (
        <div
            className="glass-card flex flex-col fade-in my-chats-container"
            style={{
                padding: containerPadding,
            }}
        >
            <div className="my-chats-header" style={{
                paddingBottom: "1rem",
                fontSize: titleFontSize,
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
                    fontSize: actionFontSize,
                    padding: actionPadding
                }}>
                    <FaPlus /> <span className="mobile-hide">New Group</span>
                </button>
            </div>
            <div style={{
                display: "flex",
                flexDirection: "column",
                padding: listPadding,
                background: 'var(--gradient-surface)',
                width: "100%",
                height: "100%",
                borderRadius: 'var(--radius-lg)',
                overflowY: "hidden"
            }}>
                {chats ? (
                    <div style={{ overflowY: "scroll", paddingRight: '0.5rem' }}>
                        {chats.map((chat, index) => (
                            <div
                                onClick={() => setSelectedChat(chat)}
                                className="hover-lift slide-in chat-item chat-item-telegram telegram-transition"
                                style={{
                                    cursor: "pointer",
                                    padding: isMobile ? '0.75rem' : '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '0.5rem',
                                    background: selectedChat === chat
                                        ? "var(--gradient-primary)"
                                        : "var(--bg-tertiary)",
                                    color: "var(--text-primary)",
                                    boxShadow: selectedChat === chat ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
                                    transition: 'all var(--transition-normal)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    animationDelay: `${index * 0.05}s`,
                                    border: selectedChat === chat ? 'none' : '1px solid var(--border-color)'
                                }}
                                key={chat._id}
                            >
                                {!chat.isGroupChat && loggedUser && (
                                    <img
                                        src={getSenderPic(loggedUser, chat.users)}
                                        alt="User"
                                        className="chat-avatar"
                                        style={{
                                            width: `${avatarSize}px`,
                                            height: `${avatarSize}px`,
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
                                        fontSize: nameFontSize,
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
                                            fontSize: previewFontSize,
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
