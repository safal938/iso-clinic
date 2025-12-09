import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const MonitoringChat: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: 'HepaGuard AI System Online. Monitoring active. How can I assist you with the clinic status?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const aiResponseText = await sendMessageToGemini(messages, userMsg.text);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: aiResponseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div className="h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar - Context Data */}
      <div className="w-full md:w-80 bg-slate-800 p-6 border-r border-slate-700 flex flex-col gap-6">
        <button 
          onClick={() => navigate('/')}
          className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 mb-4"
        >
          ← Return to Simulation
        </button>
        
        <div>
          <h2 className="text-xl font-bold text-indigo-400 mb-1">MONITORING ROOM</h2>
          <p className="text-xs text-slate-500 uppercase tracking-wider">System ID: HG-9000</p>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
            <h3 className="text-xs text-slate-400 uppercase mb-2">Clinic Vitals</h3>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">Occupancy</span>
              <span className="text-sm font-mono text-green-400">82%</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-green-400 h-full w-[82%]"></div>
            </div>
          </div>

          <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
             <h3 className="text-xs text-slate-400 uppercase mb-2">Active Alerts</h3>
             <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-yellow-400">
                   <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                   Waiting Room Capacity
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                   <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                   Telemedicine Latency Normal
                </li>
             </ul>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Background Grid Decoration */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" 
             style={{ 
               backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)',
               backgroundSize: '40px 40px'
             }}>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10 scrollbar-hide">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-2xl p-4 shadow-lg ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                }`}
              >
                <div className="text-sm leading-relaxed">{msg.text}</div>
                <div className={`text-[10px] mt-2 opacity-60 ${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {loading && (
             <div className="flex justify-start">
               <div className="bg-slate-800 text-slate-200 border border-slate-700 rounded-2xl rounded-bl-none p-4 flex items-center gap-2">
                 <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                 <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-slate-900/90 backdrop-blur border-t border-slate-800 z-20">
          <form onSubmit={handleSend} className="relative max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask HepaGuard about clinic status..."
              className="w-full bg-slate-800 text-white pl-6 pr-14 py-4 rounded-full border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 outline-none transition-all placeholder-slate-500"
            />
            <button 
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-2 top-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MonitoringChat;
