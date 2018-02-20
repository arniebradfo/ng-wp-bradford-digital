import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgWpRoutingModule } from './ngwp-routing.module';
import { ShortcodesModule } from './shortcodes/shortcodes.module';

import { WpRestService } from './services/wp-rest.service';
import { ViewModelService } from './services/view-model.service';

import { RootComponent } from './components/root/root.component';
import { NavComponent } from './components/nav/nav.component';
import { PostComponent } from './components/post/post.component';
import { ContentComponent } from './components-old/content/content.component';

import { PostListComponent } from './components-old/post-list/post-list.component';
import { CommentFormComponent } from './components-old/comment-form/comment-form.component';
import { SearchComponent } from './components-old/search/search.component';
import { EmptyComponent } from './components/empty/empty.component';
import { NumberToArrayPipe } from './pipes/number-to-array.pipe';
import { CommentsComponent } from './components/comments/comments.component';

@NgModule({
  declarations: [
    NavComponent,
    PostComponent,
    PostListComponent,
    CommentFormComponent,
    SearchComponent,
    ContentComponent,
    RootComponent,
    EmptyComponent,
    NumberToArrayPipe,
    CommentsComponent,
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
    ViewModelService
  ],
  bootstrap: [RootComponent],
})
export class NgWpModule { }
