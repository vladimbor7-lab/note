export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  isFavorite?: boolean;
}

export type NoteInput = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;
