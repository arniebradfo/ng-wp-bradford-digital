import { Component, OnInit } from '@angular/core';
import { ViewModelService } from 'app/services/view-model.service';
import { IWpComment } from '../../interfaces/wp-rest-types';

@Component({
	selector: 'ngwp-comments',
	templateUrl: './comments.component.html',
	styleUrls: ['./comments.component.less']
})
export class CommentsComponent implements OnInit {

	constructor(
		public viewModelService: ViewModelService,
	) { }

	ngOnInit() { }

}
