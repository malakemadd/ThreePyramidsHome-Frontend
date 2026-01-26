import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { Room } from '../app/models/room-model';
import { Review } from '../app/models/review-model';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private apiUrl = `${environment.apiUrl}/Review`;
  constructor(private http: HttpClient) {}

  getReviews(): Observable<Review[]> {
     return this.http.get<Review[]>(`${this.apiUrl}/GetAllReviews`);
  }

   getReviewbyId(id: number): Observable<Review> {
     return this.http.get<Review>(`${this.apiUrl}/${id}`);
  }

  addReview(review: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/AddReview`, review);
}
  

  updateReview(id: number, review: Review): Observable<any> {
    return this.http.put(`${this.apiUrl}/Update/${id}`, review);
  }
  deleteReview(id: number) {
    return this.http.delete(`${this.apiUrl}/Delete/${id}`);
  }
 


}