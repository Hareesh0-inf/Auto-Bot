'use client';

import { useRouter } from 'next/navigation';
import ChatBox from '../components/chatbox';
import InputField from '../components/InputField';
import { useState } from 'react';
import React from 'react';


export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    
  ]);
  const router = useRouter();
  const sendMessage = async (userMessage: string) => {
    const userId = sessionStorage.getItem("user_id");
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    const response = await fetch('https://autobot-cmar.onrender.com/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, message: userMessage }),
    }); 
    const data = await response.json();
    const msg = data.response || "LOGIN";
    if(msg == "LOGIN") {
      router.push("/");
      return;
    }
    setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
  };

  return (
      <div className="bg-slate-900 bg-opacity-30 overflow-hidden">
      <div className="chat-box mt-10 pb-3">
      <div className="chatbox-container"> </div>
        <ChatBox messages={messages} />
        <InputField onSend={sendMessage} />
    </div>
    </div>

  );
}
