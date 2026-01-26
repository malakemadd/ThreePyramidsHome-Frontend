import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { RoomService } from '../../../services/RoomService';
import { Room } from '../../models/room-model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule,ActivatedRoute,Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
@Component({
  selector: 'app-admin-dashboard-component',
  templateUrl: './admin-dashboard-component.html',
  styleUrls: ['./admin-dashboard-component.css'],
 
  imports: [CommonModule, FormsModule, RouterModule]
})
export class AdminDashboardComponent implements OnInit {
  rooms: Room[] = [];
  currentRoom: Room = {} as Room;
  isEditMode = false;
  showForm = false;
  selectedImageFile: File[]  = [];
  previewUrls: string[] = [];
 private apiUrl = environment.apiUrl;


  constructor(private roomService: RoomService, private cdr: ChangeDetectorRef, private router: Router,private ngZone: NgZone,private route: ActivatedRoute,private http: HttpClient) {}

 ngOnInit(): void {
  const token = localStorage.getItem('admin_token');

  if (!token) {
    this.denyAccess();
    return;
  }

  this.http.get(
    `${this.apiUrl}/Room/validate-admin`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  ).subscribe({
    next: () => {
      this.loadRooms(); 
      this.cdr.detectChanges();
    },
    error: () => this.denyAccess()
  });
}

private denyAccess() {
  alert('Admin access denied');
  this.router.navigate(['/']);
}


 loadRooms() {
  this.roomService.getRooms().subscribe({
    next: data => {
      this.rooms = data;
      this.cdr.detectChanges(); 
    },
    error: err => console.error(err)
  });
}

  toggleAddForm() {
    this.isEditMode = false;
    this.showForm = true;
    this.currentRoom = {} as Room;
    this.selectedImageFile = [];
    this.previewUrls = [];
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleEditForm(room: Room) {
    this.isEditMode = true;
    this.showForm = true;
    this.currentRoom = { ...room };
    this.selectedImageFile = [];
    this.previewUrls = [];
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelForm() {
    this.showForm = false;
    this.currentRoom = {} as Room;
    this.selectedImageFile = [];
    this.previewUrls = [];
  }

 onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    const files = Array.from(input.files);

    files.forEach(file => {
      // 1. Add to our file array for uploading
      this.selectedImageFile.push(file);

      // 2. Generate preview for this specific file
      const reader = new FileReader();
      reader.onload = () => {
        this.ngZone.run(() => {
          this.previewUrls.push(reader.result as string);
        });
       
      };
      reader.readAsDataURL(file);
    });

    // Reset the input value so the user can select the same file again if they want
    input.value = '';
  }
}

  saveRoom() {
    const formData = new FormData();
    formData.append('name', this.currentRoom.name?this.currentRoom.name : ''  );
    formData.append('description', this.currentRoom.description? this.currentRoom.description : '');
    formData.append('capacity', String(this.currentRoom.capacity? this.currentRoom.capacity : 1));
    formData.append('isAvailable', String(this.currentRoom.isAvailable? this.currentRoom.isAvailable : true));
    formData.append('price', String(this.currentRoom.price? this.currentRoom.price : 10));

    this.selectedImageFile.forEach(file => {
    formData.append('imageFile', file); //  matches Backend parameter name
  });

    const action = this.isEditMode
      ? this.roomService.updateRoom(this.currentRoom.id, formData)
      : this.roomService.addRoom(formData);

    action.subscribe({
      next: () => this.afterSave(),
      error: err => alert('Operation failed: ' + err.message)
    });
  }

  afterSave() {
    this.loadRooms();
    this.showForm = false;
    this.selectedImageFile = [];
    this.previewUrls = [];
  }
   getRoomImageUrl(room: any): string {
  if (room.roomImages && room.roomImages.length > 0) {
    return this.apiUrl + room.roomImages[0].imageUrl;
  }
  return 'room.jpeg'; 
}

  deleteRoom(id: number) {
    if (!confirm('Are you sure?')) return;

    this.roomService.deleteRoom(id).subscribe(() => {
      this.rooms = this.rooms.filter(r => r.id !== id);
    });
  }
removeImage(index: number) {
  // Remove the file and the preview at the same index
  this.selectedImageFile.splice(index, 1);
  this.previewUrls.splice(index, 1);
}
  getRoomImage(room: Room): string {
    return room.roomImages?.length ? room.roomImages[0].imageUrl : '/assets/default-room.jpg';
  }
}
