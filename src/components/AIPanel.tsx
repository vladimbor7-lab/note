import React from 'react';
import { X, Link as LinkIcon, Tag, CheckSquare } from 'lucide-react';
import { Note } from '../types';

interface AIPanelProps {
  isOpen: boolean;
  onClose: () => void;
  tags: string[];
  relatedNotes: Note[];
  actionItems: string[];
  summary: string;
  onSelectNote: (note: Note) => void;
  onInsertContent: (content: string) => void;
  isLoading: boolean;
}

export const AIPanel: React.FC<AIPanelProps> = ({
  isOpen,
  onClose,
  tags,
  relatedNotes,
  actionItems,
  summary,
  onSelectNote,
  onInsertContent,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="w-80 h-screen bg-zinc-50 border-l border-zinc-200 flex flex-col shadow-xl fixed right-0 top-0 z-20">
      <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-white">
        <h3 className="font-semibold text-zinc-800 flex items-center gap-2">
          <span className="text-indigo-600">✨</span> AI Context
        </h3>
        <button onClick={onClose} className="p-1 hover:bg-zinc-100 rounded text-zinc-500">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-40 space-y-3">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-zinc-500 animate-pulse">Анализирую мысли...</p>
          </div>
        ) : (
          <>
            {/* Summary Section */}
            {summary && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Кратко</h4>
                  <button 
                    onClick={() => onInsertContent(`\n\n**Summary:**\n${summary}`)}
                    className="text-[10px] text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Вставить
                  </button>
                </div>
                <div className="p-3 bg-white rounded-lg border border-zinc-200 text-sm text-zinc-700 leading-relaxed">
                  {summary}
                </div>
              </div>
            )}

            {/* Action Items Section */}
            {actionItems.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                    <CheckSquare className="w-3 h-3" /> Action Items
                  </h4>
                  <button 
                    onClick={() => onInsertContent(`\n\n**Action Items:**\n${actionItems.map(i => `- [ ] ${i}`).join('\n')}`)}
                    className="text-[10px] text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Вставить
                  </button>
                </div>
                <ul className="space-y-2">
                  {actionItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-zinc-700 bg-white p-2 rounded border border-zinc-100">
                      <input type="checkbox" className="mt-1 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags Section */}
            {tags.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                  <Tag className="w-3 h-3" /> Теги
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-md border border-indigo-100">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related Notes Section */}
            {relatedNotes.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                  <LinkIcon className="w-3 h-3" /> Связи
                </h4>
                <div className="space-y-2">
                  {relatedNotes.map((note) => (
                    <button
                      key={note.id}
                      onClick={() => onSelectNote(note)}
                      className="w-full text-left p-3 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg transition-all hover:shadow-sm group"
                    >
                      <div className="font-medium text-zinc-900 text-sm group-hover:text-indigo-600 transition-colors">
                        {note.title || 'Без названия'}
                      </div>
                      <div className="text-xs text-zinc-500 mt-1 truncate">
                        {note.content}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {!summary && !tags.length && !relatedNotes.length && !actionItems.length && (
               <div className="text-center text-zinc-400 text-sm py-8">
                 Нажмите "Причесать" или "Авто-теги" для анализа
               </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
