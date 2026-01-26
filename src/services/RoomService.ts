import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { Room } from '../app/models/room-model';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private apiUrlReview = `${environment.apiUrl}/Review`;
  private apiUrlRoom = `${environment.apiUrl}/Room`;

  constructor(private http: HttpClient) {}

  getRooms(): Observable<Room[]> {
     return this.http.get<Room[]>(`${this.apiUrlRoom}/GetAllRooms`);
  }
   getRoomById(id: number): Observable<any> {
     return this.http.get<Room>(`${this.apiUrlRoom}/${id}`);
  }

  deleteRoom(id: number) {
    return this.http.delete(`${this.apiUrlRoom}/Delete/${id}`);
  }
  addRoom(formData: FormData): Observable<Room> {
  return this.http.post<Room>(`${this.apiUrlRoom}/AddRoom`, formData);
}

updateRoom(id: number, formData: FormData): Observable<Room> {
  return this.http.put<Room>(`${this.apiUrlRoom}/Update/${id}`, formData);
}
 

addReview(review: any): Observable<any> {
  return this.http.post(`${this.apiUrlReview}/AddReview`, review);
}

}