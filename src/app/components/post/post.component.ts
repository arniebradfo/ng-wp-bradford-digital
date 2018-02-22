import { Component, OnInit, Input } from '@angular/core';
import { IWpPage, IWpPost } from '../../interfaces/wp-rest-types';
import { ViewModelService } from '../../services/view-model.service';

@Component({
  selector: 'ngwp-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.less']
})
export class PostComponent implements OnInit {

  @Input() post: IWpPage | IWpPost;
  @Input() showFull: boolean = false;

  private showPasswordForm: boolean = false;
  private password: string;

  constructor(
    private viewModelService: ViewModelService
  ) { }

  ngOnInit() {
    this.showPasswordForm = !!this.post.content.protected;
  }

  public onSubmitPassword(): void {
    this.viewModelService.getPasswordProtected(this.post.id, this.password);
  }

}
