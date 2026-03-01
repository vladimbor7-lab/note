import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Mic, Sparkles, Tag, Save, Eye, Edit, Trash2 } from 'lucide-react';
import { Note } from '../types';

interface EditorProps {
  note: Note;
  onUpdate: (note: Note) => void;
  onDelete: (id: string) => void;
  onStructure: () => void;
  onAutoTag: () => void;
  toggleRecording: () => void;
  isProcessing: boolean;
  isRecording: boolean;
}

export const Editor: React.FC<EditorProps> = ({
  note,
  onUpdate,
  onDelete,
  onStructure,
  onAutoTag,
  toggleRecording,
  isProcessing,
  isRecording,
}) => {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [note.content]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ ...note, content: e.target.value, updatedAt: Date.now() });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...note, title: e.target.value, updatedAt: Date.now() });
  };

  return (
    <div className="flex-1 h-screen flex flex-col bg-white overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-zinc-200 p-4 flex items-center justify-between bg-white sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-600 transition-colors"
            title={isPreview ? 'Редактировать' : 'Просмотр'}
          >
            {isPreview ? <Edit className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          <div className="h-6 w-px bg-zinc-200 mx-2" />
          <button
            onClick={onStructure}
            disabled={isProcessing || isRecording}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            Причесать
          </button>
          <button
            onClick={onAutoTag}
            disabled={isProcessing || isRecording}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-100 text-zinc-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Tag className="w-4 h-4" />
            Авто-теги
          </button>
          <button
            onClick={toggleRecording}
            disabled={isProcessing}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
              isRecording 
                ? 'bg-red-100 text-red-600 animate-pulse ring-2 ring-red-500/20' 
                : 'hover:bg-red-50 text-red-600'
            }`}
          >
            <Mic className={`w-4 h-4 ${isRecording ? 'fill-current' : ''}`} />
            {isRecording ? 'Стоп' : 'Голос'}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 mr-2 hidden sm:inline">
            {isProcessing ? 'Обработка...' : 'Сохранено локально'}
          </span>
          <button
            onClick={() => onDelete(note.id)}
            className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
            title="Удалить"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-4xl mx-auto w-full">
        <input
          type="text"
          value={note.title}
          onChange={handleTitleChange}
          placeholder="Заголовок заметки..."
          className="w-full text-3xl sm:text-4xl font-bold text-zinc-900 placeholder-zinc-300 border-none focus:ring-0 bg-transparent mb-6 outline-none"
        />

        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {isPreview ? (
          <div className="prose prose-zinc max-w-none prose-headings:font-semibold prose-a:text-indigo-600">
            <ReactMarkdown>{note.content}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={note.content}
            onChange={handleContentChange}
            placeholder="Начните писать или нажмите кнопку микрофона..."
            className="w-full min-h-[50vh] resize-none text-base sm:text-lg text-zinc-700 placeholder-zinc-300 border-none focus:ring-0 bg-transparent leading-relaxed outline-none"
          />
        )}
      </div>
    </div>
  );
};
