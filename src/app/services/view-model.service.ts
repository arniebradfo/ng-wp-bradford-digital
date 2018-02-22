import { Injectable } from '@angular/core';
import { IWpPost, IWpPage, IWpComment, IWpError } from 'app/interfaces/wp-rest-types';
import { WpRestService } from './wp-rest.service';
import { Router, ActivationEnd } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/'



@Injectable()
export class ViewModelService {

  private _queryParams: { [key: string]: string; };
  private _slug: string | undefined;
  private _typeSlug: string | undefined;
  private _type: 'tag' | 'category' | 'author' | undefined;
  private _searchSlug: string | undefined;
  private _pageNumber: number;
  private _commentsPageNumber: number;
  routerInfo$: Subject<{
    // type: 'post' | 'list';
    queryParams: { [key: string]: string; };
    slug: string | undefined;
    typeSlug: string | undefined;
    type: 'tag' | 'category' | 'author' | undefined;
    searchSlug: string | undefined;
    pageNumber: number;
    commentsPageNumber: number;
  }> = new Subject();

  private _currentPost: IWpPost | IWpPage;
  post$: Subject<{
    currentPost: (IWpPost | IWpPage);
  }> = new Subject();

  private _currentList: (IWpPost | IWpPage)[];
  private _wholeList: (IWpPost | IWpPage)[];
  private _postsPerPage: number;
  private _currentListPageCount: number;
  private _canLoadMorePages: boolean;
  private _loadMorePageCount: number = 1;
  postList$: Subject<{
    currentList: (IWpPost | IWpPage)[];
    postsPerPage: number;
    currentListPageNumber: number;
    currentListPageCount: number;
    currentListRouterPrefix: string;
    currentListQueryParams: { [key: string]: string; };
    canLoadMorePages: boolean;
    loadMorePageCount: number;
    title: string;
    type: 'tag' | 'category' | 'author' | undefined;
  }> = new Subject();

  private _allComments: IWpComment[];
  private _commentsPerPage: number;
  private _commentsPageCount: number;
  private _comments: IWpComment[];
  commentList$: Subject<{
    currentPost: (IWpPost | IWpPage);
    allComments: IWpComment[];
    commentsPerPage: number;
    commentsPageNumber: number;
    commentsPageCount: number;
    comments: IWpComment[];
  }> = new Subject();

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
      queryParams: this._queryParams,
      slug: this._slug,
      typeSlug: this._typeSlug,
      type: this._type,
      searchSlug: this._searchSlug,
      pageNumber: this._pageNumber,
      commentsPageNumber: this._commentsPageNumber,
    })
  }

  private emitPost() {
    this.post$.next({
      currentPost: this._currentPost,
    });
  }

  private emitPostList() {
    this.postList$.next({
      currentList: this._currentList,
      postsPerPage: this._postsPerPage,
      currentListPageNumber: this._pageNumber,
      currentListPageCount: this._currentListPageCount,
      currentListRouterPrefix: this._type && this._typeSlug ? `/${this._type}/${this._typeSlug}` : '',
      currentListQueryParams: this._queryParams,
      canLoadMorePages: this._canLoadMorePages,
      loadMorePageCount: this._loadMorePageCount,
      title: this._typeSlug || this._searchSlug || 'Posts',
      type: this._type
    });
  }

  private emitComments() {
    this.commentList$.next({
      currentPost: this._currentPost,
      allComments: this._allComments,
      commentsPerPage: this._commentsPerPage,
      commentsPageNumber: this._commentsPageNumber,
      commentsPageCount: this._commentsPageCount,
      comments: this._comments,
    });
  }

  private updateView(event: ActivationEnd): void {
    const params = event.snapshot.params;

    this._queryParams = event.snapshot.queryParams;
    this._pageNumber = +params['pageNumber'] || 1;
    this._commentsPageNumber = +params['commentsPageNumber'] || 1;
    this._type = params.type;
    this._typeSlug = params.typeSlug;
    this._slug = params.slug;
    this._searchSlug = this._queryParams.s;

    this.emitRouterInfo();

    if (this._slug)
      this.updatePost();
    if (this._type && this._typeSlug)
      this.updatePostList(this._type, this._typeSlug);
    else if (this._searchSlug)
      this.updatePostList('search', this._searchSlug);
    else if ( !this._currentList || (!this._type && !this._typeSlug && !this._slug && !this._searchSlug))
      this.updatePostList();
  }

  public updatePost() {
    this.wpRestService.getPostOrPage(this._slug)
      .then(post => {
        if (!post) return;

        this._currentPost = post;
        this.emitPost();

        if (!this._currentPost.isLocked)
          this.updateComments();
      });
  }

  public getPasswordProtected(id: number, password: string) {
    this.wpRestService.getPasswordProtected(id, password)
      .then(post => {
        if (!post) return;
        this._currentPost = post;
        this.updateComments(password);
        this.emitPost();
      }, (err: IWpError) => {
        this.emitPost();
      });
  }

  public updateComments(password?: string): void {
    // const password = undefined; // figure this out later

    // get the comments for the current post from the WpRestService
    Promise.all([
      this.wpRestService.getComments(this._currentPost, password),
      this.wpRestService.options
    ]).then(res => {
      const comments = this._allComments = res[0];
      const options = res[1];

      // get the number of comment-pages
      this._commentsPerPage = options.discussion.comments_per_page;
      this._commentsPageCount = Math.ceil(comments.length / this._commentsPerPage);

      // get the current comment-page's set of comments
      const lowerIndex = this._commentsPerPage * (this._commentsPageNumber - 1);
      const upperIndex = this._commentsPerPage * this._commentsPageNumber;

      this._comments = comments.slice(lowerIndex, upperIndex);
      this.emitComments();
    });
  }

  public updatePostList(
    type?: 'tag' | 'category' | 'author' | 'search',
    slug?: string,
  ): void {
    // retrieve the requested set of posts from the WpRestService
    Promise.all([
      this.wpRestService.getPosts(type, slug),
      this.wpRestService.options
    ]).then(res => {
      this._wholeList = res[0];
      const options = res[1];

      this._loadMorePageCount = 1;

      // get the number of post-list pages
      this._postsPerPage = options.reading.posts_per_page;
      this._currentListPageCount = Math.ceil(this._wholeList.length / this._postsPerPage);

      // get the current page's set of posts
      const lowerIndex = this._postsPerPage * (this._pageNumber - 1);
      const upperIndex = this._postsPerPage * this._pageNumber;
      this._canLoadMorePages = this._wholeList.length > upperIndex
      this._currentList = this._wholeList.slice(lowerIndex, upperIndex);

      this.emitPostList();
    });
  }

  public loadMorePosts() {
    this._loadMorePageCount++;
    const lowerIndex = this._postsPerPage * (this._pageNumber - 1);
    const upperIndex = this._postsPerPage * this._pageNumber * this._loadMorePageCount;
    this._canLoadMorePages = this._wholeList.length > upperIndex
    this._currentList = this._wholeList.slice(lowerIndex, upperIndex);
    this.emitPostList();
  }


}


