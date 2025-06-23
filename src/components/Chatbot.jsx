import React, { useState, useRef, useEffect } from 'react';
import { BotMessageSquare, SendHorizontal } from 'lucide-react';
import useChat from '../context_store/chat_store';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const chatRef = useRef(null);
  const { messages, sendMessage, loading, error, clearError } = useChat();

  useEffect(() => {
    if (open && chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, open]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await sendMessage(input);
    setInput('');
  };

  return (
    <>
      {/* Floating Glowing Square Icon with Floating Animation */}
      <div
        className="fixed bottom-8 right-8 z-[1000] cursor-pointer animate-float"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="relative flex items-center justify-center">
          {/* Glowing blue effect */}
          <div className="absolute -inset-2 bg-blue-500 blur-lg opacity-60 animate-pulse z-0 rounded-full"></div>
          <div className="relative w-[50px] h-[50px] rounded-full bg-blue-600 flex items-center justify-center shadow-lg z-10">
            <BotMessageSquare className="text-white" size={28} />
          </div>
        </div>
      </div>
      
      {/* Chat Window */}
      {open && (
        <div
          className="fixed bottom-[110px] right-8 w-[350px] max-h-[500px] bg-[#1E1F2B] rounded-xl shadow-2xl z-[1001] flex flex-col border border-[#23234a]"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#23234a] bg-[#16213E] rounded-t-xl">
            <span className="font-bold text-white">Chatbot</span>
            <button onClick={() => setOpen(false)} className="text-white text-2xl leading-none hover:text-gray-300 focus:outline-none">×</button>
          </div>
          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 bg-[#23234a]">
            {messages.length === 0 && <div className="text-gray-400 text-center">Ask me anything!</div>}
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <span
                  className={`inline-block rounded-2xl px-4 py-2 max-w-[80%] break-words text-sm ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#1E1F2B] text-gray-100 border border-[#23234a]'
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            {loading && <div className="text-gray-400 text-center">Bot is typing...</div>}
            {error && (
              <div className="text-red-400 text-center">
                {error} <button onClick={clearError} className="ml-2 text-xs">x</button>
              </div>
            )}
          </div>
          <form onSubmit={handleSend} className="flex border-t border-[#23234a] p-3 bg-[#16213E] rounded-b-xl">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 bg-[#23234a] text-white border-none outline-none px-3 py-2 rounded-lg text-base placeholder-gray-400"
              disabled={loading}
            />
            <button type="submit" className="ml-3 bg-blue-600 text-white border-none rounded-lg px-3 py-1 text-base font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60" disabled={loading || !input.trim()}>
              <SendHorizontal className="text-white" size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot; 