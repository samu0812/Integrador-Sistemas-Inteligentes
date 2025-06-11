import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, from, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { 
  Firestore, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  onSnapshot,
  query,
  orderBy,
  DocumentData,
  QuerySnapshot
} from '@angular/fire/firestore';
import { AISoftware, Classification, ForumPost } from '../models/ai-software.model';

// Nueva interfaz para los temas de clase
export interface ClassTopic {
  id?: string;
  title: string;
  image: string;
  description: string;
  content: string;
  rating: number;
  ratingCount: number;
  createdDate: Date;
  expanded?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private firestore = inject(Firestore);
  
  // Collections references
  private aiSoftwareCollection = collection(this.firestore, 'aiSoftware');
  private classificationsCollection = collection(this.firestore, 'classifications');
  private forumPostsCollection = collection(this.firestore, 'forumPosts');
  private classTopicsCollection = collection(this.firestore, 'classTopics');

  // BehaviorSubjects para datos locales
  private aiSoftwareSubject = new BehaviorSubject<AISoftware[]>([]);
  private classificationsSubject = new BehaviorSubject<Classification[]>([]);
  private forumPostsSubject = new BehaviorSubject<ForumPost[]>([]);
  private classTopicsSubject = new BehaviorSubject<ClassTopic[]>([]);

  // Observables públicos
  aiSoftware$ = this.aiSoftwareSubject.asObservable();
  classifications$ = this.classificationsSubject.asObservable();
  forumPosts$ = this.forumPostsSubject.asObservable();
  classTopics$ = this.classTopicsSubject.asObservable();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Listener para AI Software
    const unsubscribeAI = onSnapshot(
      query(this.aiSoftwareCollection, orderBy('name')), 
      (snapshot) => {
        const aiSoftware = this.processSnapshot<AISoftware>(snapshot);
        this.aiSoftwareSubject.next(aiSoftware);
      }
    );

    // Listener para Classifications
    const unsubscribeClass = onSnapshot(
      query(this.classificationsCollection, orderBy('name')), 
      (snapshot) => {
        const classifications = this.processSnapshot<Classification>(snapshot);
        this.classificationsSubject.next(classifications);
      }
    );

    // Listener para Forum Posts
    const unsubscribeForum = onSnapshot(
      query(this.forumPostsCollection, orderBy('date', 'desc')), 
      (snapshot) => {
        const forumPosts = this.processSnapshot<ForumPost>(snapshot);
        this.forumPostsSubject.next(forumPosts);
      }
    );

    // Listener para Class Topics
    const unsubscribeTopics = onSnapshot(
      query(this.classTopicsCollection, orderBy('createdDate', 'desc')), 
      (snapshot) => {
        const classTopics = this.processSnapshot<ClassTopic>(snapshot);
        this.classTopicsSubject.next(classTopics);
      }
    );

    // Inicializar datos por defecto si las colecciones están vacías
    this.initializeDefaultData();
  }

  private processSnapshot<T>(snapshot: QuerySnapshot<DocumentData>): T[] {
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convertir timestamps de Firestore a Date
      ...(doc.data()['date'] && { date: doc.data()['date'].toDate() }),
      ...(doc.data()['createdDate'] && { createdDate: doc.data()['createdDate'].toDate() })
    })) as T[];
  }

  private async initializeDefaultData() {
    // Verificar si ya existen datos
    const [aiSnapshot, classSnapshot, topicsSnapshot] = await Promise.all([
      getDocs(this.aiSoftwareCollection),
      getDocs(this.classificationsCollection),
      getDocs(this.classTopicsCollection)
    ]);

    // Inicializar AI Software si está vacío
    if (aiSnapshot.empty) {
      const defaultAISoftware = [
        {
          name: 'ChatGPT',
          objective: 'Asistente conversacional de IA generativa',
          accessLink: 'https://chat.openai.com',
          license: 'Propietaria',
          releaseYear: 2022,
          author: 'OpenAI',
          rating: 4.5,
          ratingCount: 120,
          category: 'NLP',
          description: 'Modelo de lenguaje para conversación y generación de texto'
        },
        {
          name: 'TensorFlow',
          objective: 'Plataforma de aprendizaje automático',
          accessLink: 'https://tensorflow.org',
          license: 'Apache 2.0',
          releaseYear: 2015,
          author: 'Google',
          rating: 4.3,
          ratingCount: 85,
          category: 'ML Framework',
          description: 'Framework para desarrollo de modelos de machine learning'
        },
        {
          name: 'Stable Diffusion',
          objective: 'Generación de imágenes por IA',
          accessLink: 'https://stability.ai',
          license: 'Creative ML OpenRAIL-M',
          releaseYear: 2022,
          author: 'Stability AI',
          rating: 4.2,
          ratingCount: 95,
          category: 'Image Generation',
          description: 'Modelo de difusión para generar imágenes a partir de texto'
        }
      ];

      for (const software of defaultAISoftware) {
        await addDoc(this.aiSoftwareCollection, software);
      }
    }

    // Inicializar Classifications si está vacío
    if (classSnapshot.empty) {
      const defaultClassifications = [
        {
          name: 'Sistemas Expertos',
          description: 'Sistemas que emulan la capacidad de toma de decisiones de un experto humano',
          examples: ['MYCIN', 'DENDRAL', 'CLIPS'],
          imageUrl: 'https://via.placeholder.com/300x200?text=Sistemas+Expertos',
          interestLinks: ['https://en.wikipedia.org/wiki/Expert_system'],
          rating: 4.0,
          ratingCount: 45
        },
        {
          name: 'Redes Neuronales',
          description: 'Modelos computacionales inspirados en el funcionamiento del cerebro humano',
          examples: ['Perceptrón', 'CNN', 'RNN', 'Transformer'],
          imageUrl: 'https://via.placeholder.com/300x200?text=Redes+Neuronales',
          interestLinks: ['https://en.wikipedia.org/wiki/Artificial_neural_network'],
          rating: 4.7,
          ratingCount: 78
        },
        {
          name: 'Algoritmos Genéticos',
          description: 'Técnicas de optimización basadas en la evolución natural',
          examples: ['GA simple', 'NSGA-II', 'Evolución diferencial'],
          imageUrl: 'https://via.placeholder.com/300x200?text=Algoritmos+Geneticos',
          interestLinks: ['https://en.wikipedia.org/wiki/Genetic_algorithm'],
          rating: 3.8,
          ratingCount: 32
        }
      ];

      for (const classification of defaultClassifications) {
        await addDoc(this.classificationsCollection, classification);
      }
    }

    // Inicializar Class Topics si está vacío
    if (topicsSnapshot.empty) {
      const defaultClassTopics = [
        {
          title: 'Introducción a la Inteligencia Artificial',
          image: 'https://via.placeholder.com/400x200?text=Introducción+IA',
          description: 'Conceptos básicos y fundamentos de la inteligencia artificial moderna.',
          content: 'La Inteligencia Artificial (IA) es una rama de la informática que se enfoca en crear sistemas capaces de realizar tareas que típicamente requieren inteligencia humana.\n\nHistoria de la IA:\n- 1950: Alan Turing propone el Test de Turing\n- 1956: Conferencia de Dartmouth - Nacimiento oficial de la IA\n- 1980s: Sistemas expertos\n- 1990s: Machine Learning\n- 2010s: Deep Learning\n- 2020s: IA Generativa\n\nTipos de IA:\n1. IA Débil (Narrow AI): Especializada en tareas específicas\n2. IA General (AGI): Capacidad de razonamiento general\n3. Superinteligencia: Supera la inteligencia humana en todos los aspectos',
          rating: 4.5,
          ratingCount: 12,
          createdDate: new Date('2024-01-10'),
          expanded: false
        },
        {
          title: 'Machine Learning: Algoritmos Supervisados',
          image: 'https://via.placeholder.com/400x200?text=Machine+Learning',
          description: 'Exploración detallada de los algoritmos de aprendizaje supervisado más importantes.',
          content: 'El Machine Learning supervisado utiliza datos etiquetados para entrenar modelos que pueden hacer predicciones sobre nuevos datos.\n\nAlgoritmos principales:\n\n1. Regresión Linear\n- Predice valores continuos\n- Encuentra la mejor línea que se ajusta a los datos\n- Ejemplo: Predecir precios de casas\n\n2. Árboles de Decisión\n- Estructura jerárquica de decisiones\n- Fácil interpretación\n- Puede manejar datos categóricos y numéricos\n\n3. Random Forest\n- Combina múltiples árboles de decisión\n- Reduce overfitting\n- Mayor precisión que árboles individuales\n\n4. Support Vector Machines (SVM)\n- Encuentra el hiperplano óptimo para separar clases\n- Efectivo en espacios de alta dimensión\n- Utiliza el "kernel trick" para datos no lineales',
          rating: 4.3,
          ratingCount: 8,
          createdDate: new Date('2024-01-12'),
          expanded: false
        },
        {
          title: 'Redes Neuronales y Deep Learning',
          image: 'https://via.placeholder.com/400x200?text=Deep+Learning',
          description: 'Fundamentos de las redes neuronales artificiales y el aprendizaje profundo.',
          content: 'Las redes neuronales son modelos computacionales inspirados en el cerebro humano.\n\nComponentes básicos:\n\n1. Neurona Artificial\n- Recibe inputs ponderados\n- Aplica función de activación\n- Produce output\n\n2. Capas\n- Input Layer: Recibe datos\n- Hidden Layers: Procesan información\n- Output Layer: Produce resultado final\n\n3. Funciones de Activación\n- ReLU: max(0, x)\n- Sigmoid: 1/(1+e^-x)\n- Tanh: (e^x - e^-x)/(e^x + e^-x)\n\nTipos de Redes:\n- Feedforward: Información fluye en una dirección\n- Recurrentes (RNN): Tienen memoria, procesan secuencias\n- Convolucionales (CNN): Especializadas en imágenes\n- Transformers: Utilizan mecanismo de atención',
          rating: 4.7,
          ratingCount: 15,
          createdDate: new Date('2024-01-14'),
          expanded: false
        }
      ];

      for (const topic of defaultClassTopics) {
        await addDoc(this.classTopicsCollection, topic);
      }
    }
  }

  // Métodos para AI Software
  async addAISoftware(software: Omit<AISoftware, 'id'>): Promise<void> {
    await addDoc(this.aiSoftwareCollection, software);
  }

  async rateAISoftware(id: string, rating: number): Promise<void> {
    const currentSoftware = this.aiSoftwareSubject.value.find(s => s.id === id);
    if (currentSoftware) {
      const newRatingCount = currentSoftware.ratingCount + 1;
      const newRating = ((currentSoftware.rating * currentSoftware.ratingCount) + rating) / newRatingCount;
      
      const docRef = doc(this.firestore, 'aiSoftware', id);
      await updateDoc(docRef, {
        rating: newRating,
        ratingCount: newRatingCount
      });
    }
  }

  // Métodos para Classifications
  async rateClassification(id: string, rating: number): Promise<void> {
    const currentClassification = this.classificationsSubject.value.find(c => c.id === id);
    if (currentClassification) {
      const newRatingCount = currentClassification.ratingCount + 1;
      const newRating = ((currentClassification.rating * currentClassification.ratingCount) + rating) / newRatingCount;
      
      const docRef = doc(this.firestore, 'classifications', id);
      await updateDoc(docRef, {
        rating: newRating,
        ratingCount: newRatingCount
      });
    }
  }

  // Métodos para Forum Posts
  async addForumPost(post: Omit<ForumPost, 'id' | 'date' | 'replies'>): Promise<void> {
    const newPost = {
      ...post,
      date: new Date(),
      replies: []
    };
    await addDoc(this.forumPostsCollection, newPost);
  }

  // Métodos para Class Topics
  getClassTopics(): ClassTopic[] {
    return this.classTopicsSubject.value;
  }

  async addClassTopic(topic: Omit<ClassTopic, 'id' | 'createdDate' | 'rating' | 'ratingCount' | 'expanded'>): Promise<void> {
    const newTopic = {
      ...topic,
      createdDate: new Date(),
      rating: 0,
      ratingCount: 0,
      expanded: false
    };
    await addDoc(this.classTopicsCollection, newTopic);
  }

  async deleteClassTopic(id: string): Promise<void> {
    const docRef = doc(this.firestore, 'classTopics', id);
    await deleteDoc(docRef);
  }

  async rateClassTopic(id: string, rating: number): Promise<void> {
    const currentTopic = this.classTopicsSubject.value.find(t => t.id === id);
    if (currentTopic) {
      const newRatingCount = currentTopic.ratingCount + 1;
      const newRating = ((currentTopic.rating * currentTopic.ratingCount) + rating) / newRatingCount;
      
      const docRef = doc(this.firestore, 'classTopics', id);
      await updateDoc(docRef, {
        rating: newRating,
        ratingCount: newRatingCount
      });
    }
  }

  async updateClassTopic(id: string, updatedTopic: Partial<ClassTopic>): Promise<void> {
    const docRef = doc(this.firestore, 'classTopics', id);
    await updateDoc(docRef, updatedTopic);
  }

  async updateForumPost(postId: string, updates: Partial<ForumPost>): Promise<void> {
  const docRef = doc(this.firestore, 'forumPosts', postId);
  await updateDoc(docRef, updates);
}

  // Método de estadísticas
  getStats() {
    const software = this.aiSoftwareSubject.value;
    const classifications = this.classificationsSubject.value;
    const posts = this.forumPostsSubject.value;
    const topics = this.classTopicsSubject.value;

    return {
      totalSoftware: software.length,
      totalClassifications: classifications.length,
      totalPosts: posts.length,
      totalClassTopics: topics.length,
      avgSoftwareRating: software.length > 0 ? software.reduce((acc, s) => acc + s.rating, 0) / software.length : 0,
      avgClassificationRating: classifications.length > 0 ? classifications.reduce((acc, c) => acc + c.rating, 0) / classifications.length : 0,
      avgClassTopicsRating: topics.length > 0 ? topics.reduce((acc, t) => acc + t.rating, 0) / topics.length : 0,
      topRatedSoftware: software.sort((a, b) => b.rating - a.rating).slice(0, 3),
      topRatedClassifications: classifications.sort((a, b) => b.rating - a.rating).slice(0, 3),
      topRatedClassTopics: topics.sort((a, b) => b.rating - a.rating).slice(0, 3)
    };
  }
}