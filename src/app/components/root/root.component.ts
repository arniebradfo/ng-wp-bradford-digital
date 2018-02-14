import { Component, OnInit } from '@angular/core';
import { WpRestService } from 'app/services/wp-rest.service';
import { ViewModelService } from 'app/services/view-model.service';

@Component({
  selector: 'ngwp-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.less']
})
export class RootComponent implements OnInit {

  public blogName: string;
  public blogDescription: string;

  constructor(
    private wpRestService: WpRestService,
    public viewModelService: ViewModelService,
  ) { }

  ngOnInit(): void {
    this.wpRestService.options.then(options => {
      this.blogName = options.general.blogname;
      this.blogDescription = options.general.blogdescription;
    });
  }

}
