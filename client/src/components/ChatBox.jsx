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
                padding: window.innerWidth <= 640 ? '1rem' : '1.5rem',
                width: "100%",
                height: "100%",
                borderRadius: 'var(--radius-xl)',
                background: 'var(--surface-glass)',
                backdropFilter: 'blur(var(--blur-md)) saturate(180%)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-lg)'
            }}
        >
            <SingleChat fetchAgain={false} setFetchAgain={() => { }} />
        </div>
    );
};

export default ChatBox;
