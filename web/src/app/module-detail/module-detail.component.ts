import { Component, OnInit, Input } from '@angular/core';
import { Module } from '../module';
import { Review } from '../review';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { ModuleService } from '../module.service';
import { ReviewsService } from '../reviews.service';
import { LoginService } from '../login.service';
import { ModuleReviewFormComponent } from '../module-review-form/module-review-form.component';
import { Subscription } from 'rxjs';

const pageSize = 10;

@Component({
  selector: 'app-module-detail',
  templateUrl: './module-detail.component.html',
  styleUrls: ['./module-detail.component.css']
})
export class ModuleDetailComponent implements OnInit {
  @Input() module: Module;
  @Input() reviews: Review[];
  public loading = true;
  public userReview: Review = null;
  private isLoggedInSubscription: Subscription;
  private reviewsSubscription: Subscription;
  private page: number = 0;
  private canScroll = false;

  constructor(
    private moduleService: ModuleService,
    private loginService: LoginService,
    private reviewsService: ReviewsService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { 
    this.loginService = loginService;
    this.isLoggedInSubscription = this.loginService.getLoggedInObservable().subscribe(isLoggedIn => {
      this.reviews = null;
      this.loading = true;
      this.page = 0;
      if (isLoggedIn) {
        this.fetchReviews(this.loginService.getProfile().nusreviews.userId);
        this.fetchUserReview(this.loginService.getProfile().nusreviews.userId);
      } else {
        this.fetchReviews(null);
        this.userReview = null; // If log out, revert form back to "write review".
      }
    });
    // Listen for updates to review list
    this.reviewsSubscription = this.reviewsService.getReviewsObservable().subscribe(next => {
      this.initFetchReviews();
      this.fetchUserReview(this.loginService.getProfile().nusreviews.userId);
    })
  }

  ngOnInit(): void {
    // Fetch Module from url
    this.route.paramMap
      .switchMap((params: ParamMap) => this.moduleService.getModulesById(params.get('id'), true, 0, 1))
      .subscribe(modules => {
        if (modules.length > 0) {
          this.module = modules[0];
          //console.log(this.module);
          if (this.loginService.getProfile()) {
            // If user is already logged in
            this.fetchReviews(this.loginService.getProfile().nusreviews.userId);
            this.fetchUserReview(this.loginService.getProfile().nusreviews.userId);
          } else {
            this.fetchReviews(null);
          }
        } else {
          // Reroute out if module is not found
          this.router.navigate(['/404']);
        }
      });
  }

  initFetchReviews() {
    //Reinit
    this.loading = true;
    this.page = 0;
    this.reviews = null;
    this.canScroll = false;
    // Fetch
    this.route.paramMap
    .switchMap((params: ParamMap) => this.moduleService.getModulesById(params.get('id'), true, 0, 1))
    .subscribe(modules => {
      if (modules.length > 0) {
        this.module = modules[0];
        //console.log(this.module);
        if (this.loginService.getProfile()) {
          // If user is already logged in
          this.fetchReviews(this.loginService.getProfile().nusreviews.userId);
        } else {
          this.fetchReviews(null);
        }
      } else {
        // Reroute out if module is not found
        this.router.navigate(['/404']);
      }
    });
  }

  onScroll() {
    if (this.canScroll && !this.loading) {
      //console.log("onscroll");
      this.page += 1;
      this.loading = true;
      if (this.loginService.getProfile()) {
        this.concatReviews(this.loginService.getProfile().nusreviews.userId);
      } else {
        this.concatReviews(null);
      }
    }
  }

  private fetchReviews(userId: number) {
    this.reviewsService.getReviews(this.module.id, userId,
                                  this.page * pageSize, pageSize)
    .then(reviews => {
      this.reviews = reviews;
      this.loading = false;
      if (reviews.length < pageSize) {
        this.canScroll = false;
      } else {
        this.canScroll = true;
      }
    })
  }

  private fetchUserReview(userId: number) {
    this.reviewsService.getReviewsByUserIdByModuleId(userId, this.module.id)
    .then(review => {
      this.userReview = review;
    })
  }

  private concatReviews(userId: number) {
    this.reviewsService.getReviews(this.module.id, userId, this.page * pageSize, pageSize)
    .then(reviews => {
      this.reviews = this.reviews.concat(reviews);
      this.loading = false;
      if (reviews.length == 0) {
        this.canScroll = false;
      }
    })
  }
}

