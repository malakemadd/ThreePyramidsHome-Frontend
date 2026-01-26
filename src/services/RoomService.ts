import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { Room } from '../app/models/room-model';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private apiUrl = 'https://localhost:7256/api/Room';
  private apiUrlReview = 'https://localhost:7256/api/Review';

  constructor(private http: HttpClient) {}

  getRooms(): Observable<Room[]> {
     return this.http.get<Room[]>(`${this.apiUrl}/GetAllRooms`);
  }
   getRoomById(id: number): Observable<any> {
     return this.http.get<Room>(`${this.apiUrl}/${id}`);
  }

  deleteRoom(id: number) {
    return this.http.delete(`${this.apiUrl}/Delete/${id}`);
  }
  addRoom(formData: FormData): Observable<Room> {
  return this.http.post<Room>(`${this.apiUrl}/AddRoom`, formData);
}

updateRoom(id: number, formData: FormData): Observable<Room> {
  return this.http.put<Room>(`${this.apiUrl}/Update/${id}`, formData);
}
 

addReview(review: any): Observable<any> {
  return this.http.post(`${this.apiUrlReview}/AddReview`, review);
}

}