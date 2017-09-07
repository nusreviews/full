import { Component, OnInit, Input } from '@angular/core';
import { Review } from '../review';
import { FbLoginModalComponent } from '../fb-login-modal/fb-login-modal.component';
import { MzModalService } from 'ng2-materialize';
import { LikeService } from '../like.service';
import { LoginService } from '../login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'like-button',
  templateUrl: './like-button.component.html',
  styleUrls: ['./like-button.component.css']
})
export class LikeButtonComponent implements OnInit {

  isActive: boolean;
  iconName: string;
  numLikes: number;

  likeSubscription: Subscription;
  isLikeReady: boolean = true;

  @Input() review: Review;

  constructor(
    private likeService: LikeService,
    private loginService: LoginService,
    private modalService: MzModalService,
  ) { }

  ngOnInit() {
    this.numLikes = this.review.numLikes;
    this.isActive = this.review.hasUserLiked;
    if (this.isActive) {
      this.iconName = 'favorite';
    } else {
      this.iconName = 'favorite_border';
    }
    this.likeSubscription = this.likeService.getLikeObservable().subscribe(res => {
      // Check if review Id is this review's
      if (res['reviewId'] != this.review.id) {
        return;
      }
      
      if (res['ready']) {
        this.isLikeReady = true;
      }
      if (res['effect'] == 'like') {
        this.iconName = "favorite"; 
        this.numLikes += 1;
      } else if (res['effect'] == 'unlike') {
        this.iconName = "favorite_border";
        this.numLikes -= 1;
      }
    })
  }

  onClick(): void {
    if (!this.loginService.getProfile()) {
      this.modalService.open(FbLoginModalComponent);
      return;
    }

    this.isActive = !this.isActive;

    if (this.isActive) {
      this.like();

    } else {
      this.unlike();
    }

  }

  private like() {
    if (this.isLikeReady) {
      this.isLikeReady = false;
      this.likeService.likeReview(this.review.id);
    }
  }

  private unlike() {
    if (this.isLikeReady) {
      this.isLikeReady = false;
      this.likeService.unlikeReview(this.review.id);
    }
  }

}
