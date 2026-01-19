'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import {
  Plus,
  Search,
  FileText,
  Book,
  Lightbulb,
  Settings,
  ChevronRight,
  Clock,
  Tag,
  X,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Document {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  updatedAt: string;
}

const categories = [
  { id: 'all', label: 'Все', icon: FileText },
  { id: 'guides', label: 'Гайды', icon: Book },
  { id: 'operations', label: 'Операции', icon: Settings },
  { id: 'ideas', label: 'Идеи', icon: Lightbulb },
];

const mockDocs: Document[] = [
  {
    id: '1',
    title: 'Руководство курьера',
    content: 'Полное руководство для новых курьеров. Включает правила доставки, работу с приложением...',
    category: 'guides',
    tags: ['курьер', 'обучение'],
    updatedAt: '2 часа назад',
  },
  {
    id: '2',
    title: 'Регламент работы',
    content: 'Расписание и правила работы офиса. График смен, ответственные...',
    category: 'operations',
    tags: ['офис', 'регламент'],
    updatedAt: 'Вчера',
  },
  {
    id: '3',
    title: 'FAQ для клиентов',
    content: 'Часто задаваемые вопросы и ответы для поддержки...',
    category: 'guides',
    tags: ['поддержка', 'клиенты'],
    updatedAt: '3 дня назад',
  },
  {
    id: '4',
    title: 'Идеи по улучшению',
    content: 'Список идей для улучшения сервиса и работы команды...',
    category: 'ideas',
    tags: ['идеи', 'развитие'],
    updatedAt: 'Неделю назад',
  },
];

export default function MindPage() {
  const [docs, setDocs] = useState<Document[]>(mockDocs);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredDocs = docs.filter((doc) => {
    if (activeCategory !== 'all' && doc.category !== activeCategory) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        doc.title.toLowerCase().includes(query) ||
        doc.content.toLowerCase().includes(query) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const handleCreate = () => {
    toast.success('Документ создан');
    setShowCreateModal(false);
  };

  if (!mounted) return null;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="База знаний"
        subtitle="Документация и гайды"
        actions={
          <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            Новый документ
          </button>
        }
      />

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-56 flex-shrink-0">
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5"
            />
          </div>
          <nav className="space-y-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`sidebar-item w-full ${activeCategory === cat.id ? 'active' : ''}`}
                >
                  <Icon size={18} className="sidebar-icon" />
                  <span className="sidebar-label">{cat.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="space-y-3">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className="file-card cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-[15px] font-medium text-white mb-1 group-hover:text-white transition-colors">
                      {doc.title}
                    </h3>
                    <p className="text-[13px] text-text-muted line-clamp-2 mb-3">{doc.content}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-[11px] text-text-muted flex items-center gap-1">
                        <Clock size={12} />
                        {doc.updatedAt}
                      </span>
                      <div className="flex items-center gap-2">
                        {doc.tags.map((tag) => (
                          <span key={tag} className="text-[11px] text-text-muted bg-white/5 px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-text-muted group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Document View Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-dark-elevated rounded-xl border border-white/[0.08] w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
              <h2 className="text-lg font-semibold text-white">{selectedDoc.title}</h2>
              <button onClick={() => setSelectedDoc(null)} className="btn-icon">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <p className="text-[14px] text-text-secondary leading-relaxed">{selectedDoc.content}</p>
              <div className="flex items-center gap-2 mt-6">
                {selectedDoc.tags.map((tag) => (
                  <span key={tag} className="badge bg-white/5 text-text-muted">
                    <Tag size={10} className="mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-dark-elevated rounded-xl border border-white/[0.08] w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Новый документ</h2>
              <button onClick={() => setShowCreateModal(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] text-text-muted mb-2">Название</label>
                <input type="text" placeholder="Название документа" className="w-full" />
              </div>
              <div>
                <label className="block text-[13px] text-text-muted mb-2">Категория</label>
                <select className="w-full">
                  <option value="guides">Гайды</option>
                  <option value="operations">Операции</option>
                  <option value="ideas">Идеи</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] text-text-muted mb-2">Содержание</label>
                <textarea placeholder="Текст документа" rows={6} className="w-full" />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowCreateModal(false)} className="btn-secondary flex-1">
                  Отмена
                </button>
                <button onClick={handleCreate} className="btn-primary flex-1">
                  Создать
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
