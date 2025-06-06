import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { ClassificationsComponent } from './components/classifications/classifications.component';
import { ForumComponent } from './components/forum/forum.component';
import { StatsComponent } from './components/stats/stats.component';
import { ClassTopicsComponent } from './components/class-topics/class-topics.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: 'classifications', component: ClassificationsComponent },
  { path: 'class-topics', component: ClassTopicsComponent },
  { path: 'forum', component: ForumComponent },
  { path: 'stats', component: StatsComponent },
  { path: '**', redirectTo: '' }
];