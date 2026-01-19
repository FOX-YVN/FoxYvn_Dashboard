'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import {
  Plus,
  Search,
  Grid,
  List,
  Folder,
  File,
  FileText,
  Image,
  Film,
  Music,
  MoreHorizontal,
  Download,
  Trash2,
  Lock,
  Upload,
  X,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface VaultFile {
  id: string;
  name: string;
  type: 'folder' | 'document' | 'image' | 'video' | 'audio' | 'other';
  size?: string;
  modified: string;
  encrypted: boolean;
}

const mockFiles: VaultFile[] = [
  { id: '1', name: 'Документы', type: 'folder', modified: '2 часа назад', encrypted: true },
  { id: '2', name: 'Контракты', type: 'folder', modified: 'Вчера', encrypted: true },
  { id: '3', name: 'Отчёт_Q4.pdf', type: 'document', size: '2.4 MB', modified: '3 дня назад', encrypted: true },
  { id: '4', name: 'Презентация.pptx', type: 'document', size: '15.2 MB', modified: 'Неделю назад', encrypted: false },
  { id: '5', name: 'logo_final.png', type: 'image', size: '540 KB', modified: 'Неделю назад', encrypted: false },
  { id: '6', name: 'Встреча_запись.mp4', type: 'video', size: '156 MB', modified: '2 недели назад', encrypted: true },
];

const getFileIcon = (type: string) => {
  switch (type) {
    case 'folder': return Folder;
    case 'document': return FileText;
    case 'image': return Image;
    case 'video': return Film;
    case 'audio': return Music;
    default: return File;
  }
};

export default function VaultPage() {
  const [files, setFiles] = useState<VaultFile[]>(mockFiles);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpload = () => {
    toast.success('Файл загружен');
    setShowUploadModal(false);
  };

  if (!mounted) return null;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Хранилище"
        subtitle="Зашифрованное хранение файлов"
        actions={
          <button onClick={() => setShowUploadModal(true)} className="btn-primary flex items-center gap-2">
            <Upload size={16} />
            Загрузить
          </button>
        }
      />

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Поиск файлов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`btn-icon ${viewMode === 'grid' ? 'bg-white/10' : ''}`}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`btn-icon ${viewMode === 'list' ? 'bg-white/10' : ''}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Files */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-4 gap-4">
          {filteredFiles.map((file) => {
            const Icon = getFileIcon(file.type);
            return (
              <div key={file.id} className="file-card group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    file.type === 'folder' ? 'bg-white/[0.08]' : 'bg-white/10'
                  }`}>
                    <Icon size={24} className={file.type === 'folder' ? 'text-white/70' : 'text-text-muted'} />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {file.encrypted && <Lock size={14} className="text-white/70" />}
                    <button className="btn-icon p-1"><MoreHorizontal size={16} /></button>
                  </div>
                </div>
                <p className="text-[13px] font-medium text-white truncate mb-1">{file.name}</p>
                <p className="text-[11px] text-text-muted">
                  {file.size ? `${file.size} • ` : ''}{file.modified}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-dark-elevated rounded-xl border border-white/[0.08] overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Имя</th>
                <th>Размер</th>
                <th>Изменён</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file) => {
                const Icon = getFileIcon(file.type);
                return (
                  <tr key={file.id} className="cursor-pointer">
                    <td>
                      <div className="flex items-center gap-3">
                        <Icon size={18} className={file.type === 'folder' ? 'text-white/70' : 'text-text-muted'} />
                        <span className="text-white">{file.name}</span>
                        {file.encrypted && <Lock size={12} className="text-white/70" />}
                      </div>
                    </td>
                    <td className="text-text-muted">{file.size || '—'}</td>
                    <td className="text-text-muted">{file.modified}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button className="btn-icon"><Download size={16} /></button>
                        <button className="btn-icon"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-dark-elevated rounded-xl border border-white/[0.08] w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Загрузить файл</h2>
              <button onClick={() => setShowUploadModal(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>
            <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center mb-4">
              <Upload size={40} className="mx-auto mb-4 text-text-muted" />
              <p className="text-[13px] text-text-muted mb-2">
                Перетащите файлы сюда или
              </p>
              <button className="btn-secondary">Выбрать файлы</button>
            </div>
            <label className="flex items-center gap-2 text-[13px] text-text-muted">
              <input type="checkbox" defaultChecked className="rounded" />
              Зашифровать файл
            </label>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowUploadModal(false)} className="btn-secondary flex-1">
                Отмена
              </button>
              <button onClick={handleUpload} className="btn-primary flex-1">
                Загрузить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
