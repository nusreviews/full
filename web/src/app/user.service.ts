import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { User } from './user';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserService {

  constructor(private http: Http) { }

  // getUsers(): Promise<User[]> {
  //   return Promise.resolve(USERS);
  // }
  getUserById(userId: number): Promise<User> {
    return this.http.get('https://api.nusreviews.com/user/' + userId)
    .toPromise()
    .then(this.deserialiseJSONToUser)
    .catch(this.handleError);
  }

  private deserialiseJSONToUser(json): User {
		let jsonArray = json.json()['user'];
		let user = User.deserialiseJson(jsonArray);
		return user;
	}

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
