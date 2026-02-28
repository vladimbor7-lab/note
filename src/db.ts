import Dexie, { Table } from 'dexie';

export interface Note {
  id?: number;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class SecondBrainDB extends Dexie {
  notes!: Table<Note>;

  constructor() {
    super('SecondBrainDB');
    this.version(1).stores({
      notes: '++id, title, *tags, updatedAt' // Primary key and indexed props
    });
  }
}

export const db = new SecondBrainDB();
