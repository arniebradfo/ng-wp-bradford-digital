import { Injectable } from '@angular/core';
import { IWpPost, IWpPage, IWpComment } from 'app/interfaces/wp-rest-types';
import { WpRestService } from './wp-rest.service';
import { Router, ActivationEnd } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/'



@Injectable()
export class ViewModelService {

  private _queryParams: { [key: string]: string; };
  private _slug: string | undefined;
  private _type: 'tag' | 'category' | 'author' | 'search' | undefined;
  private _pageNumber: number;
  private _commentsPageNumber: number;
  routerInfo$: Subject<{
    // type: 'post' | 'list';
    queryParams: { [key: string]: string; };
    slug: string | undefined;
    type: 'tag' | 'category' | 'author' | 'search' | undefined;
    pageNumber: number;
    commentsPageNumber: number;
  }> = new Subject();

  // currentPost: Subject<IWpPost | IWpPage> = new Subject();
  // currentAdjcentPosts: Subject<{ next: IWpPost; previous: IWpPost; }> = new Subject();

  private _currentPost: IWpPost | IWpPage;
  private _currentAdjcentPosts: { next: IWpPost; previous: IWpPost; };
  post$: Subject<{
    currentPost: (IWpPost | IWpPage);
    currentAdjcentPosts: { next: IWpPost; previous: IWpPost; };
  }> = new Subject();

  // currentList: Subject<(IWpPost | IWpPage)[]> = new Subject();
  // postsPerPage: Subject<number> = new Subject();
  // currentListPageNumber: Subject<number> = new Subject();

  private _currentList: (IWpPost | IWpPage)[];
  private _postsPerPage: number;
  private _currentListPageCount: number;

  postList$: Subject<{
    currentList: (IWpPost | IWpPage)[];
    postsPerPage: number;
    currentListPageNumber: number;
    currentListPageCount: number;
    currentListRouterPrefix: string;
    currentListQueryParams: { [key: string]: string; };
  }> = new Subject();

  // currentListPageCount: Subject<number> = new Subject();

  private _allComments: IWpComment[];
  private _commentsPerPage: number;
  private _commentsPageCount: number;
  private _comments: IWpComment[];

  comments$: Subject<{
    allComments: IWpComment[];
    commentsPerPage: number;
    commentsPageNumber: number;
    commentsPageCount: number;
    comments: IWpComment[];
  }> = new Subject();

  // commentsPerPage: Subject<number> = new Subject();
  // commentsPageNumber: Subject<number> = new Subject();
  // commentsPageCount: Subject<number> = new Subject();
  // comments: Subject<IWpComment[]> = new Subject();


  constructor(
    private wpRestService: WpRestService,
    private router: Router,
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof ActivationEnd)
        this.updateView(event)
    })
  }

  private emitRouterInfo() {
    this.routerInfo$.next({
      // type: 'post' | 'list';
      queryParams: this._queryParams,
      slug: this._slug,
      type: this._type,
      pageNumber: this._pageNumber,
      commentsPageNumber: this._commentsPageNumber,
    })
  }

  private emitPost() {
    this.post$.next({
      currentPost: this._currentPost,
      currentAdjcentPosts: this._currentAdjcentPosts
    });
  }

  private emitPostList() {
    this.postList$.next({
      currentList: this._currentList,
      postsPerPage: this._postsPerPage,
      currentListPageNumber: this._pageNumber,
      currentListPageCount: this._currentListPageCount,
      currentListRouterPrefix: this._type + this._slug,
      currentListQueryParams: this._queryParams
    });
  }

  private emitComments() {
    this.comments$.next({
      allComments: this._allComments,
      commentsPerPage: this._commentsPerPage,
      commentsPageNumber: this._commentsPageNumber,
      commentsPageCount: this._commentsPageCount,
      comments: this._comments,
    });
  }

  // private emitIfNew<T>(value: T, backer: T, subject: Subject<T>): T {
  //   if (value === backer) return backer;
  //   subject.next(value);
  //   // console.log('emit', value);
  //   return value;
  // }

  private updateView(event: ActivationEnd): void {
    // private updateView(routerParams: { [key: string]: any }[]): void {
    // const params = routerParams[0];
    // const queryParams = routerParams[1];
    const params = event.snapshot.params;
    this._queryParams = event.snapshot.queryParams;

    // const listPageNumber = +params['pageNumber'] || 1;
    // this._currentListPageNumber
    //   = this.emitIfNew(+params['pageNumber'] || 1, this._currentListPageNumber, this.currentListPageNumber);
    this._pageNumber = +params['pageNumber'] || 1;


    // const commentsPageNumber = +params['commentsPageNumber'] || 1;
    // this._commentsPageNumber
    //   = this.emitIfNew(+params['commentsPageNumber'] || 1, this._commentsPageNumber, this.commentsPageNumber);
    this._commentsPageNumber = +params['commentsPageNumber'] || 1;

    this._type = params['type'];
    this._slug = params['slug'];

    if (this._queryParams.s != null) {
      this._type = 'search';
      this._slug = this._queryParams.s;
    }

    // if (type != null && slug != null)
    //   this.routerPrefix = `/${type}/${slug}`;

    // console.log(!!(!this.type && this.slug));

    this.emitRouterInfo();

    if (this._type == null)
      this.updatePost();
    if (
      this._type || // if the type is defined
      this._currentList == null || // if there is no current list yet
      (this._type == null && this._slug == null) // if we are asking for the default page
    )
      this.updatePostList();
  }

  public updatePost() {
    this.wpRestService.getPostOrPage(this._slug)
      .then(post => {
        if (!post) return;

        this._currentPost = post;
        // this._currentPost
        //   = this.emitIfNew(post, this._currentPost, this.currentPost);

        // console.log('current post', this.post); // for debug

        // if this is a post, not a page, get adjcent posts for routing
        if (post.type === 'post')
          this.wpRestService.getAdjcentPosts(this._slug)
            .then(adjcentPosts => {
              // this._currentAdjcentPosts
              //   = this.emitIfNew(adjcentPosts, this._currentAdjcentPosts, this.currentAdjcentPosts)
              this._currentAdjcentPosts = adjcentPosts;
              this.emitPost();
            });
        // .then(adjcentPosts => this.currentAdjcentPosts = adjcentPosts);

        // if this is a password protected post, show the password form
        // if (this.currentPost.content.protected)
        //   this.showPasswordForm = true;
        // else

        this.updateComments();
      });
  }

  public updateComments(): void {
    const password = undefined; // figure this out later

    // get the comments for the current post from the WpRestService
    Promise.all([
      this.wpRestService.getComments(this._currentPost, password),
      this.wpRestService.options
    ]).then(res => {
      const comments = this._allComments = res[0];
      const options = res[1];

      // get the number of comment-pages
      this._commentsPerPage = options.discussion.comments_per_page;
      // this._commentsPerPage
      //   = this.emitIfNew(options.discussion.comments_per_page, this._commentsPerPage, this.commentsPerPage);

      this._commentsPageCount = Math.ceil(comments.length / this._commentsPerPage);
      // this._commentsPageCount
      //   = this.emitIfNew(Math.ceil(comments.length / this._commentsPerPage), this._commentsPageCount, this.commentsPerPage);

      // get the current comment-page's set of comments
      const lowerIndex = this._commentsPerPage * (this._commentsPageNumber - 1);
      const upperIndex = this._commentsPerPage * this._commentsPageNumber;

      this._comments = comments.slice(lowerIndex, upperIndex);
      // this._comments
      //   = this.emitIfNew(comments.slice(lowerIndex, upperIndex), this._comments, this.comments);
      this.emitComments();

    });
  }

  public updatePostList(): void {
    // retrieve the requested set of posts from the WpRestService
    Promise.all([
      this.wpRestService.getPosts(this._type, this._slug),
      this.wpRestService.options
    ]).then(res => {
      const posts = res[0];
      const options = res[1];

      // get the number of post-list pages
      this._postsPerPage = options.reading.posts_per_page;
      // this._postsPerPage
      //   = this.emitIfNew(options.reading.posts_per_page, this._postsPerPage, this.postsPerPage);

      this._currentListPageCount = Math.ceil(posts.length / this._postsPerPage);
      // this._currentListPageCount
      //   = this.emitIfNew(Math.ceil(posts.length / this._postsPerPage), this._currentListPageCount, this.currentListPageCount);

      // get the current page's set of posts
      const lowerIndex = this._postsPerPage * (this._pageNumber - 1);
      const upperIndex = this._postsPerPage * this._pageNumber;

      this._currentList = posts.slice(lowerIndex, upperIndex);
      // this._currentList
      //   = this.emitIfNew(posts.slice(lowerIndex, upperIndex), this._currentList, this.currentList);

      this.emitPostList();

    });
  }


}


