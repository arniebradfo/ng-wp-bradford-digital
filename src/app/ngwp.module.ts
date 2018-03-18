import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgWpRoutingModule } from './ngwp-routing.module';
import { ShortcodesModule } from './shortcodes/shortcodes.module';

import { WpRestService } from './services/wp-rest.service';
import { ViewModelService } from './services/view-model.service';

import { NumberToArrayPipe } from './pipes/number-to-array.pipe';

import { RootComponent } from './components/root/root.component';
import { NavComponent } from './components/nav/nav.component';
import { PostComponent } from './components/post/post.component';
import { ContentComponent } from './components/content/content.component';
import { SearchComponent } from './components/search/search.component';
import { EmptyComponent } from './components/empty/empty.component';
import { CommentsComponent } from './components/comments/comments.component';
import { CommentFormComponent } from './components/comment-form/comment-form.component';
import { IconComponent } from './components/icon/icon.component';
import { IconDefsComponent } from './components/icon-defs/icon-defs.component';

@NgModule({
	declarations: [
		NavComponent,
		PostComponent,
		SearchComponent,
		ContentComponent,
		RootComponent,
		EmptyComponent,
		CommentsComponent,
		CommentFormComponent,
		NumberToArrayPipe,
		IconComponent,
		IconDefsComponent
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
