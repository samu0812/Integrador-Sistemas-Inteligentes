import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AISoftware, Classification, ForumPost } from '../models/ai-software.model';

// Nueva interfaz para los temas de clase
export interface ClassTopic {
  id: number;
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
  private aiSoftwareSubject = new BehaviorSubject<AISoftware[]>([
    {
      id: 1,
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
      id: 2,
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
      id: 3,
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
  ]);

  private classificationsSubject = new BehaviorSubject<Classification[]>([
    {
      id: 1,
      name: 'Sistemas Expertos',
      description: 'Sistemas que emulan la capacidad de toma de decisiones de un experto humano',
      examples: ['MYCIN', 'DENDRAL', 'CLIPS'],
      imageUrl: 'https://via.placeholder.com/300x200?text=Sistemas+Expertos',
      interestLinks: ['https://en.wikipedia.org/wiki/Expert_system'],
      rating: 4.0,
      ratingCount: 45
    },
    {
      id: 2,
      name: 'Redes Neuronales',
      description: 'Modelos computacionales inspirados en el funcionamiento del cerebro humano',
      examples: ['Perceptrón', 'CNN', 'RNN', 'Transformer'],
      imageUrl: 'https://via.placeholder.com/300x200?text=Redes+Neuronales',
      interestLinks: ['https://en.wikipedia.org/wiki/Artificial_neural_network'],
      rating: 4.7,
      ratingCount: 78
    },
    {
      id: 3,
      name: 'Algoritmos Genéticos',
      description: 'Técnicas de optimización basadas en la evolución natural',
      examples: ['GA simple', 'NSGA-II', 'Evolución diferencial'],
      imageUrl: 'https://via.placeholder.com/300x200?text=Algoritmos+Geneticos',
      interestLinks: ['https://en.wikipedia.org/wiki/Genetic_algorithm'],
      rating: 3.8,
      ratingCount: 32
    }
  ]);

  private forumPostsSubject = new BehaviorSubject<ForumPost[]>([
    {
      id: 1,
      title: '¿Cuál es el futuro de la IA generativa?',
      content: 'Me gustaría conocer sus opiniones sobre hacia dónde se dirige la IA generativa...',
      author: 'Usuario1',
      date: new Date('2024-01-15'),
      replies: [
        {
          id: 1,
          content: 'Creo que veremos grandes avances en multimodalidad...',
          author: 'Usuario2',
          date: new Date('2024-01-16')
        }
      ]
    },
    {
      id: 2,
      title: 'Comparación entre TensorFlow y PyTorch',
      content: '¿Qué framework recomiendan para empezar en ML?',
      author: 'Estudiante',
      date: new Date('2024-01-10'),
      replies: []
    }
  ]);

  // Nuevo BehaviorSubject para los temas de clase
  private classTopicsSubject = new BehaviorSubject<ClassTopic[]>([
    {
      id: 1,
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
      id: 2,
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
      id: 3,
      title: 'Redes Neuronales y Deep Learning',
      image: 'https://via.placeholder.com/400x200?text=Deep+Learning',
      description: 'Fundamentos de las redes neuronales artificiales y el aprendizaje profundo.',
      content: 'Las redes neuronales son modelos computacionales inspirados en el cerebro humano.\n\nComponentes básicos:\n\n1. Neurona Artificial\n- Recibe inputs ponderados\n- Aplica función de activación\n- Produce output\n\n2. Capas\n- Input Layer: Recibe datos\n- Hidden Layers: Procesan información\n- Output Layer: Produce resultado final\n\n3. Funciones de Activación\n- ReLU: max(0, x)\n- Sigmoid: 1/(1+e^-x)\n- Tanh: (e^x - e^-x)/(e^x + e^-x)\n\nTipos de Redes:\n- Feedforward: Información fluye en una dirección\n- Recurrentes (RNN): Tienen memoria, procesan secuencias\n- Convolucionales (CNN): Especializadas en imágenes\n- Transformers: Utilizan mecanismo de atención',
      rating: 4.7,
      ratingCount: 15,
      createdDate: new Date('2024-01-14'),
      expanded: false
    }
  ]);

  // Observables existentes
  aiSoftware$ = this.aiSoftwareSubject.asObservable();
  classifications$ = this.classificationsSubject.asObservable();
  forumPosts$ = this.forumPostsSubject.asObservable();
  
  // Nuevo observable para temas de clase
  classTopics$ = this.classTopicsSubject.asObservable();

  // Métodos existentes para AI Software
  addAISoftware(software: AISoftware) {
    const current = this.aiSoftwareSubject.value;
    software.id = Math.max(...current.map(s => s.id)) + 1;
    this.aiSoftwareSubject.next([...current, software]);
  }

  rateAISoftware(id: number, rating: number) {
    const current = this.aiSoftwareSubject.value;
    const updated = current.map(software => {
      if (software.id === id) {
        const newRatingCount = software.ratingCount + 1;
        const newRating = ((software.rating * software.ratingCount) + rating) / newRatingCount;
        return { ...software, rating: newRating, ratingCount: newRatingCount };
      }
      return software;
    });
    this.aiSoftwareSubject.next(updated);
  }

  // Métodos existentes para Classifications
  rateClassification(id: number, rating: number) {
    const current = this.classificationsSubject.value;
    const updated = current.map(classification => {
      if (classification.id === id) {
        const newRatingCount = classification.ratingCount + 1;
        const newRating = ((classification.rating * classification.ratingCount) + rating) / newRatingCount;
        return { ...classification, rating: newRating, ratingCount: newRatingCount };
      }
      return classification;
    });
    this.classificationsSubject.next(updated);
  }

  // Métodos existentes para Forum Posts
  addForumPost(post: Omit<ForumPost, 'id' | 'date' | 'replies'>) {
    const current = this.forumPostsSubject.value;
    const newPost: ForumPost = {
      ...post,
      id: Math.max(...current.map(p => p.id)) + 1,
      date: new Date(),
      replies: []
    };
    this.forumPostsSubject.next([newPost, ...current]);
  }

  // Nuevos métodos para Class Topics
  getClassTopics(): ClassTopic[] {
    return this.classTopicsSubject.value;
  }

  addClassTopic(topic: ClassTopic) {
    const current = this.classTopicsSubject.value;
    const newTopic: ClassTopic = {
      ...topic,
      id: Math.max(...current.map(t => t.id), 0) + 1,
      createdDate: new Date(),
      rating: 0,
      ratingCount: 0,
      expanded: false
    };
    this.classTopicsSubject.next([...current, newTopic]);
  }

  deleteClassTopic(id: number) {
    const current = this.classTopicsSubject.value;
    const updated = current.filter(topic => topic.id !== id);
    this.classTopicsSubject.next(updated);
  }

  rateClassTopic(id: number, rating: number) {
    const current = this.classTopicsSubject.value;
    const updated = current.map(topic => {
      if (topic.id === id) {
        const newRatingCount = topic.ratingCount + 1;
        const newRating = ((topic.rating * topic.ratingCount) + rating) / newRatingCount;
        return { ...topic, rating: newRating, ratingCount: newRatingCount };
      }
      return topic;
    });
    this.classTopicsSubject.next(updated);
  }

  updateClassTopic(id: number, updatedTopic: Partial<ClassTopic>) {
    const current = this.classTopicsSubject.value;
    const updated = current.map(topic => {
      if (topic.id === id) {
        return { ...topic, ...updatedTopic };
      }
      return topic;
    });
    this.classTopicsSubject.next(updated);
  }

  // Método existente de estadísticas actualizado
  getStats() {
    const software = this.aiSoftwareSubject.value;
    const classifications = this.classificationsSubject.value;
    const posts = this.forumPostsSubject.value;
    const topics = this.classTopicsSubject.value; // Nueva línea

    return {
      totalSoftware: software.length,
      totalClassifications: classifications.length,
      totalPosts: posts.length,
      totalClassTopics: topics.length, // Nueva estadística con nombre consistente
      avgSoftwareRating: software.reduce((acc, s) => acc + s.rating, 0) / software.length,
      avgClassificationRating: classifications.reduce((acc, c) => acc + c.rating, 0) / classifications.length,
      avgClassTopicsRating: topics.length > 0 ? topics.reduce((acc, t) => acc + t.rating, 0) / topics.length : 0, // Nueva estadística
      topRatedSoftware: software.sort((a, b) => b.rating - a.rating).slice(0, 3),
      topRatedClassifications: classifications.sort((a, b) => b.rating - a.rating).slice(0, 3),
      topRatedClassTopics: topics.sort((a, b) => b.rating - a.rating).slice(0, 3) // Nueva estadística
    };
  }
}