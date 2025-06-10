import { Component, OnInit } from '@angular/core';
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
            <button type="submit" [disabled]="!form.valid">Agregar</button>
            <button type="button" (click)="cancelAdd()">Cancelar</button>
          </div>
        </form>
      </div>
      <input
        type="text"
        [(ngModel)]="filtro"
        placeholder="🔍 Buscar por nombre, autor, categoría o descripción..."
        class="form-control mb-3"
        style="width: 100%; padding: 0.75rem; margin-bottom: 1rem; border: 1px solid #ccc; border-radius: 6px;"
      />

      <div class="software-grid">
        <div *ngFor="let software of softwareFiltrado" class="software-card">
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
                      (click)="rateSoftware(software.id, star)"
                      class="star-btn"
                      [class.active]="star <= hoveredRating[software.id]"
                      (mouseenter)="hoveredRating[software.id] = star"
                      (mouseleave)="hoveredRating[software.id] = 0">
                ⭐
              </button>
            </div>
          </div>
        </div>
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
    .form-actions button[type="button"] {
      background: #6c757d;
      color: white;
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
    .star-btn:hover, .star-btn.active {
      opacity: 1;
    }
  `]
})
export class CatalogComponent implements OnInit {
  aiSoftware: AISoftware[] = [];
  showAddForm = false;
  hoveredRating: {[key: number]: number} = {};
  
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

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.aiSoftware$.subscribe(software => {
      this.aiSoftware = software;
    });
  }

  addSoftware() {
    if (this.newSoftware.name && this.newSoftware.objective) {
      this.dataService.addAISoftware(this.newSoftware as AISoftware);
      this.cancelAdd();
    }
  }

  cancelAdd() {
    this.showAddForm = false;
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

  rateSoftware(id: number, rating: number) {
    this.dataService.rateAISoftware(id, rating);
  }

  filtro: string = '';

get softwareFiltrado(): AISoftware[] {
  const texto = this.filtro.toLowerCase();
  return this.aiSoftware.filter(s =>
    s.name.toLowerCase().includes(texto) ||
    s.author.toLowerCase().includes(texto) ||
    s.category.toLowerCase().includes(texto) ||
    s.description.toLowerCase().includes(texto) ||
    s.objective.toLowerCase().includes(texto)
  );
}

}