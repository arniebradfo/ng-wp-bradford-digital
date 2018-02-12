import { Component, OnInit, Input } from '@angular/core';
import { IWpMenuItem } from '../../interfaces/wp-rest-types';
import { WpRestService } from '../../services/wp-rest.service';

// displays a menu from the WP MENU API plugin
// will not work without the plugin: https://wordpress.org/plugins/wp-api-menus/

@Component({
  selector: 'ngwp-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less']
})
export class NavComponent implements OnInit {

  public menu: IWpMenuItem[];
  public error: any;

  @Input() name: string;

  constructor(
    private wpRestService: WpRestService,
  ) { }

  ngOnInit() {
    this.getMenus();
  }

  private getMenus() {
    this.wpRestService
      .getMenu(this.name)
      .subscribe(res => {
        this.menu = res;
        // console.log(this.menu);
      }, err => {
        this.error = err;
        // console.log(this.error);
      });
  }

  // get the route out of a url
  public parseRouterLink(url: string): string {
    return new URL(url).pathname;
  }

}
