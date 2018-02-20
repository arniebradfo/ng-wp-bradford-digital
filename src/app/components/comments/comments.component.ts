import { Component, OnInit, Input } from '@angular/core';
import { IWpPage, IWpPost } from 'app/interfaces/wp-rest-types';
import { ViewModelService } from '../../services/view-model.service';

@Component({
  selector: 'ngwp-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.less']
})
export class CommentsComponent implements OnInit {

  @Input() post: IWpPage | IWpPost;

  constructor(
    public viewModelService: ViewModelService,
  ) { }

  ngOnInit() {
    this.viewModelService.commentList$.subscribe(thing => console.log(thing));
  }

}
