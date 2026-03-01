import React, { useState, useRef } from 'react';
import { Brain, Mic, Sparkles, FileText, Tag, Link as LinkIcon, Loader2, Square } from 'lucide-react';
import { generateSmartNote } from '../services/gemini';
import Markdown from 'react-markdown';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  date: string;
}

export const SmartContext = () => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [structuredResult, setStructuredResult] = useState('');
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [relatedNotes, setRelatedNotes] = useState<{id: string, title: string, date: string}[]>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStructure = async (textToProcess: string = inputText) => {
    if (!textToProcess.trim()) return;
    
    setIsProcessing(true);
    try {
      const result = await generateSmartNote(textToProcess);
      setStructuredResult(result.markdown);
      setSuggestedTags(result.tags || []);
      setRelatedNotes(result.relatedNotes || []);
    } catch (error) {
      console.error('Error structuring text:', error);
      alert('Ошибка при обработке текста');
    } finally {
      setIsProcessing(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setIsProcessing(true);
        
        try {
          // Convert blob to base64
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64data = reader.result as string;
            // Extract just the base64 part, removing the data URL prefix
            const base64String = base64data.split(',')[1];
            
            const result = await generateSmartNote(undefined, {
              data: base64String,
              mimeType: 'audio/webm'
            });
            
            setStructuredResult(result.markdown);
            setSuggestedTags(result.tags || []);
            setRelatedNotes(result.relatedNotes || []);
            setInputText('Голосовая заметка обработана');
          };
        } catch (error) {
          console.error('Error processing audio:', error);
          alert('Ошибка при обработке аудио');
        } finally {
          setIsProcessing(false);
          stream.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Не удалось получить доступ к микрофону');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-3">
          <Brain className="text-blue-600" size={32} />
          AI-Заметки (Second Brain)
        </h1>
        <p className="text-slate-600">
          Превращайте поток мыслей и голосовые сообщения в структурированные задачи. ИИ сам найдет связи с прошлыми клиентами.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column: Input */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Поток сознания (Текст или Голос)
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Напишите всё, что помните о звонке клиента, или надиктуйте голосом..."
              className="w-full h-48 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-4"
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => handleStructure()}
                disabled={isProcessing || (!inputText.trim() && !isRecording)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                Причесать текст
              </button>
              
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`px-6 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 ${
                  isRecording 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200 animate-pulse' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isRecording ? <Square size={20} /> : <Mic size={20} />}
                {isRecording ? 'Остановить' : 'Голос'}
              </button>
            </div>
          </div>

          {/* Second Brain Links */}
          {relatedNotes.length > 0 && (
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <h3 className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Brain size={16} />
                Second Brain: Найдены связи
              </h3>
              <div className="space-y-3">
                {relatedNotes.map(note => (
                  <div key={note.id} className="bg-white p-4 rounded-xl shadow-sm border border-blue-100 hover:border-blue-300 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <LinkIcon size={14} className="text-blue-500" />
                        {note.title}
                      </h4>
                      <span className="text-xs text-slate-500">{note.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Output */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[600px] flex flex-col">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-4">
            <FileText className="text-blue-600" size={20} />
            Структурированный результат
          </h2>
          
          {structuredResult ? (
            <div className="flex-1 overflow-y-auto">
              {suggestedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {suggestedTags.map(tag => (
                    <span key={tag} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Tag size={12} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="prose prose-slate prose-sm max-w-none">
                <Markdown>{structuredResult}</Markdown>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <Brain size={48} className="mb-4 opacity-20" />
              <p className="text-center max-w-xs">
                Здесь появится структурированная заметка с задачами и тегами
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
