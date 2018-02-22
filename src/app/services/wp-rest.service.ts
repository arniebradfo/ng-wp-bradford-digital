import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import {
  IWpMenuItem, IWpPost, IWpPage, IWpTaxonomy, IWpUser, IWpComment,
  IWpOptions, IWpId, IWpMedia, IWpError
} from '../interfaces/wp-rest-types';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

// this service also serves as the global store of client-side data

@Injectable()
export class WpRestService {

  private _wpDomain: string = environment.wpBase;
  private _wpRest: string = this._wpDomain + 'wp-json/wp/v2/';
  private _wpMenus: string = this._wpDomain + 'wp-json/wp-api-menus/v2/';
  private _ngWp: string = this._wpDomain + 'wp-json/ngwp/v2/';

  public posts: Promise<IWpPost[]>;
  private _postsById: Promise<IWpPost[]>;

  public pages: Promise<IWpPage[]>;
  private _pagesById: Promise<IWpPage[]>;

  public media: Promise<IWpMedia[]>;
  private _mediaById: Promise<IWpMedia[]>;

  public tags: Promise<IWpTaxonomy[]>;
  private _tagsById: Promise<IWpTaxonomy[]>;

  public categories: Promise<IWpTaxonomy[]>;
  private _categoriesById: Promise<IWpTaxonomy[]>;

  public users: Promise<IWpUser[]>;
  private _usersById: Promise<IWpUser[]>;

  public options: Promise<IWpOptions>;

  constructor(
    private _http: Http,
  ) {
    // start debug timer
    // console.time('WpRestService');
    this.refreshAll();
    // end debug timer
    // Promise.all([ this.posts, this.pages, this.media, this.tags, this.categories, this.users, this.options ])
    //   .then(res => console.timeEnd('WpRestService'));
  }

  public refreshAll(): void {
    // generate all properties.
    this.refreshOptions();
    this.refreshTags();
    this.refreshCategories();
    this.refreshUsers();
    this.refreshMedia();

    // these two depend on the others being initlaized
    this.refreshPosts();
    this.refreshPages();
  }

  public refreshPosts(): void {
    this.posts = this.requestType('posts');
    this.posts = Promise.all([this.posts, this._mediaById, this._tagsById, this._categoriesById, this._usersById])
      .then(res => {
        let posts = res[0];
        const mediaById = res[1];
        const tagsById = res[2];
        const categoriesById = res[3];
        const usersById = res[4];
        posts = this.putStickyPostsFirst(posts);
        posts.forEach((post, i) => {

          post.tags_ref = [];
          post.tags.forEach(tagId => post.tags_ref.push(tagsById[tagId]));

          post.categories_ref = [];
          post.categories.forEach(categoryId => post.categories_ref.push(categoriesById[categoryId]));

          post.author_ref = usersById[post.author];
          post.featured_media_ref = mediaById[post.featured_media];

          post.adjcentPosts = {
            previous: i > 0 ? posts[i - 1] : posts[posts.length - 1],
            next: i < posts.length - 1 ? posts[i + 1] : posts[0]
          };

          post.isLocked = post.content.protected;

          post = this.tryConvertingDates(post);
        });
        return posts;
      });
    this._postsById = <Promise<IWpPost[]>>this.orderById(this.posts);
  }

  public refreshPages(): void {
    // TODO: edit router.config so that child/grandchild page routing works
    this.pages = this.requestType('pages');
    this.pages = Promise.all([this.pages, this._mediaById, this._usersById]).then(res => {
      const pages = res[0];
      const mediaById = res[1];
      const usersById = res[2];
      pages.forEach(page => {
        page.author_ref = usersById[page.author];
        page.featured_media_ref = mediaById[page.featured_media];
        page.isLocked = page.content.protected;
        page = this.tryConvertingDates(page);
      });
      return pages;
    });
    this._pagesById = <Promise<IWpPage[]>>this.orderById(this.pages);
  }

  public refreshTags(): void {
    this.tags = this.requestType('tags');
    this._tagsById = <Promise<IWpTaxonomy[]>>this.orderById(this.tags);
  }

  public refreshCategories(): void {
    this.categories = this.requestType('categories');
    this._categoriesById = <Promise<IWpTaxonomy[]>>this.orderById(this.categories);
  }

  public refreshUsers(): void {
    this.users = this.requestType('users');
    this._usersById = <Promise<IWpUser[]>>this.orderById(this.users);
  }

  public refreshMedia(): void {
    this.media = this.requestType('media');
    this.media = Promise.all([this.media, this._usersById]).then(res => {
      const medias = res[0];
      const usersById = res[1];
      medias.forEach(media => {
        media.author_ref = usersById[media.author];
        media = this.tryConvertingDates(media);
      });
      return medias;
    });
    this._mediaById = <Promise<IWpMedia[]>>this.orderById(this.media);
  }

  public refreshOptions(): void {
    this.options = this._http.get(this._ngWp + `options`)
      .map((res: Response) => res.json())
      .catch((err: Response | any) => {
        console.error(err);
        return Observable.throw(err);
      })
      .toPromise();
    // this.options.then(options => console.log('options', options)); // for debug
  }

  // recursively calls the WP REST API to get the full set of request data
  private requestType(type: string): Promise<any> {
    let set = [];
    return new Promise((resolve, reject) => {
      let page = 1;
      const perPage = 100; // the max allowed by WP

      const requestPostSet = () => {
        this._http
          .get(this._wpRest + `${type}?per_page=${perPage}&page=${page}`)
          .map((res: Response) => res.json())
          .catch((err: Response | any) => {
            console.error(err);
            reject(err);
            return Observable.throw(err);
          })
          .subscribe((res: any[]) => {

            // add the returned data to the set
            set = set.concat(res);

            // if the number of returned items matches the number of requested items
            if (res.length === perPage) {
              // then there are probably more data items, do another request
              page++;
              requestPostSet();
            } else {
              // console.log(type, set); // for debug
              // we've got all the data, return it
              resolve(set);
            }

          });
      };
      requestPostSet();
    });
  }

  public getPostOrPage(slug: string): Promise<IWpPage | IWpPost | undefined> {
    // TODO: make a map of slugs to posts/pages similar to the ..ById objects
    // ... and return items from that instead

    // get all the posts and pages and check them one by one until we match our string.
    return Promise.all([this.posts, this.pages]).then(res => {
      for (let i = 0; i < res.length; i++)       // for both sets: posts and pages
        for (let j = 0; j < res[i].length; j++)  // for each item within posts or pages
          if (slug === res[i][j].slug)           // check if the slug matches
            return res[i][j];                    // return the post/page if it does

      // if nothing matched, return undefined
      return undefined;

    });
  }

  // get a post or page that is password protected
  public getPasswordProtected(id: number, password: string): Promise<IWpPage | IWpPost | false> {
    return new Promise<IWpPage | IWpPost | false>((resolve, reject) => {
      this._postsById.then(postsById => {
        const post = postsById[id];
        this._http.get(post._links.self[0].href, { params: { password: password } })
          .map((res: Response) => res.json())
          .catch((err: Response) => {
            const wpErr: IWpError = err.json();
            post.error = wpErr;
            reject(post);
            return Observable.throw(wpErr);
          })
          .forEach(postRes => {
            // add the newly returned content and excerpt to the post and return the post
            post.content = postRes.content;
            post.excerpt = postRes.excerpt;
            post.isLocked = false;
            resolve(post);
          });
      });
    });
  }

  public getPosts(type?: 'tag' | 'category' | 'author' | 'search', slug?: string): Promise<(IWpPage | IWpPost)[]> {

    // return all posts if there are no filter parameters
    if (type == null || slug == null)
      return this.posts;

    // if we are seaching, return all pages and posts that contain the slug string
    if (type === 'search')
      return Promise.all([this.posts, this.pages])
      .then(res => {
        let posts = res[0];
        let pages = res[1];
        const searchTerm = new RegExp(slug, 'i');
        posts = posts.filter(post => {
          return searchTerm.test(post.content.rendered) || searchTerm.test(post.title.rendered);
        });
        pages = pages.filter(page => {
          return searchTerm.test(page.content.rendered) || searchTerm.test(page.title.rendered);
        });
        // TODO: reorder by date.
        return posts.concat(<IWpPost[]>pages);
      });

    // set the filter parameters
    let prop: string;
    let set: Promise<(IWpUser | IWpTaxonomy)[]>;
    switch (type) {
      case 'tag':
        prop = 'tags';
        set = this.tags;
        break;
      case 'category':
        prop = 'categories';
        set = this.categories;
        break;
      case 'author':
        prop = 'author';
        set = this.users;
        break;
    }

    // return a filtered version of the posts
    return Promise.all([this.posts, set])
      .then(res => {
        const posts = res[0];
        const items: any[] = res[1];
        const matchingItem = items.find(item => {
          return item.slug === slug;
        });
        const itemId: number = matchingItem.id;
        return posts.filter(post => {
          if (type === 'author')
            return post.author === itemId;
          else
            return post[prop].includes(itemId);
        });
      });

  }

  // get a menu from the https://wordpress.org/plugins/wp-api-menus/ plugin endpoint
  public getMenu(name: string): Observable<IWpMenuItem[]> {
    return this._http
      .get(this._wpMenus + `menu-locations/${name}`)
      .map((res: Response) => res.json())
      .catch((err: Response | any) => {
        console.error(err);
        return Observable.throw(this.checkForMenuApiErr(err));
      });
  }

  // get the comments of a specified post
  public getComments(post: IWpPage, password?: string): Promise<IWpComment[]> {
    // TODO: maybe save the comments somehow?

    // if asking for password protected comments that have been accessed before
    if (!password && post.content.protected && post.comments)
      return Promise.resolve(post.comments);

    const requestObj = password ? { params: { password: password } } : undefined;

    const commentsRequest: Promise<IWpComment[]> = this._http
      .get(post._links.replies[0].href + '&per_page=100', requestObj)
      .map((res: Response) => res.json())
      .catch((err: Response | any) => {
        console.error(err);
        return Observable.throw(err);
      })
      .toPromise();

    return Promise.all([commentsRequest, this._usersById]).then(res => {
      const comments = res[0];
      const usersById = res[1];
      comments.forEach(comment => {
        comment.author_ref = usersById[comment.author];
        comment = this.tryConvertingDates(comment);
      });
      const hierarchicalComments = this.generateCommentHeiarchy(comments);
      post.comments = hierarchicalComments;
      return hierarchicalComments;
    });
  }

  // try to submit a comment
  public postComment(newComment: {
    author_email: string;
    author_name: string;
    author_url?: string;
    content: string;
    post: number;
    parent?: number;
  }): void {
    // I can't figure out how to submit a valid nonce with this post request
    // the only way this works is with a rest_allow_anonymous_comments filter in functions.php
    this.options.then(options => {

      const body = {
        author_email: newComment.author_email,
        author_name: newComment.author_name,
        author_url: newComment.author_url,
        author_user_agent: window.navigator.userAgent,
        content: { raw: newComment.content, },
        // date_gmt: new Date(Date.now()).toISOString(),
        parent: newComment.parent,
        post: newComment.post
        // meta:	[]
      };

      this._http.post(this._wpRest + 'comments', body)
        .map((res: Response) => res.json())
        .toPromise()
        .then(res => {
          console.log(res);
          return res;
        }, err => console.log(err));
    });
  }

  // return an array where the ids are keys to Wp objects
  private orderById(promise: Promise<IWpId[]>): Promise<IWpId[]> {
    return promise.then(items => {
      const itemsById: (IWpId | undefined)[] = [];
      items.forEach(item => itemsById[item.id] = item);
      return itemsById;
    });
  }

  // convert string dates to Date objects
  private tryConvertingDates<T>(obj: T): T {
    const item: any = obj;
    if (item.date) item.date = new Date(item.date);
    if (item.date_gmt) item.date_gmt = new Date(item.date_gmt);
    if (item.modified) item.modified = new Date(item.modified);
    if (item.modified_gmt) item.modified_gmt = new Date(item.modified_gmt);
    return item;
  }

  // if the WP API Menu plugin isn't active, return an error message
  private checkForMenuApiErr(err: Response | any): string | any {
    if (err._body && err._body.match(/^[\{\{]/i)) {
      const errJson = err.json();
      if (errJson.code && errJson.code === `rest_no_route`) {
        return errJson.message + `
          The menu API requires the 'WP API Menus' plugin to be installed and activated.
          https://wordpress.org/plugins/wp-api-menus/
        `;
      }
    }
    return err;
  }

  private putStickyPostsFirst(posts: IWpPost[]): IWpPost[] {
    let stickyCount = 0;
    posts.forEach((post, i) => {
      if (post.sticky) {
        posts.splice(i, 1);
        posts.splice(stickyCount, 0, post);
        stickyCount++;
      }
    });
    return posts;
  }

  // nest reply comments under their parents
  private generateCommentHeiarchy(comments: IWpComment[]): IWpComment[] {
    // TODO: test this more, it might produce unexpected results
    comments.forEach(comment => comment.children = []);
    comments.forEach(comment => {
      if (comment.parent === 0) return;
      comments.find(parentComment => {
        return parentComment.id === comment.parent;
      }).children.push(comment);
    });
    comments = comments.filter(comment => comment.parent === 0);
    return comments;
  }

}
