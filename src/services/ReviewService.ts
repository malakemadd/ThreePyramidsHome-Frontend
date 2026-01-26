import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { Room } from '../app/models/room-model';
import { Review } from '../app/models/review-model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private apiUrlReview = 'https://localhost:7256/api/Review';

  constructor(private http: HttpClient) {}

  getReviews(): Observable<Review[]> {
     return this.http.get<Review[]>(`${this.apiUrlReview}/GetAllReviews`);
  }

   getReviewbyId(id: number): Observable<Review> {
     return this.http.get<Review>(`${this.apiUrlReview}/${id}`);
  }

  addReview(review: any): Observable<any> {
  return this.http.post(`${this.apiUrlReview}/AddReview`, review);
}
  

  updateReview(id: number, review: Review): Observable<any> {
    return this.http.put(`${this.apiUrlReview}/Update/${id}`, review);
  }
  deleteReview(id: number) {
    return this.http.delete(`${this.apiUrlReview}/Delete/${id}`);
  }
 


}