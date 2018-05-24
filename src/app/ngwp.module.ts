import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgWpRoutingModule } from './ngwp-routing.module';
import { ShortcodesModule } from './shortcodes/shortcodes.module';

import { WpRestService } from './services/wp-rest.service';
import { ViewModelService } from './services/view-model.service';

import { NumberToArrayPipe } from './pipes/number-to-array.pipe';

import { RootComponent } from './components/root/root.component';
import { PostComponent } from './components/post/post.component';
import { ContentComponent } from './components/content/content.component';
import { SearchComponent } from './components/search/search.component';
import { EmptyComponent } from './components/empty/empty.component';
import { CommentsComponent } from './components/comments/comments.component';
import { CommentFormComponent } from './components/comment-form/comment-form.component';
import { IconComponent } from './components/icon/icon.component';
import { IconDefsComponent } from './components/icon-defs/icon-defs.component';
import { LogoComponent } from './components/logo/logo.component';
import { UrlPathnamePipe } from './pipes/url-pathname.pipe';

@NgModule({
	imports: [
		BrowserAnimationsModule,
		ShortcodesModule,
		BrowserModule,
		FormsModule,
		HttpModule,
		NgWpRoutingModule,
	],
	declarations: [
		PostComponent,
		SearchComponent,
		ContentComponent,
		RootComponent,
		EmptyComponent,
		CommentsComponent,
		CommentFormComponent,
		NumberToArrayPipe,
		IconComponent,
		IconDefsComponent,
		LogoComponent,
		UrlPathnamePipe,
	],
	providers: [
		WpRestService,
		ViewModelService
	],
	bootstrap: [RootComponent],
})
export class NgWpModule { }
