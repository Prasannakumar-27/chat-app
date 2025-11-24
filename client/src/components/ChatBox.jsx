import React from "react";
import { ChatState } from "../context/ChatProvider";
import SingleChat from "./SingleChat";
import useViewport from "../hooks/useViewport";
import "./ChatBox.css";

const ChatBox = () => {
    const { selectedChat } = ChatState();
    const { isMobile } = useViewport();

    return (
        <div
            className="glass-card items-center flex-col fade-in chat-box-container"
            style={{
                display: selectedChat || !isMobile ? "flex" : "none",
                padding: isMobile ? '1rem' : '1.5rem',
            }}
        >
            <SingleChat fetchAgain={false} setFetchAgain={() => { }} />
        </div>
    );
};

export default ChatBox;
