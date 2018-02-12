import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgWpRoutingModule } from './ngwp-routing.module';
import { ShortcodesModule } from './shortcodes/shortcodes.module';

import { WpRestService } from './services/wp-rest.service';

import { RootComponent } from './components/root/root.component';
import { NavComponent } from './components/nav/nav.component';

import { PostComponent } from './components-old/post/post.component';
import { PostListComponent } from './components-old/post-list/post-list.component';
import { CommentFormComponent } from './components-old/comment-form/comment-form.component';
import { SearchComponent } from './components-old/search/search.component';
import { ContentComponent } from './components-old/content/content.component';
import { ViewComponent } from './components/view/view.component';

@NgModule({
  declarations: [
    NavComponent,
    PostComponent,
    PostListComponent,
    CommentFormComponent,
    SearchComponent,
    ContentComponent,
    RootComponent,
    ViewComponent,
  ],
  imports: [
    ShortcodesModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    NgWpRoutingModule
  ],
  providers: [
    WpRestService,
  ],
  bootstrap: [RootComponent],
})
export class NgWpModule { }
