import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

interface ClassTopic {
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

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

@Component({
  selector: 'app-class-topics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="class-topics-container">
      <div class="header-section">
        <h1>📖 Temas de Clase</h1>
        <p class="subtitle">Contenidos educativos sobre Inteligencia Artificial</p>
        <button class="add-btn" (click)="toggleAddForm()">
          <span *ngIf="!showAddForm">➕ Agregar Nuevo Tema</span>
          <span *ngIf="showAddForm">❌ Cancelar</span>
        </button>
      </div>

      <!-- Formulario para agregar nuevo tema -->
      <div *ngIf="showAddForm" class="add-form">
        <h3>Agregar Nuevo Tema de Clase</h3>
        <form (ngSubmit)="addTopic()" #topicForm="ngForm">
          <div class="form-group">
            <label for="title">Título:</label>
            <input 
              type="text" 
              id="title" 
              name="title"
              [(ngModel)]="newTopic.title" 
              required
              placeholder="Ingrese el título del tema">
          </div>
          
          <div class="form-group">
            <label for="image">URL de Imagen:</label>
            <input 
              type="url" 
              id="image" 
              name="image"
              [(ngModel)]="newTopic.image" 
              placeholder="https://ejemplo.com/imagen.jpg">
          </div>
          
          <div class="form-group">
            <label for="description">Descripción Breve:</label>
            <textarea 
              id="description" 
              name="description"
              [(ngModel)]="newTopic.description" 
              rows="3"
              required
              placeholder="Descripción breve del tema"></textarea>
          </div>
          
          <div class="form-group">
            <label for="content">Contenido Completo:</label>
            <textarea 
              id="content" 
              name="content"
              [(ngModel)]="newTopic.content" 
              rows="8"
              required
              placeholder="Contenido detallado del tema de clase"></textarea>
          </div>
          
          <div class="form-actions">
            <button type="submit" [disabled]="!topicForm.form.valid" class="save-btn">
              💾 Guardar Tema
            </button>
          </div>
        </form>
      </div>

      <!-- Filtros y búsqueda -->
      <div class="filters-section">
        <div class="search-bar">
          <div class="search-input-container">
            <input 
              type="text" 
              [(ngModel)]="searchTerm" 
              (input)="filterTopics()"
              placeholder="🔍 Buscar temas..."
              #searchInput>
            <button 
              class="voice-btn"
              [class.recording]="isRecording"
              [class.supported]="speechSupported"
              [disabled]="!speechSupported"
              (click)="toggleVoiceSearch()"
              [title]="getVoiceButtonTitle()">
              <span *ngIf="!isRecording">🎤</span>
              <span *ngIf="isRecording" class="recording-icon">🔴</span>
            </button>
          </div>
          <div *ngIf="voiceStatus" class="voice-status" [class]="voiceStatusClass">
            {{voiceStatus}}
          </div>
        </div>
        <div class="sort-options">
          <select [(ngModel)]="sortBy" (change)="sortTopics()">
            <option value="newest">Más Recientes</option>
            <option value="oldest">Más Antiguos</option>
            <option value="rating">Mejor Valorados</option>
            <option value="title">Título A-Z</option>
          </select>
        </div>
      </div>

      <!-- Lista de temas -->
      <div class="topics-grid">
        <div *ngFor="let topic of filteredTopics" class="topic-card">
          <div class="topic-image" *ngIf="topic.image">
            <img [src]="topic.image" [alt]="topic.title" (error)="onImageError($event)">
          </div>
          <div class="topic-image placeholder" *ngIf="!topic.image">
            <span class="placeholder-icon">📖</span>
          </div>
          
          <div class="topic-info">
            <h3>{{topic.title}}</h3>
            <p class="topic-description">{{topic.description}}</p>
            
            <div class="topic-meta">
              <div class="rating">
                <span class="stars">
                  <span *ngFor="let star of getStars(topic.rating)" 
                        [class]="star.class">{{star.symbol}}</span>
                </span>
                <span class="rating-text">{{topic.rating | number:'1.1-1'}} ({{topic.ratingCount}} valoraciones)</span>
              </div>
              <div class="date">
                📅 {{topic.createdDate | date:'dd/MM/yyyy'}}
              </div>
            </div>
            
            <div class="topic-actions">
              <button class="expand-btn" (click)="toggleExpand(topic)">
                <span *ngIf="!topic.expanded">📄 Ver Contenido Completo</span>
                <span *ngIf="topic.expanded">📝 Ocultar Contenido</span>
              </button>
              <button class="delete-btn" (click)="deleteTopic(topic.id)">
                🗑️ Eliminar
              </button>
            </div>
          </div>
          
          <!-- Contenido expandido -->
          <div *ngIf="topic.expanded" class="expanded-content">
            <div class="content-header">
              <h4>Contenido Detallado</h4>
            </div>
            <div class="content-body">
              <p [innerHTML]="formatContent(topic.content)"></p>
            </div>
            
            <!-- Sistema de puntuación -->
            <div class="rating-section">
              <h5>Califica este tema:</h5>
              <div class="rating-stars">
                <span *ngFor="let star of [1,2,3,4,5]; let i = index"
                      class="rating-star"
                      [class.active]="i < userRating[topic.id] || 0"
                      (click)="rateTopic(topic, i + 1)">⭐</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="filteredTopics.length === 0" class="no-results">
        <p>No se encontraron temas que coincidan con tu búsqueda.</p>
        <p *ngIf="searchTerm" class="search-suggestion">
          Intenta usar palabras clave diferentes o utiliza la búsqueda por voz 🎤
        </p>
      </div>
    </div>
  `,
  styles: [`
    .class-topics-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .header-section {
      text-align: center;
      margin-bottom: 3rem;
    }
    
    .header-section h1 {
      color: #333;
      margin-bottom: 0.5rem;
    }
    
    .subtitle {
      color: #666;
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }
    
    .add-btn {
      background: #667eea;
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.3s;
    }
    
    .add-btn:hover {
      background: #5a67d8;
    }
    
    .add-form {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      margin-bottom: 3rem;
    }
    
    .add-form h3 {
      color: #333;
      margin-bottom: 1.5rem;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #333;
    }
    
    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e2e8f0;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }
    
    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #667eea;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
    }
    
    .save-btn {
      background: #48bb78;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
    }
    
    .save-btn:disabled {
      background: #a0aec0;
      cursor: not-allowed;
    }
    
    .filters-section {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    
    .search-bar {
      flex: 1;
      min-width: 300px;
    }
    
    .search-input-container {
      position: relative;
      display: flex;
      align-items: center;
    }
    
    .search-input-container input {
      width: 100%;
      padding: 0.75rem;
      padding-right: 3.5rem;
      border: 2px solid #e2e8f0;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }
    
    .search-input-container input:focus {
      outline: none;
      border-color: #667eea;
    }
    
    .voice-btn {
      position: absolute;
      right: 0.5rem;
      background: transparent;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
      transition: all 0.3s ease;
      min-width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .voice-btn:hover {
      background: rgba(102, 126, 234, 0.1);
    }
    
    .voice-btn.recording {
      background: rgba(239, 68, 68, 0.1);
      animation: pulse 1s infinite;
    }
    
    .voice-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .voice-btn.supported {
      color: #667eea;
    }
    
    .recording-icon {
      animation: blink 0.8s infinite;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
    
    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0.3; }
    }
    
    .voice-status {
      margin-top: 0.5rem;
      padding: 0.5rem;
      border-radius: 4px;
      font-size: 0.9rem;
      text-align: center;
      transition: all 0.3s ease;
    }
    
    .voice-status.listening {
      background: rgba(59, 130, 246, 0.1);
      color: #1d4ed8;
      border: 1px solid rgba(59, 130, 246, 0.2);
    }
    
    .voice-status.success {
      background: rgba(34, 197, 94, 0.1);
      color: #15803d;
      border: 1px solid rgba(34, 197, 94, 0.2);
    }
    
    .voice-status.error {
      background: rgba(239, 68, 68, 0.1);
      color: #dc2626;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }
    
    .sort-options select {
      padding: 0.75rem;
      border: 2px solid #e2e8f0;
      border-radius: 6px;
      background: white;
      font-size: 1rem;
    }
    
    .topics-grid {
      display: grid;
      gap: 2rem;
      grid-template-columns: 1fr;
    }
    
    .topic-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      overflow: hidden;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .topic-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.15);
    }
    
    .topic-image {
      height: 200px;
      overflow: hidden;
      position: relative;
    }
    
    .topic-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .topic-image.placeholder {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .placeholder-icon {
      font-size: 3rem;
      color: white;
    }
    
    .topic-info {
      padding: 1.5rem;
    }
    
    .topic-info h3 {
      color: #333;
      margin-bottom: 1rem;
      font-size: 1.4rem;
    }
    
    .topic-description {
      color: #666;
      line-height: 1.6;
      margin-bottom: 1rem;
    }
    
    .topic-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .stars span {
      color: #ffd700;
    }
    
    .rating-text {
      color: #666;
      font-size: 0.9rem;
    }
    
    .date {
      color: #666;
      font-size: 0.9rem;
    }
    
    .topic-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .expand-btn {
      background: #667eea;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      flex: 1;
      min-width: 180px;
    }
    
    .delete-btn {
      background: #e53e3e;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
    }
    
    .expanded-content {
      border-top: 2px solid #e2e8f0;
      padding: 1.5rem;
      background: #f8fafc;
    }
    
    .content-header h4 {
      color: #333;
      margin-bottom: 1rem;
    }
    
    .content-body {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }
    
    .content-body p {
      line-height: 1.8;
      color: #444;
    }
    
    .rating-section {
      background: white;
      padding: 1rem;
      border-radius: 8px;
    }
    
    .rating-section h5 {
      margin-bottom: 0.5rem;
      color: #333;
    }
    
    .rating-stars {
      display: flex;
      gap: 0.25rem;
    }
    
    .rating-star {
      font-size: 1.5rem;
      cursor: pointer;
      opacity: 0.3;
      transition: opacity 0.2s;
    }
    
    .rating-star.active {
      opacity: 1;
    }
    
    .rating-star:hover {
      opacity: 0.8;
    }
    
    .no-results {
      text-align: center;
      padding: 3rem;
      color: #666;
      font-size: 1.1rem;
    }
    
    .search-suggestion {
      margin-top: 1rem;
      font-size: 1rem;
      color: #888;
    }
    
    @media (max-width: 768px) {
      .class-topics-container {
        padding: 1rem;
      }
      
      .filters-section {
        flex-direction: column;
      }
      
      .search-bar {
        min-width: unset;
      }
      
      .topic-actions {
        flex-direction: column;
      }
      
      .expand-btn {
        min-width: unset;
      }
    }
  `]
})
export class ClassTopicsComponent implements OnInit, OnDestroy {
  topics: ClassTopic[] = [];
  filteredTopics: ClassTopic[] = [];
  showAddForm = false;
  searchTerm = '';
  sortBy = 'newest';
  userRating: { [key: number]: number } = {};
  
  // Propiedades para búsqueda por voz
  private recognition: any;
  isRecording = false;
  speechSupported = false;
  voiceStatus = '';
  voiceStatusClass = '';
  
  newTopic: Partial<ClassTopic> = {
    title: '',
    image: '',
    description: '',
    content: ''
  };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadTopics();
    this.initSpeechRecognition();
  }

  ngOnDestroy() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  private initSpeechRecognition() {
    // Verificar soporte para Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      this.speechSupported = false;
      console.warn('Speech Recognition no es compatible con este navegador');
      return;
    }

    this.speechSupported = true;
    this.recognition = new SpeechRecognition();
    
    // Configuración del reconocimiento de voz
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'es-ES'; // Español
    
    // Eventos del reconocimiento de voz
    this.recognition.onstart = () => {
      this.isRecording = true;
      this.voiceStatus = '🎤 Escuchando... Habla ahora';
      this.voiceStatusClass = 'listening';
    };

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      this.searchTerm = transcript;
      this.voiceStatus = `✅ Escuchado: "${transcript}"`;
      this.voiceStatusClass = 'success';
      this.filterTopics();
      
      // Limpiar el status después de 3 segundos
      setTimeout(() => {
        this.voiceStatus = '';
        this.voiceStatusClass = '';
      }, 3000);
    };

    this.recognition.onerror = (event: any) => {
      let errorMessage = '';
      switch (event.error) {
        case 'no-speech':
          errorMessage = '❌ No se detectó voz. Intenta de nuevo.';
          break;
        case 'audio-capture':
          errorMessage = '❌ No se puede acceder al micrófono.';
          break;
        case 'not-allowed':
          errorMessage = '❌ Permiso de micrófono denegado.';
          break;
        case 'network':
          errorMessage = '❌ Error de conexión.';
          break;
        default:
          errorMessage = '❌ Error en el reconocimiento de voz.';
      }
      
      this.voiceStatus = errorMessage;
      this.voiceStatusClass = 'error';
      this.isRecording = false;
      
      // Limpiar el status después de 5 segundos
      setTimeout(() => {
        this.voiceStatus = '';
        this.voiceStatusClass = '';
      }, 5000);
    };

    this.recognition.onend = () => {
      this.isRecording = false;
    };
  }

  toggleVoiceSearch() {
    if (!this.speechSupported) {
      alert('Tu navegador no soporta reconocimiento de voz. Prueba con Chrome, Firefox o Edge.');
      return;
    }

    if (this.isRecording) {
      this.recognition.stop();
      this.voiceStatus = '⏹️ Búsqueda por voz detenida';
      this.voiceStatusClass = '';
      setTimeout(() => {
        this.voiceStatus = '';
      }, 2000);
    } else {
      // Limpiar búsqueda anterior
      this.searchTerm = '';
      this.filterTopics();
      
      // Iniciar reconocimiento
      try {
        this.recognition.start();
      } catch (error) {
        this.voiceStatus = '❌ Error al iniciar el reconocimiento de voz';
        this.voiceStatusClass = 'error';
        setTimeout(() => {
          this.voiceStatus = '';
          this.voiceStatusClass = '';
        }, 3000);
      }
    }
  }

  getVoiceButtonTitle(): string {
    if (!this.speechSupported) {
      return 'Reconocimiento de voz no soportado en este navegador';
    }
    return this.isRecording ? 'Detener búsqueda por voz' : 'Buscar con voz';
  }

  loadTopics() {
    this.topics = this.dataService.getClassTopics();
    this.filteredTopics = [...this.topics];
    this.sortTopics();
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.resetForm();
    }
  }

  addTopic() {
    if (this.newTopic.title && this.newTopic.description && this.newTopic.content) {
      const topic: ClassTopic = {
        id: Date.now(),
        title: this.newTopic.title,
        image: this.newTopic.image || '',
        description: this.newTopic.description,
        content: this.newTopic.content,
        rating: 0,
        ratingCount: 0,
        createdDate: new Date(),
        expanded: false
      };
      
      this.dataService.addClassTopic(topic);
      this.loadTopics();
      this.resetForm();
      this.showAddForm = false;
    }
  }

  resetForm() {
    this.newTopic = {
      title: '',
      image: '',
      description: '',
      content: ''
    };
  }

  filterTopics() {
    if (!this.searchTerm.trim()) {
      this.filteredTopics = [...this.topics];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredTopics = this.topics.filter(topic =>
        topic.title.toLowerCase().includes(term) ||
        topic.description.toLowerCase().includes(term) ||
        topic.content.toLowerCase().includes(term)
      );
    }
    this.sortTopics();
  }

  sortTopics() {
    switch (this.sortBy) {
      case 'newest':
        this.filteredTopics.sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime());
        break;
      case 'oldest':
        this.filteredTopics.sort((a, b) => a.createdDate.getTime() - b.createdDate.getTime());
        break;
      case 'rating':
        this.filteredTopics.sort((a, b) => b.rating - a.rating);
        break;
      case 'title':
        this.filteredTopics.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
  }

  toggleExpand(topic: ClassTopic) {
    topic.expanded = !topic.expanded;
  }

  deleteTopic(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este tema?')) {
      this.dataService.deleteClassTopic(id);
      this.loadTopics();
    }
  }

  rateTopic(topic: ClassTopic, rating: number) {
    this.userRating[topic.id] = rating;
    this.dataService.rateClassTopic(topic.id, rating);
    this.loadTopics();
  }

  getStars(rating: number) {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push({ symbol: '⭐', class: 'full' });
    }
    
    if (hasHalfStar) {
      stars.push({ symbol: '⭐', class: 'half' });
    }
    
    while (stars.length < 5) {
      stars.push({ symbol: '☆', class: 'empty' });
    }
    
    return stars;
  }

  formatContent(content: string): string {
    return content.replace(/\n/g, '<br>');
  }

  onImageError(event: any) {
    event.target.style.display = 'none';
    event.target.parentElement.classList.add('placeholder');
    event.target.parentElement.innerHTML = '<span class="placeholder-icon">📖</span>';
  }
}