import { Component, OnInit, Input } from '@angular/core';
import { FacebookService, UIParams, UIResponse } from 'ngx-facebook';
import { Review } from '../review';

@Component({
  selector: 'app-review-list-item',
  templateUrl: './review-list-item.component.html',
  styleUrls: ['./review-list-item.component.css']
})
export class ReviewListItemComponent implements OnInit {
  
  @Input() review: Review;
  @Input() showModName: boolean = false;

  moduleName: string;

  constructor(
    private fb: FacebookService,
  ) { }

  ngOnInit() {
  }

  share(fragment: number) {
    let url = document.location.href + '#review' + fragment.toString();
    //console.log(url);

    let params: UIParams = {
      href: url,
      method: 'share',
    };
  
    this.fb.ui(params)
      .then((res: UIResponse) => console.log(res))
      .catch((e: any) => console.error(e));
  
  }
}
