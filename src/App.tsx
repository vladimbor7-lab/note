import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { AIPanel } from './components/AIPanel';
import { Note } from './types';
import { getNotes, saveNote, deleteNote, initDB } from './lib/db';
import { structureNote, autoTagNote, processVoiceNote, findRelatedNotes } from './lib/ai';

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  
  // AI Context State
  const [aiTags, setAiTags] = useState<string[]>([]);
  const [aiRelatedNotes, setAiRelatedNotes] = useState<Note[]>([]);
  const [aiActionItems, setAiActionItems] = useState<string[]>([]);
  const [aiSummary, setAiSummary] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Load notes on mount
  useEffect(() => {
    const load = async () => {
      await initDB();
      const loadedNotes = await getNotes();
      setNotes(loadedNotes.sort((a, b) => b.updatedAt - a.updatedAt));
    };
    load();
  }, []);

  const handleSelectNote = (note: Note) => {
    setSelectedNoteId(note.id);
    // Reset AI context when switching notes
    setAiTags(note.tags || []);
    setAiRelatedNotes([]);
    setAiActionItems([]);
    setAiSummary('');
    setIsAIPanelOpen(false);
  };

  const handleNewNote = async () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: '',
      content: '',
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await saveNote(newNote);
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
    setIsAIPanelOpen(false);
  };

  const handleUpdateNote = async (updatedNote: Note) => {
    // Optimistic update
    setNotes(notes.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
    await saveNote(updatedNote);
  };

  const handleDeleteNote = async (id: string) => {
    await deleteNote(id);
    setNotes(notes.filter((n) => n.id !== id));
    if (selectedNoteId === id) {
      setSelectedNoteId(undefined);
    }
  };

  const handleStructure = async () => {
    const currentNote = notes.find((n) => n.id === selectedNoteId);
    if (!currentNote) return;

    setIsProcessing(true);
    try {
      const structuredContent = await structureNote(currentNote.content);
      const updatedNote = { ...currentNote, content: structuredContent, updatedAt: Date.now() };
      await handleUpdateNote(updatedNote);
    } catch (error) {
      console.error('Failed to structure note:', error);
      alert('Ошибка при структурировании заметки.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAutoTag = async () => {
    const currentNote = notes.find((n) => n.id === selectedNoteId);
    if (!currentNote) return;

    setIsProcessing(true);
    setIsAIPanelOpen(true); // Open panel to show loading state
    
    try {
      // Parallel execution for tags and related notes
      const [tags, relatedIds] = await Promise.all([
        autoTagNote(currentNote.content),
        findRelatedNotes(currentNote.content, notes.filter(n => n.id !== currentNote.id))
      ]);

      const updatedNote = { ...currentNote, tags: [...new Set([...currentNote.tags, ...tags])], updatedAt: Date.now() };
      await handleUpdateNote(updatedNote);
      
      setAiTags(updatedNote.tags);
      setAiRelatedNotes(notes.filter(n => relatedIds.includes(n.id)));
    } catch (error) {
      console.error('Failed to auto-tag:', error);
      alert('Ошибка при авто-тегировании.');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    } else {
      // Start recording
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Ваш браузер не поддерживает запись аудио.');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Audio = (reader.result as string).split(',')[1];
            
            setIsProcessing(true);
            setIsAIPanelOpen(true);

            try {
              const { text, summary, actionItems } = await processVoiceNote(base64Audio);
              
              const currentNote = notes.find((n) => n.id === selectedNoteId);
              if (currentNote) {
                 // Append text to current note
                 const newContent = currentNote.content ? `${currentNote.content}\n\n${text}` : text;
                 const updatedNote = { ...currentNote, content: newContent, updatedAt: Date.now() };
                 await handleUpdateNote(updatedNote);
                 
                 setAiSummary(summary);
                 setAiActionItems(actionItems);
              } else {
                 // Create new note if none selected
                 const newNote: Note = {
                    id: crypto.randomUUID(),
                    title: summary.slice(0, 50) || 'Голосовая заметка',
                    content: text,
                    tags: [],
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                 };
                 await saveNote(newNote);
                 setNotes([newNote, ...notes]);
                 setSelectedNoteId(newNote.id);
                 
                 setAiSummary(summary);
                 setAiActionItems(actionItems);
              }

            } catch (error) {
              console.error('Failed to process voice:', error);
              alert('Ошибка при обработке голоса.');
            } finally {
              setIsProcessing(false);
            }
          };
          
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Ошибка доступа к микрофону.');
      }
    }
  };

  // Filter notes by search
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  const handleInsertContent = async (content: string) => {
    const currentNote = notes.find((n) => n.id === selectedNoteId);
    if (currentNote) {
      const newContent = currentNote.content ? `${currentNote.content}${content}` : content;
      const updatedNote = { ...currentNote, content: newContent, updatedAt: Date.now() };
      await handleUpdateNote(updatedNote);
    }
  };

  return (
    <div className="flex h-screen bg-white text-zinc-900 font-sans overflow-hidden">
      <Sidebar
        notes={filteredNotes}
        onSelectNote={handleSelectNote}
        onNewNote={handleNewNote}
        selectedNoteId={selectedNoteId}
        onSearch={setSearchQuery}
      />
      
      {selectedNote ? (
        <div className="flex-1 flex relative overflow-hidden">
          <Editor
            note={selectedNote}
            onUpdate={handleUpdateNote}
            onDelete={handleDeleteNote}
            onStructure={handleStructure}
            onAutoTag={handleAutoTag}
            toggleRecording={toggleRecording}
            isProcessing={isProcessing}
            isRecording={isRecording}
          />
          {isAIPanelOpen && (
             <AIPanel 
               isOpen={isAIPanelOpen}
               onClose={() => setIsAIPanelOpen(false)}
               tags={aiTags}
               relatedNotes={aiRelatedNotes}
               actionItems={aiActionItems}
               summary={aiSummary}
               onSelectNote={handleSelectNote}
               onInsertContent={handleInsertContent}
               isLoading={isProcessing}
             />
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-zinc-50 text-zinc-400 flex-col gap-4">
          <div className="w-16 h-16 bg-zinc-200 rounded-full flex items-center justify-center">
            <span className="text-2xl">🧠</span>
          </div>
          <p>Выберите заметку или создайте новую</p>
          <button
            onClick={handleNewNote}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            Создать заметку
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
