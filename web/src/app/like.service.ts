import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { MzToastService } from 'ng2-materialize';
import { Observable, Subject } from 'rxjs';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class LikeService {

  private likeObservable = new Subject<Object>();

  constructor(
    private loginService: LoginService,
    private toastService: MzToastService,
  ) { }

  likeReview(reviewId) {
    if (!this.userIsLoggedIn()) {
      this.toastService.show("Please Login first!", 3000, 'red');
      this.likeObservable.next({ reviewId: reviewId, ready: true, effect: 'none'});
      return;
    }

    var likeBody = {
      reviewId: reviewId,
    };
    
    this.loginService.secureApiPost("https://api.nusreviews.com/like/new", JSON.stringify(likeBody)).then((res) => {
      this.likeObservable.next({ reviewId: reviewId, ready: true, effect: 'like'})
      if (res.json()['status'] == 'success') {
        this.toastService.show("You've liked a review!", 3000, 'green');
      } else {
        this.toastService.show("An error occured!", 3000, 'red');
      }
    });
  }

  unlikeReview(reviewId) {
    if (!this.userIsLoggedIn()) {
      // Shouldn't happen
      this.toastService.show("Please Login first!", 3000, 'red');
      this.likeObservable.next({ reviewId: reviewId, ready: true, effect: 'none'});
      return;
    }

    this.loginService.secureApiDelete("https://api.nusreviews.com/like/" + reviewId).then((res) => {
      this.likeObservable.next({ reviewId: reviewId, ready: true, effect: 'unlike'})
      if (res.json()['status'] == 'success') {
        this.toastService.show("You've unliked a review!", 3000, 'darkyellow');
      } else {
        this.toastService.show("An error occured!", 3000, 'red');
      }
    });
    
  }

  getLikeObservable(): Observable<Object> {
		return this.likeObservable.asObservable();
	}

  private userIsLoggedIn(): boolean {
    if (this.loginService.getProfile()) {
      return true;
    } else {
      return false;
    }
  }
}
