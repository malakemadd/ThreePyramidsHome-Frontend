import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Room } from '../../models/room-model';
import { RoomService } from '../../../services/RoomService';

@Component({
  selector: 'app-room-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './room-component.html',
  styleUrls: ['./room-component.css'],
})
export class RoomComponent implements OnInit {
  rooms: Room[] = [];      // Array to display all rooms
  loading: boolean = true; // Optional loading indicator

  constructor(private roomService: RoomService, private router: Router) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms() {
    this.loading = true;
    this.roomService.getRooms().subscribe({
      next: (data) => {
        this.rooms = data;  
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading rooms:', err);
        this.loading = false;
      },
    });
  }

  goToDetails(id: number) {
    this.router.navigate(['/room', id]);
  }
}
