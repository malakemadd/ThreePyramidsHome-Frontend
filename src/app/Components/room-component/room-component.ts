import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Room } from '../../models/room-model';
import { RoomService } from '../../../services/RoomService';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { environment } from '../../../environments/environments.prod';
@Component({
  selector: 'app-room-component',
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './room-component.html',
  styleUrls: ['./room-component.css'],
})
export class RoomComponent {
  constructor(private roomService: RoomService,private router: Router, private cdr: ChangeDetectorRef) {}
  rooms$!: Observable<Room[]>;
  rooms: Room[] = [];
// rooms = [
//   {
//     id: 1,
//     name: 'Deluxe Suite',
//     description: 'Spacious suite with pyramid view, king bed, and private balcony.',
//     price: '$250/night',
//    // image: 'assets/room1.jpg'
//   },
//   {
//     id: 2,
//     name: 'Classic Room',
//     description: 'Comfortable room with modern amenities and city view.',
//     price: '$150/night',
//    // image: 'assets/room2.jpg'
//   },
//   {
//     id: 3,
//     name: 'Family Suite',
//     description: 'Large suite perfect for families, includes two bedrooms.',
//     price: '$300/night',
//    // image: 'assets/room3.jpg'
//   }
// ];
loadRooms() {
    this.roomService.getRooms().subscribe({
      next: data => this.rooms = data,
      error: err => console.error(err)
    });
  }

private apiUrl = environment.apiUrl;
 getRoomImageUrl(room: any): string {
  
  if (room.roomImages && room.roomImages.length > 0) {
    const domainOnly = this.apiUrl.replace('/api', ''); 
      return domainOnly + room.roomImages[0].imageUrl;
    //return this.backendBaseUrl + room.roomImages[0].imageUrl;
  }
  return '1.jpeg'; 
}

goToDetails(id: number) {
    this.router.navigate(['/room', id]);
  }
ngOnInit(): void {
 this.rooms$ = this.roomService.getRooms();
}


}
