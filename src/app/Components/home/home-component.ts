import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import * as L from 'leaflet';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Room } from '../../models/room-model';
import { RoomService } from '../../../services/RoomService';
import { ReviewService } from '../../../services/ReviewService';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent implements AfterViewInit {
  lat: number = 29.977722162474198;
  lng: number = 31.102350396190168;

 private apiUrl = environment.apiUrl;
 

  rooms: Room[] = []; 
constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private cdr: ChangeDetectorRef,
    private reviewService: ReviewService
  ) {}
  ngAfterViewInit(): void {
   this.roomService.getRooms().subscribe({
      next: (data) => {
        this.rooms = data;
        this.cdr.detectChanges();
      }
    });
    const map = L.map('hotelMap', {
      scrollWheelZoom: false
    }).setView([this.lat, this.lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    
    const customIcon = L.icon({
      iconUrl: 'logo-transparent.png', 
      iconSize: [35, 35],
      iconAnchor: [25, 50],
      popupAnchor: [0, -45]
    });

    L.marker([this.lat, this.lng], { icon: customIcon })
      .addTo(map)
      .bindPopup('<strong>Three Pyramids Home</strong><br>Your sanctuary in Giza.')
      .openPopup();
  }
  getRoomImageUrl(room: any): string {
  if (room.roomImages && room.roomImages.length > 0) {
    const domainOnly = this.apiUrl.replace('/api', ''); 
      return domainOnly + room.roomImages[0].imageUrl;
    //return this.backendUrl + room.roomImages[0].imageUrl;
  }
  return '1.jpeg';  
}
}