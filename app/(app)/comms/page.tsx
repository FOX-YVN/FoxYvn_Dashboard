'use client';

import { useState, useEffect, useRef } from 'react';
import { PageHeader } from '@/components/page-header';
import {
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  Check,
  CheckCheck,
  Image as ImageIcon,
  Paperclip,
  Smile,
} from 'lucide-react';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  avatar?: string;
}

interface Message {
  id: string;
  text: string;
  sent: boolean;
  time: string;
  status: 'sent' | 'delivered' | 'read';
}

const mockChats: Chat[] = [
  { id: '1', name: 'Артур Курьер', lastMessage: 'Заказ доставлен', time: '14:32', unread: 0, online: true },
  { id: '2', name: 'Гагик Курьер', lastMessage: 'Еду на точку', time: '14:15', unread: 2, online: true },
  { id: '3', name: 'Анна Менеджер', lastMessage: 'Отчёт отправлен', time: '13:45', unread: 0, online: false },
  { id: '4', name: 'Клиент #1542', lastMessage: 'Спасибо за заказ!', time: '12:30', unread: 0, online: false },
];

const mockMessages: Message[] = [
  { id: '1', text: 'Привет! Заказ YVN-003 готов к доставке', sent: false, time: '14:10', status: 'read' },
  { id: '2', text: 'Отлично, забирай', sent: true, time: '14:12', status: 'read' },
  { id: '3', text: 'Уже еду', sent: false, time: '14:13', status: 'read' },
  { id: '4', text: 'Адрес: ул. Туманяна, 8', sent: true, time: '14:14', status: 'delivered' },
  { id: '5', text: 'Еду на точку', sent: false, time: '14:15', status: 'read' },
];

export default function CommsPage() {
  const [chats] = useState<Chat[]>(mockChats);
  const [activeChat, setActiveChat] = useState<Chat | null>(mockChats[1]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sent: true,
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };
    setMessages([...messages, msg]);
    setNewMessage('');
  };

  if (!mounted) return null;

  return (
    <div className="animate-fade-in h-[calc(100vh-64px)]">
      <PageHeader title="Сообщения" subtitle="Telegram интеграция" />

      <div className="flex h-[calc(100%-80px)] bg-dark-elevated rounded-xl border border-white/[0.08] overflow-hidden">
        {/* Chat List */}
        <div className="w-80 border-r border-white/[0.08] flex flex-col">
          <div className="p-4">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Поиск"
                className="w-full pl-9 py-2 text-[13px]"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                  activeChat?.id === chat.id ? 'bg-white/[0.06]' : 'hover:bg-white/[0.04]'
                }`}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[13px] font-medium">
                    {chat.name.charAt(0)}
                  </div>
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-white/40 rounded-full border-2 border-dark-elevated" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-white truncate">{chat.name}</span>
                    <span className="text-[11px] text-text-muted">{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[12px] text-text-muted truncate">{chat.lastMessage}</span>
                    {chat.unread > 0 && (
                      <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-[10px] font-medium text-white">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {activeChat ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[13px] font-medium">
                  {activeChat.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[14px] font-medium text-white">{activeChat.name}</p>
                  <p className="text-[11px] text-text-muted">
                    {activeChat.online ? 'В сети' : 'Не в сети'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-icon"><Phone size={18} /></button>
                <button className="btn-icon"><Video size={18} /></button>
                <button className="btn-icon"><MoreVertical size={18} /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`chat-message ${msg.sent ? 'sent' : 'received'}`}>
                    <p>{msg.text}</p>
                    <div className={`flex items-center gap-1 mt-1 ${msg.sent ? 'justify-end' : ''}`}>
                      <span className="text-[10px] opacity-60">{msg.time}</span>
                      {msg.sent && (
                        msg.status === 'read' ? (
                          <CheckCheck size={12} className="text-white/50" />
                        ) : (
                          <Check size={12} className="opacity-60" />
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-6 py-4 border-t border-white/[0.08]">
              <div className="flex items-center gap-3">
                <button className="btn-icon"><Paperclip size={18} /></button>
                <input
                  type="text"
                  placeholder="Написать сообщение..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1"
                />
                <button className="btn-icon"><Smile size={18} /></button>
                <button
                  onClick={handleSend}
                  className="btn-primary px-4"
                  disabled={!newMessage.trim()}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-text-muted">
            Выберите чат
          </div>
        )}
      </div>
    </div>
  );
}
