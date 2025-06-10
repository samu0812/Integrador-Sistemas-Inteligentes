import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { Classification } from '../../models/ai-software.model';

@Component({
  selector: 'app-classifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="classifications-container">
      <h1>🔍 Clasificaciones de Sistemas Inteligentess</h1>
      
      <div class="classifications-grid">
        <div *ngFor="let classification of classifications" class="classification-card">
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
  `]
})
export class ClassificationsComponent implements OnInit {
  classifications: Classification[] = [];
  hoveredRating: {[key: number]: number} = {};

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.classifications$.subscribe(classifications => {
      this.classifications = classifications;
    });
  }

  rateClassification(id: number, rating: number) {
    this.dataService.rateClassification(id, rating);
  }
}
