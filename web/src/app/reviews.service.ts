import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Review } from './review';
import { REVIEWS } from './mock-reviews';
import 'rxjs/add/operator/toPromise';
import { Observable, Subject } from 'rxjs';
import { LoginService } from './login.service';
import { MzToastService } from 'ng2-materialize';

@Injectable()
export class ReviewsService {

	private reviewsObservable = new Subject<Object>();
	
	constructor(
		private http: Http,
		private loginService: LoginService,
		private toastService: MzToastService,
	) { }
	
	// Retrieves list of reviews
	// If modId != null, returns a list of reviews for that module
	// If userId != null, returns a list of reviews, with information on whether
	// the input userId has liked the reviews or not.
	getReviews(modId: string, userId: number, offset: number, limit: number): Promise<Review[]> {
		let url = 'https://api.nusreviews.com/getReviews?';
		
		if (modId != null) {
			url = url + '&module=' + modId;
		}
		
		if (userId != null) {
			url = url + '&likedBy=' + userId;
		}

		url = url + "&offset=" + offset + "&limit=" + limit;

		//console.log(url);

		return this.http.get(url)
        .toPromise()
        .then(this.deserialiseJSONToReviews) 
        .catch(this.handleError);
	}

	// Return list of reviews written by the input user
	getReviewsByUserId(userId: number, offset: number, limit: number): Promise<Review[]> {
		var url = 'https://api.nusreviews.com/getReviews?user=' + userId + "&offset=" + offset + "&limit=" + limit;
		if (this.loginService.getProfile()) {
			url += "&likedBy=" + this.loginService.getProfile().nusreviews.userId;
		}
		return this.http.get(url)
        .toPromise()
        .then(this.deserialiseJSONToReviews)
        .catch(this.handleError);
	}

	getReviewsByUserIdByModuleId(userId: number, moduleId: string): Promise<Review> {
		return this.http.get('https://api.nusreviews.com/getReviews?user=' + userId + "&module=" + moduleId)
		.toPromise()
		.then(this.deserialiseJSONToReview)
		.catch(this.handleError);
	}

	getReviewsSlowly(modId: string, userId: number, offset: number, limit: number): Promise<Review[]> {
		return new Promise(resolve => {
			// Simulate server latency with 1 second delay
			setTimeout(() => resolve(this.getReviews(modId, userId, offset, limit)), 1000);
		});
	}

	postNewReview(newReview) {
		this.loginService.secureApiPost("https://api.nusreviews.com/review/new", JSON.stringify(newReview)).then((res) => {
			//console.log(res.json()['status']);
			if (res.json()['status'] == 'success') {
				this.reviewsObservable.next({type: "new"});
				this.showToast('Review Submitted!', 3000, 'green');
			} else if (res.json()['status'] == 'error') {
				this.showToast('An error occured!', 3000, 'red');
			}	
		});
	}

	postEditReview(editReview) {
		this.loginService.secureApiPost("https://api.nusreviews.com/review/edit", JSON.stringify(editReview)).then((res) => {
			if (res.json()['status'] == 'success') {
				this.reviewsObservable.next({type: "edit"});
				this.showToast('Changes Submitted!', 3000, 'green');
			} else if (res.json()['status'] == 'error') {
				this.showToast('An error occured!', 3000, 'red');
			}	
		});
	}

	getReviewsObservable(): Observable<Object> {
		return this.reviewsObservable.asObservable();
	}

	private deserialiseJSONToReviews(json): Review[] {
		let jsonArray = json.json()['reviews'];
		let reviews = jsonArray.map(reviewJSON => {
			let deserialisedReview = Review.deserialiseJson(reviewJSON);
			return deserialisedReview;
		});
		//console.log(reviews);
		return reviews;
	}

	private deserialiseJSONToReview(json): Review {
		let jsonArray = json.json()['reviews'];
		let reviews: Review[] = jsonArray.map(reviewJSON => {
			let deserialisedReview = Review.deserialiseJson(reviewJSON);
			return deserialisedReview;
		});
		//console.log(reviews);
		if (reviews.length > 0) {
			return reviews[0];
		} else {
			return null;
		}
	}

	private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
	}

	private showToast(msg, time, color) {
		this.toastService.show(msg, time, color);
	  }
}

