import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { chatbotAPI } from '../api';

interface Message {
  text: string;
  isUser: boolean;
}

const ChatAssistant: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Hello! I can help you with team selection and player stats. What would you like to know?', isUser: false }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    const userMessage = message.trim();
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setMessage('');
    setIsLoading(true);
    
    try {
      const response = await chatbotAPI.sendQuery(userMessage);
      setMessages(prev => [...prev, { text: response.response, isUser: false }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        text: "I'm having trouble connecting right now. Please try again later.", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-96 flex flex-col">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`p-3 rounded-lg mb-4 ${
              msg.isUser 
                ? 'bg-blue-600 text-white ml-auto max-w-[80%]' 
                : 'bg-blue-50 max-w-[80%]'
            }`}
          >
            <p>{msg.text}</p>
          </div>
        ))}
        {isLoading && (
          <div className="bg-blue-50 p-3 rounded-lg mb-4 max-w-[80%]">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full pr-10 pl-4 py-2 border rounded-lg"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600"
            disabled={isLoading}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatAssistant;