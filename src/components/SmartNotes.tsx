import React, { useState, useRef } from 'react';
import { Mic, MicOff, Wand2, FileText, Tag, Link as LinkIcon, Loader2, CheckSquare } from 'lucide-react';
import Markdown from 'react-markdown';
import { generateSmartNote } from '../services/gemini';

export const SmartNotes = () => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    markdown: string;
    tags: string[];
    relatedNotes: { id: string; title: string; date: string }[];
  } | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Не удалось получить доступ к микрофону.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        const response = await generateSmartNote(undefined, {
          data: base64Audio,
          mimeType: audioBlob.type || 'audio/webm'
        });
        setResult(response);
      };
    } catch (error) {
      console.error('Error processing audio:', error);
      alert('Ошибка при обработке аудио.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessText = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    try {
      const response = await generateSmartNote(inputText);
      setResult(response);
    } catch (error) {
      console.error('Error processing text:', error);
      alert('Ошибка при обработке текста.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">AI-Структуризатор (Second Brain)</h2>
        <p className="text-slate-500 mt-1">
          Превращайте поток мыслей или голосовые заметки в структурированные документы с тегами и связями.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ввод */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <FileText size={20} className="text-blue-600" />
            Входящая информация
          </h3>
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Вставьте сюда неструктурированный текст, мысли после созвона с клиентом или идеи..."
            className="w-full flex-1 min-h-[300px] p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-4"
          />

          <div className="flex items-center gap-3">
            <button
              onClick={handleProcessText}
              disabled={isLoading || !inputText.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Wand2 size={20} />}
              Причесать текст
            </button>
            
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isLoading}
              className={`px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${
                isRecording 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200 animate-pulse' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
              {isRecording ? 'Остановить' : 'Голос'}
            </button>
          </div>
        </div>

        {/* Результат */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <CheckSquare size={20} className="text-emerald-600" />
            Структура и Action Items
          </h3>
          
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-6 overflow-y-auto min-h-[300px]">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                <Loader2 size={32} className="animate-spin text-blue-600" />
                <p>ИИ анализирует и структурирует информацию...</p>
              </div>
            ) : result ? (
              <div className="space-y-6">
                <div className="prose prose-slate prose-sm max-w-none">
                  <Markdown>{result.markdown}</Markdown>
                </div>
                
                <div className="pt-6 border-t border-slate-200 space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-2">
                      <Tag size={16} className="text-blue-600" />
                      Авто-теги
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-2">
                      <LinkIcon size={16} className="text-emerald-600" />
                      Связанные заметки (Second Brain)
                    </h4>
                    <div className="space-y-2">
                      {result.relatedNotes.map((note, i) => (
                        <div key={i} className="p-3 bg-white border border-slate-200 rounded-lg hover:border-emerald-300 hover:shadow-sm transition-all cursor-pointer flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-700">{note.title}</span>
                          <span className="text-xs text-slate-400">{note.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Wand2 size={48} className="mb-4 opacity-20" />
                <p className="text-center max-w-xs">
                  Здесь появится структурированный текст, списки задач и связанные заметки.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
