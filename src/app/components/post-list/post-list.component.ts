import { Component, OnInit } from '@angular/core';
import { IWpPost, IWpPage, IWpTaxonomy } from '../../interfaces/wp-rest-types';
import { WpRestService } from '../../services/wp-rest.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'ngwp-post-list',
  templateUrl: './post-list.component.html',
})
export class PostListComponent implements OnInit {

  public posts: (IWpPost | IWpPage)[];
  public error: string;
  public postsPerPage: number;
  public pageNumber: number;
  public pageCount: number[];
  public routerPrefix: string = '';
  public queryParams: { [key: string]: string; } = {};

  constructor(
    private wpRestService: WpRestService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {

    this.activatedRoute.params.forEach(params => {

      // get route info
      this.pageNumber = +params['pageNumber'] || 1;
      let type: 'tag' | 'category' | 'author' | 'search' | undefined = params['type'];
      let slug: string | undefined = params['slug'];
      if (type != null && slug != null)
        this.routerPrefix = `/${type}/${slug}`;

      // get query params
      this.activatedRoute.queryParams.forEach((queryParams: Params) => {
        this.queryParams = queryParams;

        // if this is a search query, edit the request info
        if (this.queryParams.s != null) {
          type = 'search';
          slug = this.queryParams.s;
        }

        // retrieve the requested set of posts from the WpRestService
        Promise.all([
          this.wpRestService.getPosts(type, slug),
          this.wpRestService.options
        ]).then(res => {
          const posts = res[0];
          const options = res[1];

          // get the number of post-list pages
          this.postsPerPage = options.reading.posts_per_page;
          this.pageCount = Array(Math.ceil(posts.length / this.postsPerPage)).fill(0);

          // get the current page's set of posts
          const lowerIndex = this.postsPerPage * (this.pageNumber - 1);
          const upperIndex = this.postsPerPage * this.pageNumber;
          this.posts = posts.slice(lowerIndex, upperIndex);

        }, err => this.error = err);

      });
    });
  }

}
