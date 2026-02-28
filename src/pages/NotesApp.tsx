import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Note } from '../db';
import { NoteEditor } from '../components/NoteEditor';
import { Plus, Search, Trash2, FileText, Settings, Menu } from 'lucide-react';

export function NotesApp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const notes = useLiveQuery(
    () => db.notes
      .orderBy('updatedAt')
      .reverse()
      .filter(note => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.tags.some(tag => tag.toLowerCase().includes(query))
        );
      })
      .toArray(),
    [searchQuery]
  );

  const handleCreateNote = async () => {
    try {
      const id = await db.notes.add({
        title: 'New Note',
        content: '',
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setSelectedNoteId(id as number);
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const handleDeleteNote = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await db.notes.delete(id);
      if (selectedNoteId === id) {
        setSelectedNoteId(null);
      }
    }
  };

  const handleSaveNote = async (updatedNote: Note) => {
    if (updatedNote.id) {
      const { id, ...changes } = updatedNote;
      await db.notes.update(id, changes);
    }
  };

  const selectedNote = notes?.find(n => n.id === selectedNoteId);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 flex flex-col`}
      >
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <FileText className="w-5 h-5" />
              </span>
              Second Brain
            </h1>
            <button 
              onClick={handleCreateNote}
              className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
              title="New Note"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {notes?.map(note => (
            <div
              key={note.id}
              onClick={() => setSelectedNoteId(note.id!)}
              className={`group flex items-start justify-between p-3 rounded-lg cursor-pointer transition-all ${
                selectedNoteId === note.id
                  ? 'bg-indigo-50 border-indigo-100 shadow-sm'
                  : 'hover:bg-gray-50 border border-transparent hover:border-gray-100'
              }`}
            >
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium truncate ${
                  selectedNoteId === note.id ? 'text-indigo-900' : 'text-gray-900'
                }`}>
                  {note.title || 'Untitled Note'}
                </h3>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {note.content || 'No content'}
                </p>
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {note.tags.map(tag => (
                      <span key={tag} className="px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-600 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteNote(note.id!);
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          {notes?.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">
              No notes found. Create one to get started!
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-100 text-xs text-gray-400 text-center">
          Local-first storage enabled
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-100">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <span className="font-semibold text-gray-900">
            {selectedNote ? selectedNote.title : 'Select a note'}
          </span>
          <div className="w-6" /> {/* Spacer */}
        </div>

        {selectedNote ? (
          <div className="flex-1 p-4 md:p-8 overflow-hidden">
            <NoteEditor 
              key={selectedNote.id} // Force re-render on note switch
              note={selectedNote} 
              onSave={handleSaveNote} 
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>Select a note or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
