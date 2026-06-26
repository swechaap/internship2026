import { useEffect, useRef, useState } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const DEFAULT_SUGGESTIONS = [
  "Book an appointment",
  "Book an ambulance",
  "Book for testing, body checkup"
];

export default function ChatWidget({ role }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: `Hello! I am your AI Assistant for the CarePortal. You are logged in as a ${role || 'Guest'}. How can I help you today?` }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:2026';
  
  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const sendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;
    
    const userMessage = { id: Date.now(), sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Use standard API_BASE_URL resolution similar to backendApi.ts
      const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:1999';
      
      const response = await fetch(`${API_BASE_URL}/api/chatbot/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            query: textToSend, 
            role: role || 'Guest'
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.response) {
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: data.response }]);
      } else {
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: "Sorry, I couldn't process that request right now." }]);
      }
    } catch (error) {
      console.error('Chat API Error:', error);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: "Error connecting to AI Assistant." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer border-2 border-white/20 hover:rotate-12"
        >
          <MessageSquare className="w-6 h-6 drop-shadow-md" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-0 right-0 w-80 sm:w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-slate-200/50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 h-[32rem] max-h-[80vh]">
          
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-4 flex items-center justify-between text-white shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-inner">
                <Bot className="w-4 h-4 text-blue-200" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">CarePortal Assistant</h3>
                <p className="text-[10px] text-blue-200/80 font-medium tracking-wide uppercase">Elite Medical AI</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                  msg.sender === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-600'
                }`}>
                  {msg.sender === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                </div>
                
                <div className={`px-4 py-2.5 rounded-2xl max-w-[80%] text-sm overflow-hidden ${
                  msg.sender === 'user' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-sm shadow-md' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm shadow-md'
                }`}>
                  {msg.sender === 'user' ? (
                    <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                  ) : (
                    <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-100 prose-pre:text-slate-800 break-words prose-a:text-blue-600">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-2 flex-row">
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-3 h-3" />
                </div>
                <div className="px-4 py-3 bg-white border border-slate-100 rounded-2xl rounded-tl-sm shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                </div>
              </div>
            )}
            
            {messages.length === 1 && !isLoading && (
              <div className="flex flex-col gap-2 mt-2 ml-8 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-500">
                <p className="text-xs text-slate-500 font-medium ml-1">Suggested actions:</p>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_SUGGESTIONS.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(suggestion)}
                      className="px-3.5 py-1.5 text-[13px] font-medium bg-white text-blue-600 border border-blue-200 rounded-full hover:bg-blue-50 hover:border-blue-400 hover:shadow-sm transition-all duration-200 cursor-pointer text-left leading-tight"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-3 bg-white border-t border-slate-100 shrink-0">
            <form onSubmit={handleSend} className="flex items-end gap-2 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                placeholder="Ask me anything..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none max-h-32 min-h-[44px]"
                rows="1"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="w-10 h-10 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center shrink-0 transition-colors disabled:opacity-50 disabled:hover:bg-blue-600 cursor-pointer mb-0.5"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
}
