import React from "react";
import { ChatState } from "../context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatBox = () => {
    const { selectedChat } = ChatState();

    return (
        <div
            className={`glass-card ${selectedChat ? "flex" : "hidden md:flex"
                } items-center flex-col fade-in chat-box-container`}
            style={{
                display: selectedChat ? "flex" : "none",
                alignItems: "center",
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
            <SingleChat fetchAgain={false} setFetchAgain={() => { }} />
        </div>
    );
};

export default ChatBox;
