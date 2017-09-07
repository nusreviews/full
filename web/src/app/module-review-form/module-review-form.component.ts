import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { LoginService } from '../login.service';
import { ReviewsService } from '../reviews.service';
import { MzModalService } from 'ng2-materialize';
import { FbLoginModalComponent } from '../fb-login-modal/fb-login-modal.component';
import { Router } from '@angular/router';
import { forEach } from 'lodash';
import { Subscription } from 'rxjs';

import { Module } from '../module';
import { Review } from '../review';

@Component({
  selector: 'module-review-form',
  templateUrl: './module-review-form.component.html',
  styleUrls: ['./module-review-form.component.css'],
})
export class ModuleReviewFormComponent implements OnInit {

  @ViewChild('staff_quality_rating') staffQualityRating;
  @ViewChild('module_difficulty_rating') moduleDifficultyRating;
  @ViewChild('module_enjoyability_rating') moduleEnjoyabilityRating;
  @ViewChild('module_workload_rating') moduleWorkloadRating;
  @ViewChild('comments') comments;

  @Input() module: Module;
  @Input() userReview: Review;

  public submitDisabled = true;
  public recommend: boolean = null;
  public loading: boolean = false;
  public changesDetected: boolean = false;
  public recommendChangesDetected: boolean = false;
  private reviewsSubscription: Subscription;

  constructor(
    private loginService: LoginService,
    private reviewsService: ReviewsService,
    private modalService: MzModalService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.reviewsSubscription = this.reviewsService.getReviewsObservable().subscribe(next => {
      this.loading = false;
    })
  }

  onRatingChange(event) {
    // Check if form is ready
    if (this.checkFormIsReady()) {
      this.submitDisabled = false;
    }
  }

  onRatingChangeEdit(event) {
    this.changesDetected = this.checkForChanges();
  }

  onCommentsEdit() {
    this.changesDetected = this.checkForChanges();
  }

  setRecommend(recommend) {
    // Skip check if is for edit
    if (this.userReview) {
      if (this.userReview != recommend) {
        this.recommendChangesDetected = !this.recommendChangesDetected;
        this.userReview.isRecommend = recommend;
        this.changesDetected = this.checkForChanges();
      }
      return;
    }

    this.recommend = recommend;
    if(this.checkFormIsReady()) {
      this.submitDisabled = false;
    }
  }

  checkFormIsReady(): boolean {
    var unfilledRatingNames = [];
    var ratingNamesToValue = {};
    forEach([this.staffQualityRating, this.moduleDifficultyRating, this.moduleEnjoyabilityRating, this.moduleWorkloadRating], 
      (rating, ratingName) => {
      // Skip non-rating keys
      //if (ratingName != "staffQualityRating" || ratingName != "moduleDifficultyRating"
      //   || ratingName != "moduleEnjoyabilityRating" || ratingName != "moduleWorkloadRating") {
      //  return;
      //}

      var ratingValue = rating.ratingAsInteger;
      if (ratingValue === 0) {
        unfilledRatingNames.push(ratingName);
      }
      ratingNamesToValue[ratingName] = ratingValue;
    });

    if (unfilledRatingNames.length > 0) {
      return false;
    }
    if (this.recommend == null) {
      return false;
    }
    
    return true;
  }

  checkForChanges(): boolean {
    if (this.staffQualityRating.ratingAsInteger != this.userReview.teachingTeamRating) {
      return true;
    }
    if (this.moduleDifficultyRating.ratingAsInteger != this.userReview.difficultyRating) {
      return true;
    }
    if (this.moduleEnjoyabilityRating.ratingAsInteger != this.userReview.enjoyabilityRating) {
      return true;
    }
    if (this.moduleWorkloadRating.ratingAsInteger != this.userReview.workloadRating) {
      return true;
    }
    if (this.comments.nativeElement.value != this.userReview.comments) {
      return true;
    }
    return this.recommendChangesDetected;
  }

  onSubmit() {
    // Check for login to FB first
    if (!this.loginService.getProfile()) {
      this.modalService.open(FbLoginModalComponent);
      return;
    }

    // Check if form is ready
    if (this.checkFormIsReady()) {
      var newReview = {
        teaching: this.staffQualityRating.ratingAsInteger,
        difficulty: this.moduleDifficultyRating.ratingAsInteger,
        enjoyability: this.moduleEnjoyabilityRating.ratingAsInteger,
        workload: this.moduleWorkloadRating.ratingAsInteger,
        recommend: this.recommend,
        comments: this.comments.nativeElement.value,
        modId: this.module.id,
      };
      this.reviewsService.postNewReview(newReview);
      // Engage loading block
      this.loading = true;
    }
  }

  saveChanges() {
    // Check for login to FB first
    if (!this.loginService.getProfile()) {
      this.modalService.open(FbLoginModalComponent);
      return;
    }

    var editReview = {
      teaching: this.staffQualityRating.ratingAsInteger,
      difficulty: this.moduleDifficultyRating.ratingAsInteger,
      enjoyability: this.moduleEnjoyabilityRating.ratingAsInteger,
      workload: this.moduleWorkloadRating.ratingAsInteger,
      recommend: this.userReview.isRecommend,
      comments: this.comments.nativeElement.value,
      modId: this.module.id,
    };

    this.reviewsService.postEditReview(editReview);
    // Engage loading block
    this.loading = true;
  }
}
