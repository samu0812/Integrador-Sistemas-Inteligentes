import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { AISoftware } from '../../models/ai-software.model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="catalog-container">
      <div class="catalog-header">
        <h1>📚 Catálogo de Software de IA</h1>
        <button (click)="showAddForm = !showAddForm" class="add-btn">
          + Agregar Software
        </button>
      </div>

      <div *ngIf="showAddForm" class="add-form">
        <h3>Agregar Nuevo Software</h3>
        <form (ngSubmit)="addSoftware()" #form="ngForm">
          <div class="form-row">
            <input [(ngModel)]="newSoftware.name" name="name" placeholder="Nombre" required>
            <input [(ngModel)]="newSoftware.author" name="author" placeholder="Autor" required>
          </div>
          <div class="form-row">
            <input [(ngModel)]="newSoftware.accessLink" name="accessLink" placeholder="Enlace de acceso" required>
            <input [(ngModel)]="newSoftware.license" name="license" placeholder="Licencia" required>
          </div>
          <div class="form-row">
            <input [(ngModel)]="newSoftware.releaseYear" name="releaseYear" type="number" placeholder="Año" required>
            <input [(ngModel)]="newSoftware.category" name="category" placeholder="Categoría" required>
          </div>
          <textarea [(ngModel)]="newSoftware.objective" name="objective" placeholder="Objetivo" required></textarea>
          <textarea [(ngModel)]="newSoftware.description" name="description" placeholder="Descripción" required></textarea>
          <div class="form-actions">
            <button type="submit" [disabled]="!form.valid || isSubmitting">
              {{isSubmitting ? 'Agregando...' : 'Agregar'}}
            </button>
            <button type="button" (click)="cancelAdd()" [disabled]="isSubmitting">Cancelar</button>
          </div>
          <div *ngIf="submitError" class="error-message">
            ⚠️ {{submitError}}
          </div>
        </form>
      </div>

      <!-- Búsqueda con voz -->
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

      <!-- Loading indicator -->
      <div *ngIf="loading" class="loading-indicator">
        <div class="spinner"></div>
        <p>Cargando software...</p>
      </div>

      <!-- Software grid -->
      <div *ngIf="!loading" class="software-grid">
        <div *ngFor="let software of softwareFiltrado; trackBy: trackBySoftware" class="software-card">
          <div class="card-header">
            <h3>{{software.name}}</h3>
            <span class="category-badge">{{software.category}}</span>
          </div>
          <div class="card-content">
            <p class="objective">{{software.objective}}</p>
            <p class="description">{{software.description}}</p>
            <div class="software-details">
              <div class="detail">
                <strong>Autor:</strong> {{software.author}}
              </div>
              <div class="detail">
                <strong>Año:</strong> {{software.releaseYear}}
              </div>
              <div class="detail">
                <strong>Licencia:</strong> {{software.license}}
              </div>
            </div>
            <a [href]="software.accessLink" target="_blank" class="access-link">
              🔗 Acceder
            </a>
          </div>
          <div class="card-footer">
            <div class="rating-display">
              <span class="stars">⭐ {{software.rating | number:'1.1-1'}}</span>
              <span class="rating-count">({{software.ratingCount}} votos)</span>
            </div>
            <div class="rating-actions">
              <button *ngFor="let star of [1,2,3,4,5]" 
                      (click)="rateSoftware(software.id!, star)"
                      class="star-btn"
                      [class.active]="star <= (hoveredRating[software.id!] || 0)"
                      [disabled]="ratingInProgress[software.id!]"
                      (mouseenter)="hoveredRating[software.id!] = star"
                      (mouseleave)="hoveredRating[software.id!] = 0">
                ⭐
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div *ngIf="!loading && softwareFiltrado.length === 0" class="empty-state">
        <p>No se encontró software que coincida con tu búsqueda.</p>
      </div>
    </div>
  `,
  styles: [`
    .catalog-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    .catalog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .add-btn {
      background: #667eea;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
    }
    .add-form {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .add-form input, .add-form textarea {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    .add-form textarea {
      grid-column: 1 / -1;
      min-height: 100px;
      resize: vertical;
    }
    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }
    .form-actions button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .form-actions button[type="submit"] {
      background: #28a745;
      color: white;
    }
    .form-actions button[type="submit"]:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }
    .form-actions button[type="button"] {
      background: #6c757d;
      color: white;
    }
    .error-message {
      margin-top: 1rem;
      padding: 0.75rem;
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      color: #721c24;
    }
    .loading-indicator {
      text-align: center;
      padding: 2rem;
    }
    .spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .empty-state {
      text-align: center;
      padding: 2rem;
      color: #666;
    }
    .software-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 2rem;
    }
    .software-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
      transition: transform 0.3s;
    }
    .software-card:hover {
      transform: translateY(-4px);
    }
    .card-header {
      padding: 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .category-badge {
      background: rgba(255,255,255,0.2);
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.8rem;
    }
    .card-content {
      padding: 1.5rem;
    }
    .objective {
      font-weight: 600;
      color: #333;
      margin-bottom: 1rem;
    }
    .description {
      color: #666;
      margin-bottom: 1rem;
      line-height: 1.5;
    }
    .software-details {
      margin-bottom: 1rem;
    }
    .detail {
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }
    .access-link {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 0.5rem 1rem;
      text-decoration: none;
      border-radius: 4px;
      font-size: 0.9rem;
    }
    .card-footer {
      padding: 1rem 1.5rem;
      background: #f8f9fa;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .rating-display {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .rating-count {
      font-size: 0.8rem;
      color: #666;
    }
    .rating-actions {
      display: flex;
      gap: 0.25rem;
    }
    .star-btn {
      background: none;
      border: none;
      font-size: 1rem;
      cursor: pointer;
      opacity: 0.3;
      transition: opacity 0.2s;
    }
    .star-btn:hover:not(:disabled), .star-btn.active {
      opacity: 1;
    }
    .star-btn:disabled {
      cursor: not-allowed;
    }
    
    /* Estilos de búsqueda por voz */
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
export class CatalogComponent implements OnInit, OnDestroy {
  aiSoftware: AISoftware[] = [];
  showAddForm = false;
  loading = true;
  isSubmitting = false;
  submitError = '';
  
  // Estados para rating
  hoveredRating: {[key: string]: number} = {};
  ratingInProgress: {[key: string]: boolean} = {};
  
  // Propiedades para búsqueda por voz
  isRecording = false;
  speechSupported = false;
  voiceError = '';
  private recognition: any;
  private isManualStop = false;
  
  newSoftware: Partial<AISoftware> = {
    name: '',
    objective: '',
    accessLink: '',
    license: '',
    releaseYear: new Date().getFullYear(),
    author: '',
    category: '',
    description: '',
    rating: 0,
    ratingCount: 0
  };

  filtro: string = '';

  constructor(
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {
    this.checkSpeechSupport();
  }

  ngOnInit() {
    this.dataService.aiSoftware$.subscribe({
      next: (software) => {
        this.aiSoftware = software;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading software:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy() {
    if (this.recognition && this.isRecording) {
      this.recognition.stop();
    }
  }

  // Método para trackBy en *ngFor para mejor performance
  trackBySoftware(index: number, software: AISoftware): string {
    return software.id || index.toString();
  }

  // Método mejorado para agregar software con manejo de errores
  async addSoftware() {
    if (!this.newSoftware.name || !this.newSoftware.objective) {
      this.submitError = 'Nombre y objetivo son campos obligatorios.';
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    try {
      await this.dataService.addAISoftware(this.newSoftware as Omit<AISoftware, 'id'>);
      this.cancelAdd();
    } catch (error) {
      console.error('Error adding software:', error);
      this.submitError = 'Error al agregar el software. Inténtalo de nuevo.';
    } finally {
      this.isSubmitting = false;
      this.cdr.detectChanges();
    }
  }

  cancelAdd() {
    this.showAddForm = false;
    this.submitError = '';
    this.newSoftware = {
      name: '',
      objective: '',
      accessLink: '',
      license: '',
      releaseYear: new Date().getFullYear(),
      author: '',
      category: '',
      description: '',
      rating: 0,
      ratingCount: 0
    };
  }

  // Método mejorado para rating con manejo de errores
  async rateSoftware(id: string, rating: number) {
    if (this.ratingInProgress[id]) {
      return; // Evitar múltiples requests simultáneos
    }

    this.ratingInProgress[id] = true;

    try {
      await this.dataService.rateAISoftware(id, rating);
    } catch (error) {
      console.error('Error rating software:', error);
      // Podrías mostrar un mensaje de error aquí
    } finally {
      this.ratingInProgress[id] = false;
      this.cdr.detectChanges();
    }
  }

  get softwareFiltrado(): AISoftware[] {
    if (!this.filtro.trim()) {
      return this.aiSoftware;
    }

    const texto = this.filtro.toLowerCase();
    return this.aiSoftware.filter(s =>
      s.name.toLowerCase().includes(texto) ||
      s.author.toLowerCase().includes(texto) ||
      s.category.toLowerCase().includes(texto) ||
      s.description.toLowerCase().includes(texto) ||
      s.objective.toLowerCase().includes(texto)
    );
  }

  // Métodos para búsqueda por voz (sin cambios porque no dependían de IDs)
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
}