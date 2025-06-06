import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-container">
      <div class="hero-section">
        <h1>🎓 Bienvenido al Catálogo de Inteligencia Artificial</h1>
        <p class="hero-subtitle">Explora el mundo de la IA: software, clasificaciones y más</p>
      </div>

      <div class="stats-preview">
        <div class="stat-card">
          <h3>{{stats.totalSoftware}}</h3>
          <p>Software de IA</p>
        </div>
        <div class="stat-card">
          <h3>{{stats.totalClassifications}}</h3>
          <p>Clasificaciones</p>
        </div>
        <div class="stat-card">
          <h3>{{stats.totalClassTopics}}</h3>
          <p>Temas de Clase</p>
        </div>
        <div class="stat-card">
          <h3>{{stats.totalPosts}}</h3>
          <p>Discusiones</p>
        </div>
      </div>

      <div class="recommendations">
        <h2>🌟 Recomendaciones</h2>
        <div class="recommendations-grid">
          <div class="recommendation-card">
            <h3>Software Mejor Valorado</h3>
            <div *ngFor="let software of stats.topRatedSoftware" class="recommendation-item">
              <span class="name">{{software.name}}</span>
              <span class="rating">⭐ {{software.rating | number:'1.1-1'}}</span>
            </div>
          </div>
          <div class="recommendation-card">
            <h3>Clasificaciones Populares</h3>
            <div *ngFor="let classification of stats.topRatedClassifications" class="recommendation-item">
              <span class="name">{{classification.name}}</span>
              <span class="rating">⭐ {{classification.rating | number:'1.1-1'}}</span>
            </div>
          </div>
          <div class="recommendation-card">
            <h3>Temas de Clase Destacados</h3>
            <div *ngFor="let topic of stats.topRatedClassTopics" class="recommendation-item">
              <span class="name">{{topic.title}}</span>
              <span class="rating">⭐ {{topic.rating | number:'1.1-1'}}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2>🚀 Acciones Rápidas</h2>
        <div class="actions-grid">
          <a routerLink="/catalog" class="action-card">
            <h3>📚 Explorar Catálogo</h3>
            <p>Descubre software de IA</p>
          </a>
          <a routerLink="/classifications" class="action-card">
            <h3>🔍 Ver Clasificaciones</h3>
            <p>Aprende sobre tipos de IA</p>
          </a>
          <a routerLink="/class-topics" class="action-card">
            <h3>📖 Temas de Clase</h3>
            <p>Explora contenidos educativos</p>
          </a>
          <a routerLink="/forum" class="action-card">
            <h3>💬 Unirse al Foro</h3>
            <p>Participa en discusiones</p>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    .hero-section {
      text-align: center;
      padding: 4rem 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px;
      margin-bottom: 3rem;
    }
    .hero-section h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    .hero-subtitle {
      font-size: 1.2rem;
      opacity: 0.9;
    }
    .stats-preview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }
    .stat-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .stat-card h3 {
      font-size: 2.5rem;
      color: #667eea;
      margin: 0;
    }
    .recommendations {
      margin-bottom: 3rem;
    }
    .recommendations h2 {
      color: #333;
      margin-bottom: 2rem;
    }
    .recommendations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    .recommendation-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .recommendation-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #eee;
    }
    .recommendation-item:last-child {
      border-bottom: none;
    }
    .quick-actions h2 {
      color: #333;
      margin-bottom: 2rem;
    }
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }
    .action-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      text-decoration: none;
      color: inherit;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .action-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }
    .action-card h3 {
      color: #667eea;
      margin-bottom: 0.5rem;
    }
  `]
})
export class HomeComponent implements OnInit {
  stats: any = {};

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.stats = this.dataService.getStats();
  }
}