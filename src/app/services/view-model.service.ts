import { Injectable } from '@angular/core';
import { IWpPost, IWpPage, IWpComment } from 'app/interfaces/wp-rest-types';
import { WpRestService } from './wp-rest.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/'

@Injectable()
export class ViewModelService {

  private _currentPost: IWpPost | IWpPage;
  currentPost: Subject<IWpPost | IWpPage> = new Subject();

  private _currentAdjcentPosts: { next: IWpPost; previous: IWpPost; };
  currentAdjcentPosts: Subject<{ next: IWpPost; previous: IWpPost; }> = new Subject();

  private _currentList: (IWpPost | IWpPage)[];
  currentList: Subject<(IWpPost | IWpPage)[]> = new Subject();

  private _postsPerPage: number;
  postsPerPage: Subject<number> = new Subject();

  private _currentListPageNumber: number;
  currentListPageNumber: Subject<number> = new Subject();

  private _currentListPageCount: number;
  currentListPageCount: Subject<number> = new Subject();


  private allComments: IWpComment[];

  private _commentsPerPage: number;
  commentsPerPage: Subject<number> = new Subject();

  private _commentsPageNumber: number;
  commentsPageNumber: Subject<number> = new Subject();

  private _commentsPageCount: number;
  commentsPageCount: Subject<number> = new Subject();

  private _comments: IWpComment[];
  comments: Subject<IWpComment[]> = new Subject();

  private slug: string | undefined;
  private type: 'tag' | 'category' | 'author' | 'search' | undefined;

  constructor(
    private wpRestService: WpRestService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.children[0].params
      .combineLatest(this.activatedRoute.queryParams)
      .forEach(this.updateView.bind(this));
  }

  private emitIfNew<T>(value: T, backer: T, subject: Subject<T>): T {
    if (value === backer) return backer;
    subject.next(value);
    console.log('emit', value);
    return value;
  }

  private updateView(routerParams: { [key: string]: any }[]): void {
    const params = routerParams[0];
    const queryParams = routerParams[1];

    // const listPageNumber = +params['pageNumber'] || 1;
    this._currentListPageNumber
      = this.emitIfNew(+params['pageNumber'] || 1, this._currentListPageNumber, this.currentListPageNumber);

    // const commentsPageNumber = +params['commentsPageNumber'] || 1;
    this._commentsPageNumber
      = this.emitIfNew(+params['commentsPageNumber'] || 1, this._commentsPageNumber, this.commentsPageNumber);

    this.type = params['type'];
    this.slug = params['slug'];

    if (queryParams.s != null) {
      this.type = 'search';
      this.slug = queryParams.s;
    }

    // if (type != null && slug != null)
    //   this.routerPrefix = `/${type}/${slug}`;

    console.log(!!(!this.type && this.slug));

    if (this.type === undefined && this.slug)
      this.getPost();

    this.getList();
  }

  public getPost() {
    this.wpRestService.getPostOrPage(this.slug)
      .then(post => {
        // if (!post) return;

        // this.currentPost = post;
        this._currentPost
          = this.emitIfNew(post, this._currentPost, this.currentPost);

        // console.log('current post', this.post); // for debug

        // if this is a post, not a page, get adjcent posts for routing
        if (post.type === 'post')
          this.wpRestService.getAdjcentPosts(this.slug)
            .then(adjcentPosts => {
              this._currentAdjcentPosts
                = this.emitIfNew(adjcentPosts, this._currentAdjcentPosts, this.currentAdjcentPosts)
            });
        // .then(adjcentPosts => this.currentAdjcentPosts = adjcentPosts);

        // if this is a password protected post, show the password form
        // if (this.currentPost.content.protected)
        //   this.showPasswordForm = true;
        // else
        this.getPostComments();
      });
  }

  public getPostComments(): void {
    const password = undefined; // figure this out later

    // get the comments for the current post from the WpRestService
    Promise.all([
      this.wpRestService.getComments(this._currentPost, password),
      this.wpRestService.options
    ]).then(res => {
      const comments = this.allComments = res[0];
      const options = res[1];

      // get the number of comment-pages
      // this.commentsPerPage = options.discussion.comments_per_page;
      this._commentsPerPage
        = this.emitIfNew(options.discussion.comments_per_page, this._commentsPerPage, this.commentsPerPage);

      // this.commentsPageCount = Array(Math.ceil(comments.length / this.commentsPerPage)).fill(0);
      this._commentsPageCount
        = this.emitIfNew(Math.ceil(comments.length / this._commentsPerPage), this._commentsPageCount, this.commentsPerPage);

      // get the current comment-page's set of comments
      const lowerIndex = this._commentsPerPage * (this._commentsPageNumber - 1);
      const upperIndex = this._commentsPerPage * this._commentsPageNumber;

      // this.comments = comments.slice(lowerIndex, upperIndex);
      this._comments
        = this.emitIfNew(comments.slice(lowerIndex, upperIndex), this._comments, this.comments);
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
      // this.postsPerPage = options.reading.posts_per_page;
      this._postsPerPage
        = this.emitIfNew(options.reading.posts_per_page, this._postsPerPage, this.postsPerPage);

      // this.currentPageCount = Array(Math.ceil(posts.length / this.postsPerPage)).fill(0);
      this._currentListPageCount
        = this.emitIfNew(Math.ceil(posts.length / this._postsPerPage), this._currentListPageCount, this.currentListPageCount);

      // get the current page's set of posts
      const lowerIndex = this._postsPerPage * (this._currentListPageNumber - 1);
      const upperIndex = this._postsPerPage * this._currentListPageNumber;

      // this.currentList = posts.slice(lowerIndex, upperIndex);
      this._currentList
        = this.emitIfNew(posts.slice(lowerIndex, upperIndex), this._currentList, this.currentList);

    });
  }


}


