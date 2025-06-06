export interface AISoftware {
    id: number;
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
    id: number;
    name: string;
    description: string;
    examples: string[];
    imageUrl: string;
    interestLinks: string[];
    rating: number;
    ratingCount: number;
  }
  
  export interface ForumPost {
    id: number;
    title: string;
    content: string;
    author: string;
    date: Date;
    replies: ForumReply[];
  }
  
  export interface ForumReply {
    id: number;
    content: string;
    author: string;
    date: Date;
  }
  