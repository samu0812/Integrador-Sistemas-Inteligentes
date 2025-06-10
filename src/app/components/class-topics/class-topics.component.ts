import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
          <!-- Reemplaza tu input actual con este bloque -->
      <div class="search-container">
        <div class="search-input-group">
          <input
            type="text"
            [(ngModel)]="filtro"
            placeholder="🔍 Buscar por nombre, autor, categoría o descripción..."
            class="search-input"
          />
          <button 
            (click)="toggleVoiceSearch()" 
            [class.recording]="isRecording"
            class="voice-btn"
            [disabled]="!speechSupported"
            title="{{speechSupported ? 'Buscar por voz' : 'Búsqueda por voz no soportada'}}">
            {{isRecording ? '🛑' : '🎤'}}
          </button>
        </div>
        
        <div *ngIf="isRecording" class="recording-indicator">
          <span class="pulse">🔴</span> Escuchando... Di lo que quieres buscar
        </div>
        
        <div *ngIf="voiceError" class="voice-error">
          ⚠️ {{voiceError}}
        </div>
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
    
    .search-bar input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e2e8f0;
      border-radius: 6px;
      font-size: 1rem;
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
    /*estilos de busqueda por vos */
    .search-container {
      margin-bottom: 1rem;
    }

    .search-input-group {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .search-input {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 1rem;
    }

    .voice-btn {
      padding: 0.75rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1.2rem;
      min-width: 50px;
      transition: all 0.3s;
    }

    .voice-btn:hover:not(:disabled) {
      background: #5a6fd8;
      transform: scale(1.05);
    }

    .voice-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .voice-btn.recording {
      background: #dc3545;
      animation: pulse 1s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }

    .recording-indicator {
      margin-top: 0.5rem;
      padding: 0.5rem;
      background: #d4edda;
      border: 1px solid #c3e6cb;
      border-radius: 4px;
      color: #155724;
      font-size: 0.9rem;
    }

    .pulse {
      animation: pulse 1s infinite;
    }

    .voice-error {
      margin-top: 0.5rem;
      padding: 0.5rem;
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      color: #721c24;
      font-size: 0.9rem;
    }
  `]
})
export class ClassTopicsComponent implements OnInit {
  topics: ClassTopic[] = [];
  // filteredTopics: ClassTopic[] = [];
  showAddForm = false;
  searchTerm = '';
  sortBy = 'newest';
  userRating: { [key: number]: number } = {};

  newTopic: Partial<ClassTopic> = {
    title: '',
    image: '',
    description: '',
    content: ''
  };

    // Propiedades para búsqueda por voz
  filtro: string = '';
  isRecording = false;
  speechSupported = false;
  voiceError = '';
  private recognition: any;
  private isManualStop = false;

  constructor(
    private dataService: DataService,
    private cdr: ChangeDetectorRef

  ) {

    this.checkSpeechSupport();
  }


  ngOnInit() {
    this.loadTopics();
  }

  // ✅ AGREGAR ESTE GETTER - Para que funcione el filtrado por voz
  get filteredTopics(): ClassTopic[] {
    let result = [...this.topics];
    
    // Filtrar por texto de búsqueda por voz O por searchTerm
    const searchText = this.filtro || this.searchTerm;
    if (searchText && searchText.trim()) {
      const term = searchText.toLowerCase();
      result = result.filter(topic =>
        topic.title.toLowerCase().includes(term) ||
        topic.description.toLowerCase().includes(term) ||
        topic.content.toLowerCase().includes(term)
      );
    }

    // Aplicar ordenamiento
    switch (this.sortBy) {
      case 'newest':
        result.sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime());
        break;
      case 'oldest':
        result.sort((a, b) => a.createdDate.getTime() - b.createdDate.getTime());
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    
    return result;
  }

  // MÉTODOS DE BÚSQUEDA POR VOZ
  private checkSpeechSupport() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.speechSupported = !!SpeechRecognition;
    
    if (this.speechSupported) {
      this.initializeSpeechRecognition();
    }
  }

  private initializeSpeechRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    this.recognition.lang = 'es-ES';
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      console.log('Texto reconocido:', result);
      this.filtro = result;
      this.cdr.detectChanges();
    };

    this.recognition.onend = () => {
      console.log('Reconocimiento terminado. Manual stop:', this.isManualStop);
      this.isRecording = false;
      this.isManualStop = false;
      this.cdr.detectChanges();
    };

    this.recognition.onerror = (event: any) => {
      console.error('Error de reconocimiento:', event.error);
      this.handleVoiceError(event.error);
      this.isRecording = false;
      this.isManualStop = false;
      this.cdr.detectChanges();
    };

    this.recognition.onnomatch = () => {
      this.voiceError = 'No se pudo entender lo que dijiste. Inténtalo de nuevo.';
      this.isRecording = false;
      this.isManualStop = false;
      this.cdr.detectChanges();
    };
  }

    toggleVoiceSearch() {
        console.log('Toggle clicked. Current state:', this.isRecording);
        
        if (!this.speechSupported) {
          this.voiceError = 'Tu navegador no soporta búsqueda por voz.';
          return;
        }

        if (this.isRecording) {
          this.stopRecording();
        } else {
          this.startRecording();
        }
      }

    private startRecording() {
    if (this.isRecording) {
      console.log('Ya está grabando, ignorando...');
      return;
    }
    
    this.isRecording = true;
    this.voiceError = '';
    this.isManualStop = false;
    this.cdr.detectChanges();
    
    try {
      this.recognition.start();
      console.log('✅ Iniciando reconocimiento de voz...');
    } catch (error) {
      console.error('❌ Error al iniciar reconocimiento:', error);
      this.voiceError = 'Error al iniciar la grabación.';
      this.isRecording = false;
      this.cdr.detectChanges();
    }
  }

  private stopRecording() {
    if (!this.isRecording) {
      console.log('No está grabando, ignorando stop...');
      return;
    }
    
    console.log('🛑 Stop manual solicitado');
    this.isManualStop = true;
    
    try {
      this.recognition.stop();
    } catch (error) {
      console.error('❌ Error al detener reconocimiento:', error);
      this.isRecording = false;
      this.isManualStop = false;
    }
  }

  private handleVoiceError(error: string) {
    switch (error) {
      case 'no-speech':
        this.voiceError = 'No se detectó ningún sonido. Inténtalo de nuevo.';
        break;
      case 'audio-capture':
        this.voiceError = 'No se pudo acceder al micrófono.';
        break;
      case 'not-allowed':
        this.voiceError = 'Permiso para usar micrófono denegado.';
        break;
      case 'network':
        this.voiceError = 'Error de red. Verifica tu conexión.';
        break;
      default:
        this.voiceError = 'Error de reconocimiento. Inténtalo de nuevo.';
    }
  }

  // ✅ ACTUALIZAR EL MÉTODO loadTopics - Remover la asignación a filteredTopics
  loadTopics() {
    this.topics = this.dataService.getClassTopics();
    // ❌ QUITAR ESTA LÍNEA: this.filteredTopics = [...this.topics];
    // ❌ QUITAR ESTA LÍNEA: this.sortTopics();
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

  // ✅ ACTUALIZAR EL MÉTODO filterTopics - Simplificar
  filterTopics() {
    // El filtrado ahora se hace en el getter, solo necesitamos limpiar filtro por voz
    if (this.searchTerm) {
      this.filtro = ''; // Limpiar búsqueda por voz si se usa búsqueda manual
    }
  }

  // ✅ ACTUALIZAR EL MÉTODO sortTopics - Ya no necesario, se hace en getter
  sortTopics() {
    // Este método ahora se ejecuta automáticamente en el getter
  }

    // ✅ AGREGAR MÉTODO ngOnDestroy
  ngOnDestroy() {
    if (this.recognition && this.isRecording) {
      this.recognition.stop();
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