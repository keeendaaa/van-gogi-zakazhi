import { motion } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const aiResponses = [
  'Добро пожаловать в Ван Гоги! Чем могу помочь?',
  'Наши фирменные блюда - это Стейк Рибай и Ризотто с трюфелем. Рекомендую попробовать!',
  'У нас есть отличные вегетарианские опции. Хотите узнать подробнее?',
  'Конечно! Сейчас позову официанта к вашему столику.',
  'Отличный выбор! Это блюдо готовится около 15-20 минут.',
];

export function AIWaiter() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Здравствуйте! Я ваш AI-помощник в ресторане "Ван Гоги". Могу помочь с выбором блюд, ответить на вопросы о меню или позвать официанта. Чем могу быть полезен?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: messages.length + 2,
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  const quickActions = [
    'Рекомендуйте блюдо',
    'Вегетарианское меню',
    'Позвать официанта',
    'Состав блюда',
  ];

  return (
    <div className="max-w-4xl mx-auto px-3 py-4 h-[calc(100vh-140px)] flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="bg-gradient-to-r from-[#C41E3A] to-[#8B1538] p-2.5 rounded-xl">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-[#C41E3A]">AI Официант</h2>
        </div>
        <p className="text-gray-600 text-sm">
          Задавайте любые вопросы о меню и получайте персональные рекомендации
        </p>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-3 space-y-3 pr-1">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex gap-2 ${
              message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                message.sender === 'ai'
                  ? 'bg-gradient-to-r from-[#C41E3A] to-[#8B1538]'
                  : 'bg-gray-200'
              }`}
            >
              {message.sender === 'ai' ? (
                <Bot className="w-4 h-4 text-white" />
              ) : (
                <User className="w-4 h-4 text-gray-600" />
              )}
            </div>

            {/* Message bubble */}
            <div
              className={`max-w-[75%] px-3 py-2.5 rounded-2xl ${
                message.sender === 'ai'
                  ? 'bg-white shadow-md'
                  : 'bg-gradient-to-r from-[#C41E3A] to-[#8B1538] text-white'
              }`}
            >
              <p className={`text-sm ${message.sender === 'ai' ? 'text-gray-700' : ''}`}>
                {message.text}
              </p>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick actions */}
      <div className="mb-3">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {quickActions.map((action) => (
            <button
              key={action}
              onClick={() => setInputText(action)}
              className="px-3 py-1.5 bg-white border-2 border-[#C41E3A]/20 text-[#C41E3A] rounded-full active:bg-[#C41E3A]/5 transition-colors whitespace-nowrap text-xs"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Напишите ваш вопрос..."
          className="flex-1 px-3 py-2.5 bg-white border-2 border-[#C41E3A]/20 rounded-xl focus:outline-none focus:border-[#C41E3A] transition-colors text-sm"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          className="bg-gradient-to-r from-[#C41E3A] to-[#8B1538] text-white p-2.5 rounded-xl shadow-lg"
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}