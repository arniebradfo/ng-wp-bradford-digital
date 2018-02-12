import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewComponent } from './components/view/view.component';

const routes: Routes = [
  {
    path: '',
    component: ViewComponent,
    pathMatch: 'full'
  },
  {
    path: 'page/:pageNumber',
    component: ViewComponent,
  },
  {
    path: ':slug',
    component: ViewComponent
  },
  {
    path: ':slug/comments-page/:commentsPageNumber',
    component: ViewComponent
  },
  {
    path: ':slug/page/:pageNumber',
    component: ViewComponent
  },
  {
    path: ':type/:slug',
    component: ViewComponent
  },
  {
    path: ':type/:slug/page/:pageNumber',
    component: ViewComponent
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class NgWpRoutingModule { }
