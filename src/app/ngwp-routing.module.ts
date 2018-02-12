import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './components-old/post-list/post-list.component';
import { PostComponent } from './components-old/post/post.component';

const routes: Routes = [
  {
    path: '',
    component: PostListComponent,
    pathMatch: 'full'
  },
  {
    path: 'page/:pageNumber',
    component: PostListComponent,
  },
  {
    path: ':slug',
    component: PostComponent
  },
  {
    path: ':slug/comments-page/:commentsPageNumber',
    component: PostComponent
  },
  {
    path: ':slug/page/:pageNumber',
    component: PostComponent
  },
  {
    path: ':type/:slug',
    component: PostListComponent
  },
  {
    path: ':type/:slug/page/:pageNumber',
    component: PostListComponent
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class NgWpRoutingModule { }
