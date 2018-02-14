import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmptyComponent } from './components/empty/empty.component';

const routes: Routes = [
  {
    path: '',
    component: EmptyComponent,
    pathMatch: 'full'
  },
  {
    path: 'page/:pageNumber',
    component: EmptyComponent,
  },
  {
    path: ':slug',
    component: EmptyComponent
  },
  {
    path: ':slug/comments-page/:commentsPageNumber',
    component: EmptyComponent
  },
  {
    path: ':slug/page/:pageNumber',
    component: EmptyComponent
  },
  {
    path: ':type/:slug',
    component: EmptyComponent
  },
  {
    path: ':type/:slug/page/:pageNumber',
    component: EmptyComponent
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class NgWpRoutingModule { }
