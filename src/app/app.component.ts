import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <h1 class="nav-title">🤖 Catálogo de IA</h1>
        <ul class="nav-menu">
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Inicio</a></li>
          <li><a routerLink="/catalog" routerLinkActive="active">Catálogo</a></li>
          <li><a routerLink="/classifications" routerLinkActive="active">Clasificaciones</a></li>
          <li><a routerLink="/class-topics" routerLinkActive="active">Temas de Clase</a></li>
          <li><a routerLink="/forum" routerLinkActive="active">Foro</a></li>
          <li><a routerLink="/stats" routerLinkActive="active">Estadísticas</a></li>
        </ul>
      </div>
    </nav>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 2rem;
    }
    .nav-title {
      color: white;
      margin: 0;
      font-size: 1.5rem;
    }
    .nav-menu {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 2rem;
    }
    .nav-menu a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.3s;
    }
    .nav-menu a:hover, .nav-menu a.active {
      background-color: rgba(255,255,255,0.2);
    }
    .main-content {
      min-height: calc(100vh - 80px);
      background: #f8f9fa;
    }
  `]
})
export class AppComponent {}