import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Note, NoteInput } from '../types';

interface BrainFlowDB extends DBSchema {
  notes: {
    key: string;
    value: Note;
    indexes: { 'by-date': number; 'by-tags': string[] };
  };
}

const DB_NAME = 'brainflow-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<BrainFlowDB>>;

export const initDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<BrainFlowDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore('notes', { keyPath: 'id' });
        store.createIndex('by-date', 'createdAt');
        store.createIndex('by-tags', 'tags', { multiEntry: true });
      },
    });
  }
  return dbPromise;
};

export const getNotes = async (): Promise<Note[]> => {
  const db = await initDB();
  return db.getAllFromIndex('notes', 'by-date');
};

export const getNote = async (id: string): Promise<Note | undefined> => {
  const db = await initDB();
  return db.get('notes', id);
};

export const saveNote = async (note: Note): Promise<string> => {
  const db = await initDB();
  await db.put('notes', note);
  return note.id;
};

export const deleteNote = async (id: string): Promise<void> => {
  const db = await initDB();
  await db.delete('notes', id);
};

export const searchNotes = async (query: string): Promise<Note[]> => {
  const db = await initDB();
  const allNotes = await db.getAll('notes');
  const lowerQuery = query.toLowerCase();
  return allNotes.filter(
    (note) =>
      note.title.toLowerCase().includes(lowerQuery) ||
      note.content.toLowerCase().includes(lowerQuery) ||
      note.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
};
