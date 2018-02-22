import { Component, OnInit, Input } from '@angular/core';
import { IWpComment, IWpPost } from 'app/interfaces/wp-rest-types';
import { WpRestService } from 'app/services/wp-rest.service';

// this form handles the collection and submission of post comments

@Component({
  selector: 'ngwp-comment-form',
  templateUrl: './comment-form.component.html',
})
export class CommentFormComponent implements OnInit {

  @Input() parent: IWpComment;
  @Input() post: IWpPost;

  public name: string;
  public email: string;
  public message: string;
  public submitted = false;

  constructor(
    private wpRestService: WpRestService,
  ) { }

  ngOnInit() { }

  onSubmit() {
    if (!this.post) return;
    this.submitted = true;
    this.wpRestService.postComment({
      author_email: this.email,
      author_name: this.name,
      content: this.message,
      post: this.post.id,
      parent: this.parent ? this.parent.id : undefined
    });
  }

}
