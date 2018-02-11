import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { WpRestService } from 'app/services/wp-rest.service';

@Component({
  selector: 'ngwp-root',
  templateUrl: './ngwp.component.html',
})
export class NgWpComponent implements OnInit {
  public blogName: string;
  public blogDescription: string;

  constructor(
    private wpRestService: WpRestService,
  ) { }

  ngOnInit(): void {
    this.wpRestService.options.then(options => {
      this.blogName = options.general.blogname;
      this.blogDescription = options.general.blogdescription;
    });
  }
}
