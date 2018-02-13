import { Component, OnInit } from '@angular/core';
import { WpRestService } from 'app/services/wp-rest.service';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/combineLatest'
import 'rxjs/add/operator/zip'
import { IWpPost, IWpPage, IWpComment } from 'app/interfaces/wp-rest-types';
import { ViewModelService } from 'app/services/view-model.service';

@Component({
  selector: 'ngwp-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.less']
})
export class ViewComponent implements OnInit {

  constructor(
    public viewModelService: ViewModelService,
  ) { }

  ngOnInit() {
    // this.viewModelService.currentPost.subscribe()
  }


}
