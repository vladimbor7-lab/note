import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { Wand2, Tag, FileText, Save, Loader2 } from 'lucide-react';
import { Note } from '../db';

interface NoteEditorProps {
  note: Note;
  onSave: (note: Note) => void;
}

export function NoteEditor({ note, onSave }: NoteEditorProps) {
  const [content, setContent] = useState(note.content);
  const [title, setTitle] = useState(note.title);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    setContent(note.content);
    setTitle(note.title);
  }, [note.id]);

  const handleAIAction = async (task: 'structure' | 'tags' | 'summary') => {
    if (!content.trim()) return;
    setIsProcessing(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, task }),
      });
      const data = await response.json();
      
      if (task === 'structure') {
        setContent(data.reply);
      } else if (task === 'tags') {
        try {
            // Clean up JSON if AI adds markdown code blocks
            let jsonStr = data.reply.replace(/```json/g, '').replace(/```/g, '').trim();
            const tags = JSON.parse(jsonStr);
            if (Array.isArray(tags)) {
                onSave({ ...note, title, content, tags, updatedAt: new Date() });
                alert(`Added tags: ${tags.join(', ')}`);
            }
        } catch (e) {
            console.error("Failed to parse tags", e);
            alert("AI suggested tags but format was invalid: " + data.reply);
        }
      } else if (task === 'summary') {
        alert("Summary:\n" + data.reply);
      }
    } catch (error) {
      console.error(error);
      alert('AI Error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    onSave({ ...note, title, content, updatedAt: new Date() });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl font-semibold bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-400 w-full mr-4"
          placeholder="Untitled Note"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAIAction('structure')}
            disabled={isProcessing}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            title="AI Structure"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            <span className="hidden sm:inline">Structure</span>
          </button>
          <button
            onClick={() => handleAIAction('tags')}
            disabled={isProcessing}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
            title="AI Tags"
          >
            <Tag className="w-4 h-4" />
            <span className="hidden sm:inline">Tags</span>
          </button>
           <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors ml-2"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('edit')}
          className={`px-6 py-2 text-sm font-medium transition-colors ${
            activeTab === 'edit' 
              ? 'text-gray-900 border-b-2 border-gray-900' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Write
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-6 py-2 text-sm font-medium transition-colors ${
            activeTab === 'preview' 
              ? 'text-gray-900 border-b-2 border-gray-900' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Preview
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'edit' ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed text-gray-800"
            placeholder="Start typing your thoughts..."
          />
        ) : (
          <div className="prose prose-slate max-w-none p-6">
            <Markdown>{content}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
}
