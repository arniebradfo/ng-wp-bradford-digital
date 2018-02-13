import { Component, OnInit } from '@angular/core';
import { WpRestService } from 'app/services/wp-rest.service';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/combineLatest'
import 'rxjs/add/operator/zip'
import { IWpPost, IWpPage, IWpComment } from '../../interfaces/wp-rest-types';

@Component({
  selector: 'ngwp-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.less']
})
export class ViewComponent implements OnInit {

  pageNumber: number;

  currentPost: IWpPost | IWpPage;
  currentList: (IWpPost | IWpPage)[];
  adjcentPosts: { next: IWpPost; previous: IWpPost; };

  postsPerPage: number;
  pageCount: number[];

  showPasswordForm: boolean = false;
  password: string;

  private allComments: IWpComment[];
  private commentsPerPage: number;
  private commentsPageNumber: number;
  comments: IWpComment[];
  commentsPageCount: number[];
  rootCommentFormOpen: boolean = true;

  private slug: string | undefined;
  private type: 'tag' | 'category' | 'author' | 'search' | undefined;

  constructor(
    private wpRestService: WpRestService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.params
      .combineLatest(this.activatedRoute.queryParams)
      .forEach(this.updateView.bind(this));
  }

  ngOnInit() { }

  private updateView(routerParams: { [key: string]: any }[]): void {
    const params = routerParams[0];
    const queryParams = routerParams[1];

    console.log('update view');

    this.pageNumber = +params['pageNumber'] || 1;
    this.commentsPageNumber = +params['commentsPageNumber'] || 1;

    this.type = params['type'];
    this.slug = params['slug'];
    if (queryParams.s != null) {
      this.type = 'search';
      this.slug = queryParams.s;
    }

    // if (type != null && slug != null)
    //   this.routerPrefix = `/${type}/${slug}`;

    this.getPost();
    // or
    this.getList();
  }

  public getPost() {
    this.wpRestService.getPostOrPage(this.slug)
      .then(post => {
        if (!post) return;

        this.currentPost = post;
        // console.log('current post', this.post); // for debug

        // if this is a post, not a page, get adjcent posts for routing
        if (post.type === 'post')
          this.wpRestService.getAdjcentPosts(this.slug)
            .then(adjcentPosts => this.adjcentPosts = adjcentPosts);

        // if this is a password protected post, show the password form
        // if (this.currentPost.content.protected)
        //   this.showPasswordForm = true;
        // else
        this.getPostComments();
      });
  }

  public getPostComments(): void {

    // get the comments for the current post from the WpRestService
    Promise.all([
      this.wpRestService.getComments(this.currentPost, this.password),
      this.wpRestService.options
    ]).then(res => {
      const comments = this.allComments = res[0];
      const options = res[1];

      // get the number of comment-pages
      this.commentsPerPage = options.reading.posts_per_page;
      this.commentsPageCount = Array(Math.ceil(comments.length / this.commentsPerPage)).fill(0);

      // get the current comment-page's set of comments
      const lowerIndex = this.commentsPerPage * (this.commentsPageNumber - 1);
      const upperIndex = this.commentsPerPage * this.commentsPageNumber;
      this.comments = comments.slice(lowerIndex, upperIndex);
    });
  }

  public getList(): void {
    // retrieve the requested set of posts from the WpRestService
    Promise.all([
      this.wpRestService.getPosts(this.type, this.slug),
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
      this.currentList = posts.slice(lowerIndex, upperIndex);

    });
  }

}
