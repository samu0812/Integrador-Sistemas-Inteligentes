import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-container">
      <h1>📊 Estadísticas y Análisis</h1>
      
      <div class="stats-overview">
        <div class="stat-card">
          <h3>{{stats.totalSoftware}}</h3>
          <p>Software Total</p>
          <div class="stat-icon">📚</div>
        </div>
        <div class="stat-card">
          <h3>{{stats.totalClassifications}}</h3>
          <p>Clasificaciones</p>
          <div class="stat-icon">🔍</div>
        </div>
        <div class="stat-card">
          <h3>{{stats.totalPosts}}</h3>
          <p>Discusiones</p>
          <div class="stat-icon">💬</div>
        </div>
        <div class="stat-card">
          <h3>{{stats.avgSoftwareRating | number:'1.1-1'}}</h3>
          <p>Rating Promedio Software</p>
          <div class="stat-icon">⭐</div>
        </div>
      </div>

      <div class="detailed-stats">
        <div class="top-rated-section">
          <h2>🏆 Software Mejor Valorado</h2>
          <div class="top-rated-list">
            <div *ngFor="let software of stats.topRatedSoftware; let i = index" 
                 class="top-item"
                 [class.first]="i === 0"
                 [class.second]="i === 1"
                 [class.third]="i === 2">
              <span class="rank">{{i + 1}}</span>
              <div class="item-info">
                <h4>{{software.name}}</h4>
                <p>{{software.category}} • {{software.author}}</p>
              </div>
              <div class="rating">
                <span class="stars">⭐ {{software.rating | number:'1.1-1'}}</span>
                <span class="votes">({{software.ratingCount}} votos)</span>
              </div>
            </div>
          </div>
        </div>

        <div class="top-rated-section">
          <h2>🎯 Clasificaciones Populares</h2>
          <div class="top-rated-list">
            <div *ngFor="let classification of stats.topRatedClassifications; let i = index" 
                 class="top-item"
                 [class.first]="i === 0"
                 [class.second]="i === 1"
                 [class.third]="i === 2">
              <span class="rank">{{i + 1}}</span>
              <div class="item-info">
                <h4>{{classification.name}}</h4>
                <p>{{classification.examples.length}} ejemplos disponibles</p>
              </div>
              <div class="rating">
                <span class="stars">⭐ {{classification.rating | number:'1.1-1'}}</span>
                <span class="votes">({{classification.ratingCount}} votos)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="recommendations-section">
        <h2>💡 Recomendaciones Personalizadas</h2>
        <div class="recommendations-grid">
          <div class="recommendation-card">
            <h3>🚀 Para Empezar</h3>
            <p>Si eres nuevo en IA, te recomendamos comenzar con:</p>
            <ul>
              <li>{{stats.topRatedClassifications[0]?.name || 'Redes Neuronales'}}</li>
              <li>{{stats.topRatedSoftware[0]?.name || 'TensorFlow'}}</li>
            </ul>
          </div>
          <div class="recommendation-card">
            <h3>📈 Tendencias</h3>
            <p>Los temas más populares actualmente:</p>
            <ul>
              <li>Procesamiento de Lenguaje Natural</li>
              <li>Generación de Imágenes</li>
              <li>Machine Learning</li>
            </ul>
          </div>
          <div class="recommendation-card">
            <h3>🎓 Recursos Educativos</h3>
            <p>Herramientas recomendadas para aprender:</p>
            <ul>
              <li>Frameworks de código abierto</li>
              <li>Tutoriales interactivos</li>
              <li>Comunidades activas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    .stats-container h1 {
      color: #333;
      margin-bottom: 2rem;
      text-align: center;
    }
    .stats-overview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }
    .stat-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .stat-card h3 {
      font-size: 2.5rem;
      color: #667eea;
      margin: 0 0 0.5rem 0;
    }
    .stat-card p {
      color: #666;
      margin: 0;
      font-weight: 500;
    }
    .stat-icon {
      position: absolute;
      top: 1rem;
      right: 1rem;
      font-size: 2rem;
      opacity: 0.1;
    }
    .detailed-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }
    .top-rated-section {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .top-rated-section h2 {
      color: #333;
      margin-bottom: 1.5rem;
    }
    .top-rated-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .top-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border-radius: 8px;
      background: #f8f9fa;
      transition: transform 0.2s;
    }
    .top-item:hover {
      transform: translateX(4px);
    }
    .top-item.first {
      background: linear-gradient(135deg, #ffd700, #ffed4e);
      color: #333;
    }
    .top-item.second {
      background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
      color: #333;
    }
    .top-item.third {
      background: linear-gradient(135deg, #cd7f32, #daa520);
      color: #333;
    }
    .rank {
      font-size: 1.5rem;
      font-weight: bold;
      width: 2rem;
      text-align: center;
    }
    .item-info {
      flex: 1;
    }
    .item-info h4 {
      margin: 0 0 0.25rem 0;
      color: inherit;
    }
    .item-info p {
      margin: 0;
      font-size: 0.9rem;
      opacity: 0.8;
    }
    .rating {
      text-align: right;
    }
    .stars {
      font-weight: bold;
    }
    .votes {
      display: block;
      font-size: 0.8rem;
      opacity: 0.7;
    }
    .recommendations-section {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .recommendations-section h2 {
      color: #333;
      margin-bottom: 1.5rem;
    }
    .recommendations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    .recommendation-card {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }
    .recommendation-card h3 {
      color: #667eea;
      margin-bottom: 1rem;
    }
    .recommendation-card p {
      color: #666;
      margin-bottom: 1rem;
      line-height: 1.5;
    }
    .recommendation-card ul {
      margin: 0;
      padding-left: 1.5rem;
    }
    .recommendation-card li {
      margin-bottom: 0.5rem;
      color: #333;
    }
  `]
})
export class StatsComponent implements OnInit {
  stats: any = {};

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.stats = this.dataService.getStats();
  }
}