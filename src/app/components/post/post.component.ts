import { Component, OnInit, Input } from '@angular/core';
import { IWpPage, IWpPost } from '../../interfaces/wp-rest-types';

@Component({
  selector: 'ngwp-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.less']
})
export class PostComponent implements OnInit {

  @Input() post: IWpPage | IWpPost;
  @Input() showFull: boolean = false;

  constructor() { }

  ngOnInit() { }

}
