'use client';

import { useState, useEffect, useRef } from 'react';
import { PageHeader } from '@/components/page-header';
import {
  Send,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  Copy,
  MoreHorizontal,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const suggestions = [
  'Проанализируй заказы за сегодня',
  'Составь отчёт по курьерам',
  'Помоги с оптимизацией маршрутов',
  'Напиши шаблон сообщения клиенту',
];

export default function AiCorePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              assistantContent += content;
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessage.id ? { ...msg, content: assistantContent } : msg
                )
              );
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch {
      toast.error('Ошибка при получении ответа');
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Скопировано');
  };

  if (!mounted) return null;

  return (
    <div className="animate-fade-in h-[calc(100vh-64px)] flex flex-col">
      <PageHeader title="AI Ассистент" subtitle="Искусственный интеллект FOX YVN" />

      <div className="flex-1 bg-dark-elevated rounded-xl border border-white/[0.08] flex flex-col overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.06] flex items-center justify-center mb-6">
                <Sparkles size={32} className="text-white/70" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Привет! Я AI ассистент FOX YVN</h3>
              <p className="text-[14px] text-text-muted mb-8">Как я могу помочь вам сегодня?</p>
              <div className="grid grid-cols-2 gap-3 max-w-lg">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(suggestion)}
                    className="text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-[13px] text-text-secondary"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                      <Bot size={16} className="text-white/70" />
                    </div>
                  )}
                  <div className={`max-w-[70%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                    <div className={`rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-white/10 text-white' : 'bg-white/5 text-text-secondary'}`}>
                      <p className="text-[14px] whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    <div className={`flex items-center gap-2 mt-1 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                      <span className="text-[11px] text-text-muted">{msg.timestamp}</span>
                      {msg.role === 'assistant' && msg.content && (
                        <button onClick={() => copyMessage(msg.content)} className="btn-icon p-1">
                          <Copy size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <User size={16} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
                    <Bot size={16} className="text-white/70" />
                  </div>
                  <div className="flex items-center gap-2 text-text-muted">
                    <RefreshCw size={14} className="animate-spin" />
                    <span className="text-[13px]">Думаю...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-white/[0.08] p-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Напишите сообщение..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              disabled={isLoading}
              className="flex-1"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="btn-primary px-4 disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
