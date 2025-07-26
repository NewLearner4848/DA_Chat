import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createChat } from '../services/geminiService';
import { useAuth } from '../hooks/useAuth';
import { PaperAirplaneIcon, SparklesIcon, ChatBubbleLeftEllipsisIcon } from '../components/icons';
import Loader from '../components/Loader';
import { Chat as GeminiChat, GenerateContentResponse } from '@google/genai';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const Chat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const chatRef = useRef<GeminiChat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      chatRef.current = createChat();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to initialize chat.');
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    const botMessage: Message = { sender: 'bot', text: '' };
    setMessages(prev => [...prev, botMessage]);

    try {
        if (!chatRef.current) throw new Error("Chat not initialized");

        const stream = await chatRef.current.sendMessageStream({ message: input });
        let fullResponse = '';
        for await (const chunk of stream) {
            const chunkText = chunk.text;
            fullResponse += chunkText;
            setMessages(prev => prev.map((msg, index) => 
                index === prev.length - 1 ? { ...msg, text: fullResponse } : msg
            ));
        }

    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Failed to get response: ${errorMessage}`);
        setMessages(prev => prev.slice(0, -1)); // remove empty bot message
    } finally {
        setIsLoading(false);
    }
  }, [input, isLoading]);

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-zinc-900">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500">
                <ChatBubbleLeftEllipsisIcon className="w-16 h-16 mb-4" />
                <h2 className="text-2xl font-bold text-zinc-300">AI Chat</h2>
                <p>Start a conversation by typing your message below.</p>
            </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0"><SparklesIcon className="w-5 h-5 text-white" /></div>}
            <div className={`max-w-xl p-3 rounded-lg whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-emerald-600 text-white' : 'bg-zinc-700 text-zinc-200'}`}>
              {msg.text}
              {msg.sender === 'bot' && isLoading && index === messages.length -1 && <span className="inline-block w-2 h-4 bg-zinc-300 animate-pulse ml-1"></span>}
            </div>
            {msg.sender === 'user' && user?.photoURL && <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full flex-shrink-0" />}
          </div>
        ))}
        {isLoading && messages.length === 0 && <div className="flex justify-center"><Loader/></div>}
         <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-zinc-700">
        {error && <p className="text-red-400 text-center text-sm mb-2">{error}</p>}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            disabled={isLoading || !!error}
            className="flex-grow p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 disabled:bg-zinc-600 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <PaperAirplaneIcon className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;