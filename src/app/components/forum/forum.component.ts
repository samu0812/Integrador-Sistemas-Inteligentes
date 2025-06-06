import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { ForumPost } from '../../models/ai-software.model';

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="forum-container">
      <div class="forum-header">
        <h1>💬 Foro de Debates</h1>
        <button (click)="showNewPostForm = !showNewPostForm" class="new-post-btn">
          + Nueva Discusión
        </button>
      </div>

      <!-- Formulario para nuevo post -->
      <div *ngIf="showNewPostForm" class="new-post-form">
        <h3>Crear Nueva Discusión</h3>
        <form (ngSubmit)="createPost()" #form="ngForm">
          <input [(ngModel)]="newPost.title" 
                 name="title" 
                 placeholder="Título de la discusión" 
                 required>
          <input [(ngModel)]="newPost.author" 
                 name="author" 
                 placeholder="Tu nombre" 
                 required>
          <textarea [(ngModel)]="newPost.content" 
                    name="content" 
                    placeholder="Contenido de tu post..." 
                    required></textarea>
          <div class="form-actions">
            <button type="submit" [disabled]="!form.valid">Publicar</button>
            <button type="button" (click)="cancelPost()">Cancelar</button>
          </div>
        </form>
      </div>

      <!-- Lista de posts -->
      <div class="posts-list">
        <div *ngFor="let post of forumPosts; trackBy: trackByPostId" class="post-card">
          <div class="post-header">
            <h3>{{post.title}}</h3>
            <div class="post-meta">
              <span class="author">Por {{post.author}}</span>
              <span class="date">{{post.date | date:'short'}}</span>
              <span class="replies-count">{{post.replies.length}} respuestas</span>
            </div>
          </div>
          
          <div class="post-content">
            <p>{{post.content}}</p>
          </div>
          
          <div class="post-footer">
            <button (click)="toggleReplies[post.id] = !toggleReplies[post.id]" 
                    class="replies-btn">
              💬 {{toggleReplies[post.id] ? 'Ocultar' : 'Ver'}} respuestas
            </button>
            <button (click)="toggleReplyForm(post.id)" 
                    class="reply-btn">
              {{showReplyForm[post.id] ? 'Cancelar' : 'Responder'}}
            </button>
          </div>

          <!-- Formulario de respuesta -->
          <div *ngIf="showReplyForm[post.id]" class="reply-form">
            <h4>Agregar respuesta</h4>
            <textarea [ngModel]="getReplyFormValue(post.id, 'content')" 
                      placeholder="Escribe tu respuesta..."
                      (ngModelChange)="setReplyFormValue(post.id, 'content', $event)"></textarea>
            <input [ngModel]="getReplyFormValue(post.id, 'author')" 
                   placeholder="Tu nombre"
                   (ngModelChange)="setReplyFormValue(post.id, 'author', $event)">
            <div class="reply-actions">
              <button (click)="addReply(post.id)" 
                      [disabled]="!canSubmitReply(post.id)">
                Enviar
              </button>
              <button (click)="cancelReply(post.id)">Cancelar</button>
            </div>
          </div>

          <!-- Sección de respuestas -->
          <div *ngIf="toggleReplies[post.id] && post.replies.length > 0" class="replies-section">
            <h4>Respuestas ({{post.replies.length}})</h4>
            <div *ngFor="let reply of post.replies; trackBy: trackByReplyId" class="reply-card">
              <div class="reply-header">
                <span class="reply-author">{{reply.author}}</span>
                <span class="reply-date">{{reply.date | date:'short'}}</span>
              </div>
              <p class="reply-content">{{reply.content}}</p>
            </div>
          </div>

          <!-- Mensaje cuando no hay respuestas -->
          <div *ngIf="toggleReplies[post.id] && post.replies.length === 0" class="no-replies">
            <p>Aún no hay respuestas. ¡Sé el primero en comentar!</p>
          </div>
        </div>
      </div>

      <!-- Mensaje cuando no hay posts -->
      <div *ngIf="forumPosts.length === 0" class="no-posts">
        <h3>👋 ¡Bienvenido al foro!</h3>
        <p>Aún no hay discusiones. ¡Crea la primera!</p>
      </div>
    </div>
  `,
  styles: [`
    .forum-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    .forum-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e9ecef;
    }
    
    .forum-header h1 {
      color: #495057;
      margin: 0;
    }
    
    .new-post-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
    }
    
    .new-post-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
    
    .new-post-form {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
      border: 1px solid #e9ecef;
    }
    
    .new-post-form h3 {
      margin-top: 0;
      color: #495057;
      margin-bottom: 1.5rem;
    }
    
    .new-post-form input, .new-post-form textarea {
      width: 100%;
      padding: 0.875rem;
      margin-bottom: 1rem;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      box-sizing: border-box;
      font-size: 0.95rem;
      transition: border-color 0.3s ease;
    }
    
    .new-post-form input:focus, .new-post-form textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .new-post-form textarea {
      min-height: 120px;
      resize: vertical;
      font-family: inherit;
    }
    
    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }
    
    .form-actions button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
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
    
    .form-actions button:hover:not(:disabled) {
      transform: translateY(-1px);
    }
    
    .posts-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .post-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      overflow: hidden;
      border: 1px solid #e9ecef;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .post-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.12);
    }
    
    .post-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e9ecef;
    }
    
    .post-header h3 {
      margin: 0 0 0.75rem 0;
      color: #333;
      font-size: 1.3rem;
    }
    
    .post-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.9rem;
      color: #6c757d;
      flex-wrap: wrap;
    }
    
    .author {
      font-weight: 600;
      color: #667eea;
    }
    
    .replies-count {
      background: #f8f9fa;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.8rem;
    }
    
    .post-content {
      padding: 1.5rem;
    }
    
    .post-content p {
      margin: 0;
      line-height: 1.6;
      color: #495057;
    }
    
    .post-footer {
      padding: 1rem 1.5rem;
      background: #f8f9fa;
      display: flex;
      gap: 1rem;
      border-top: 1px solid #e9ecef;
    }
    
    .replies-btn, .reply-btn {
      background: none;
      border: 2px solid #667eea;
      color: #667eea;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .replies-btn:hover, .reply-btn:hover {
      background: #667eea;
      color: white;
    }
    
    .reply-btn {
      background: #667eea;
      color: white;
    }
    
    .reply-btn:hover {
      background: #5a67d8;
    }
    
    .reply-form {
      padding: 1.5rem;
      background: #f8f9fa;
      border-top: 1px solid #e9ecef;
    }
    
    .reply-form h4 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: #495057;
    }
    
    .reply-form textarea, .reply-form input {
      width: 100%;
      padding: 0.75rem;
      margin-bottom: 1rem;
      border: 2px solid #dee2e6;
      border-radius: 6px;
      box-sizing: border-box;
      transition: border-color 0.3s ease;
    }
    
    .reply-form textarea:focus, .reply-form input:focus {
      outline: none;
      border-color: #667eea;
    }
    
    .reply-form textarea {
      min-height: 80px;
      resize: vertical;
      font-family: inherit;
    }
    
    .reply-actions {
      display: flex;
      gap: 1rem;
    }
    
    .reply-actions button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .reply-actions button:first-child {
      background: #28a745;
      color: white;
    }
    
    .reply-actions button:first-child:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }
    
    .reply-actions button:last-child {
      background: #6c757d;
      color: white;
    }
    
    .reply-actions button:hover:not(:disabled) {
      transform: translateY(-1px);
    }
    
    .replies-section {
      padding: 1.5rem;
      background: #f8f9fa;
      border-top: 1px solid #e9ecef;
    }
    
    .replies-section h4 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: #495057;
      font-size: 1.1rem;
    }
    
    .reply-card {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      border-left: 4px solid #667eea;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    .reply-card:last-child {
      margin-bottom: 0;
    }
    
    .reply-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }
    
    .reply-author {
      font-weight: 600;
      color: #667eea;
    }
    
    .reply-date {
      color: #6c757d;
    }
    
    .reply-content {
      margin: 0;
      line-height: 1.5;
      color: #495057;
    }
    
    .no-replies {
      padding: 1.5rem;
      background: #f8f9fa;
      border-top: 1px solid #e9ecef;
      text-align: center;
    }
    
    .no-replies p {
      margin: 0;
      color: #6c757d;
      font-style: italic;
    }
    
    .no-posts {
      text-align: center;
      padding: 3rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    }
    
    .no-posts h3 {
      color: #495057;
      margin-bottom: 1rem;
    }
    
    .no-posts p {
      color: #6c757d;
      margin: 0;
    }
    
    @media (max-width: 768px) {
      .forum-container {
        padding: 1rem;
      }
      
      .forum-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
      
      .post-meta {
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .post-footer {
        flex-direction: column;
      }
    }
  `]
})
export class ForumComponent implements OnInit {
  // Arrays principales para manejar los datos del foro
  forumPosts: ForumPost[] = [];
  
  // Estados de UI
  showNewPostForm = false;
  showReplyForm: {[key: number]: boolean} = {};
  toggleReplies: {[key: number]: boolean} = {};
  
  // Formularios
  newPost = {
    title: '',
    content: '',
    author: ''
  };
  
  // Manejo individual de formularios de respuesta por post
  replyForms: {[key: number]: {content: string, author: string}} = {};
  
  // Contador para IDs únicos
  private nextPostId = 1;
  private nextReplyId = 1;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    // Suscribirse a los posts del servicio
    this.dataService.forumPosts$.subscribe(posts => {
      this.forumPosts = posts;
      // Actualizar contadores para mantener IDs únicos
      if (posts.length > 0) {
        this.nextPostId = Math.max(...posts.map(p => p.id)) + 1;
        const allReplies = posts.flatMap(p => p.replies);
        if (allReplies.length > 0) {
          this.nextReplyId = Math.max(...allReplies.map(r => r.id)) + 1;
        }
      }
    });
    
    // Inicializar algunos posts de ejemplo si no hay datos
    this.initializeExampleData();
  }

  /**
   * Método helper para obtener valores del formulario de respuesta de manera segura
   */
  getReplyFormValue(postId: number, field: 'content' | 'author'): string {
    if (!this.replyForms[postId]) {
      this.replyForms[postId] = { content: '', author: '' };
    }
    return this.replyForms[postId][field];
  }

  /**
   * Inicializar datos de ejemplo para demostración
   */
  private initializeExampleData() {
    if (this.forumPosts.length === 0) {
      const examplePosts: ForumPost[] = [
        {
          id: 1,
          title: '¿Cuál es el futuro de la IA en el desarrollo de software?',
          content: 'Me gustaría conocer sus opiniones sobre cómo la inteligencia artificial está transformando la manera en que desarrollamos software. ¿Creen que eventualmente reemplazará a los programadores?',
          author: 'TechEnthusiast',
          date: new Date(Date.now() - 86400000), // Hace 1 día
          replies: [
            {
              id: 1,
              content: 'Creo que la IA será una herramienta poderosa que nos ayudará a ser más productivos, pero no creo que reemplace completamente a los desarrolladores. Siempre necesitaremos creatividad humana.',
              author: 'CodeMaster',
              date: new Date(Date.now() - 43200000) // Hace 12 horas
            }
          ]
        }
      ];
      
      // Agregar posts de ejemplo usando el servicio
      examplePosts.forEach(post => {
        this.dataService.addForumPost({
          title: post.title,
          content: post.content,
          author: post.author
        });
      });
    }
  }

  /**
   * Crear un nuevo post
   */
  createPost() {
    if (this.newPost.title.trim() && this.newPost.content.trim() && this.newPost.author.trim()) {
      this.dataService.addForumPost({
        title: this.newPost.title.trim(),
        content: this.newPost.content.trim(),
        author: this.newPost.author.trim()
      });
      this.cancelPost();
    }
  }

  /**
   * Cancelar creación de post
   */
  cancelPost() {
    this.showNewPostForm = false;
    this.newPost = { title: '', content: '', author: '' };
  }

  /**
   * Toggle formulario de respuesta
   */
  toggleReplyForm(postId: number) {
    this.showReplyForm[postId] = !this.showReplyForm[postId];
    
    // Inicializar formulario si no existe
    if (this.showReplyForm[postId] && !this.replyForms[postId]) {
      this.replyForms[postId] = { content: '', author: '' };
    }
    
    // Limpiar formulario si se está cerrando
    if (!this.showReplyForm[postId]) {
      this.replyForms[postId] = { content: '', author: '' };
    }
  }

  /**
   * Establecer valor del formulario de respuesta
   */
  setReplyFormValue(postId: number, field: 'content' | 'author', value: string) {
    if (!this.replyForms[postId]) {
      this.replyForms[postId] = { content: '', author: '' };
    }
    this.replyForms[postId][field] = value;
  }

  /**
   * Verificar si se puede enviar la respuesta
   */
  canSubmitReply(postId: number): boolean {
    const form = this.replyForms[postId];
    return form && form.content.trim() !== '' && form.author.trim() !== '';
  }

  /**
   * Agregar respuesta a un post
   */
  addReply(postId: number) {
    const form = this.replyForms[postId];
    
    if (!this.canSubmitReply(postId)) {
      return;
    }

    // Encontrar el post y agregar la respuesta
    const postIndex = this.forumPosts.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
      const newReply = {
        id: this.nextReplyId++,
        content: form.content.trim(),
        author: form.author.trim(),
        date: new Date()
      };

      // Actualizar el post con la nueva respuesta
      this.forumPosts[postIndex].replies.push(newReply);
      
      // Mostrar las respuestas automáticamente
      this.toggleReplies[postId] = true;
      
      // Limpiar y ocultar formulario
      this.cancelReply(postId);
      
      // Actualizar el servicio (si tienes un método para esto)
      // this.dataService.updateForumPost(this.forumPosts[postIndex]);
    }
  }

  /**
   * Cancelar respuesta
   */
  cancelReply(postId: number) {
    this.showReplyForm[postId] = false;
    this.replyForms[postId] = { content: '', author: '' };
  }

  /**
   * TrackBy function para optimizar rendering de respuestas
   */
  trackByReplyId(index: number, reply: any): number {
    return reply.id;
  }

  /**
   * TrackBy function para optimizar rendering de posts
   */
  trackByPostId(index: number, post: ForumPost): number {
    return post.id;
  }
}