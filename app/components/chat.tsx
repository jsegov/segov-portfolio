'use client';

import { useChat } from 'ai/react';
import { useState, useEffect, useRef } from 'react';

const ChatIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
    />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const LoadingDots = () => {
  const [dots, setDots] = useState('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-start p-1">
      <div className="text-white font-mono opacity-50">
        {dots || '.'}
      </div>
    </div>
  );
}

async function getInitialContext() {
  try {
    const response = await fetch('/api/chat/context');
    if (!response.ok) throw new Error('Failed to fetch context');
    return response.text();
  } catch (error) {
    console.error('Error fetching initial context:', error);
    return '';
  }
}

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  useEffect(() => {
    getInitialContext().then(context => {
      if (context && messages.length === 0) {
        handleSubmit(new Event('submit') as any, { 
          options: { 
            body: { 
              messages: [{ role: 'system', content: context }]
            }
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-black text-white rounded-none p-4 shadow-lg hover:bg-gray-900 transition-colors font-mono border border-white"
      >
        <ChatIcon />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black border border-white rounded-none shadow-xl w-80 h-96 flex flex-col font-mono">
      <div className="p-2 border-b border-white flex justify-between items-center bg-black">
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-300"
          aria-label="Close chat"
        >
          <CloseIcon />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'assistant' ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`max-w-[80%] p-1 ${
                message.role === 'assistant' ? 'text-white' : 'text-gray-300'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && <LoadingDots />}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-2 border-t border-white bg-black">
        <div className="flex">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="ask me anything"
            className="w-full bg-black text-white focus:outline-none font-mono placeholder-gray-600 px-0"
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
} 