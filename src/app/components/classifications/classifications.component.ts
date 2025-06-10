import { Component, OnInit , OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { Classification } from '../../models/ai-software.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-classifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="classifications-container">
      <h1>🔍 Clasificaciones de Sistemas Inteligentess</h1>
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
      
      <div class="classifications-grid">
        <div *ngFor="let classification of classificationsFiltradas" class="classification-card">
          <div class="card-image">
            <img [src]="classification.imageUrl" [alt]="classification.name">
          </div>
          <div class="card-content">
            <h3>{{classification.name}}</h3>
            <p class="description">{{classification.description}}</p>
            
            <div class="examples-section">
              <h4>Ejemplos:</h4>
              <ul class="examples-list">
                <li *ngFor="let example of classification.examples">{{example}}</li>
              </ul>
            </div>
            <div class="links-section">
              <h4>Enlaces de Interés:</h4>
              <div class="links-list">
                <a *ngFor="let link of classification.interestLinks" 
                   [href]="link" 
                   target="_blank" 
                   class="interest-link">
                  🔗 Ver más
                </a>
              </div>
            </div>
          </div>
          
          <div class="card-footer">
            <div class="rating-display">
              <span class="stars">⭐ {{classification.rating | number:'1.1-1'}}</span>
              <span class="rating-count">({{classification.ratingCount}} votos)</span>
            </div>
            <div class="rating-actions">
              <button *ngFor="let star of [1,2,3,4,5]" 
                      (click)="rateClassification(classification.id, star)"
                      class="star-btn"
                      [class.active]="star <= hoveredRating[classification.id]"
                      (mouseenter)="hoveredRating[classification.id] = star"
                      (mouseleave)="hoveredRating[classification.id] = 0">
                ⭐
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .classifications-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    .classifications-container h1 {
      color: #333;
      margin-bottom: 2rem;
      text-align: center;
    }
    .classifications-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
    }
    .classification-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
      transition: transform 0.3s;
    }
    .classification-card:hover {
      transform: translateY(-4px);
    }
    .card-image {
      height: 200px;
      overflow: hidden;
    }
    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .card-content {
      padding: 1.5rem;
    }
    .card-content h3 {
      color: #667eea;
      margin-bottom: 1rem;
    }
    .description {
      color: #666;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
    .examples-section, .links-section {
      margin-bottom: 1.5rem;
    }
    .examples-section h4, .links-section h4 {
      color: #333;
      margin-bottom: 0.75rem;
      font-size: 1rem;
    }
    .examples-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .examples-list li {
      background: #f8f9fa;
      padding: 0.5rem 1rem;
      margin-bottom: 0.5rem;
      border-radius: 4px;
      border-left: 3px solid #667eea;
    }
    .links-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .interest-link {
      background: #667eea;
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-size: 0.9rem;
      transition: background-color 0.3s;
    }
    .interest-link:hover {
      background: #5a6fd8;
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
    .star-btn:hover, .star-btn.active {
      opacity: 1;
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
export class ClassificationsComponent implements OnInit {
  classifications: Classification[] = [];
  hoveredRating: {[key: number]: number} = {};
  filtro: string = '';
  
  // Propiedades para búsqueda por voz
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
    this.dataService.classifications$.subscribe(classifications => {
      this.classifications = classifications;
    });
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

  rateClassification(id: number, rating: number) {
    this.dataService.rateClassification(id, rating);
  }

get classificationsFiltradas(): Classification[] {
  const texto = this.filtro.toLowerCase();
  return this.classifications.filter(clasif =>
    clasif.name.toLowerCase().includes(texto) ||
    clasif.description.toLowerCase().includes(texto) ||
    clasif.examples.some(ej => ej.toLowerCase().includes(texto)) ||
    clasif.interestLinks.some(link => link.toLowerCase().includes(texto))
  );
}

}
