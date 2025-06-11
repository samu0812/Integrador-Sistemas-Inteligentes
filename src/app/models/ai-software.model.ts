// src/app/models/ai-software.model.ts

export interface AISoftware {
  id?: string; // Cambiado de number a string para Firebase
  name: string;
  objective: string;
  accessLink: string;
  license: string;
  releaseYear: number;
  author: string;
  rating: number;
  ratingCount: number;
  category: string;
  description: string;
}

export interface Classification {
  id?: string; // Cambiado de number a string para Firebase
  name: string;
  description: string;
  examples: string[];
  imageUrl: string;
  interestLinks: string[];
  rating: number;
  ratingCount: number;
}

export interface ForumPost {
  id?: string; // Cambiado de number a string para Firebase
  title: string;
  content: string;
  author: string;
  date: Date;
  replies: ForumReply[];
}

export interface ForumReply {
  id?: string; // Cambiado de number a string para Firebase
  content: string;
  author: string;
  date: Date;
}