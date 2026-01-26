import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Room } from '../../models/room-model';
import { RoomService } from '../../../services/RoomService';
import { Review } from '../../models/review-model';
import { ReviewService } from '../../../services/ReviewService';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments.prod';

declare var bootstrap: any;

@Component({
  selector: 'app-room-details-component',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './room-details-component.html',
  styleUrls: ['./room-details-component.css'],
})
export class RoomDetailsComponent implements OnInit {
  room!: Room;
  
  currentImageIndex = 0;
  newReview = { author: '', rating: 5, comment: '' };

  // Pagination
  currentPage = 1;
  reviewsPerPage = 3;

  isAdmin = false;


  // Backend
  
 private apiUrl = environment.apiUrl;
 private domainOnly = environment.apiUrl.replace('/api', '');
  // Shared Facilities
  sharedFacilities = [
    {
      name: 'Shared Kitchen',
      description: 'Fully equipped kitchen accessible to all guests.',
      images: ['kitchen1.jpeg', 'kitchen2.jpeg','kitchen3.jpeg','1.jpeg','2.jpeg','3.jpeg','4.jpeg','5.jpeg','6.jpeg','7.jpeg','8.jpeg','9.jpeg','10.jpeg']
    },
    {
      name: 'Dining Area',
      description: 'Comfortable dining lounge for guests.',
      images: ['11.jpeg', '12.jpeg','13.jpeg','14.jpeg','15.jpeg']
    },
    {
      name: 'Beverage Corner',
      description: 'Refreshments and beverages available 24/7.',
      images: ['16.jpeg','17.jpeg','18.jpeg','19.jpeg','20.jpeg']
    },
    {
      name: 'Laundry Area',
      description: 'Self-service laundry available for guests.',
      images: ['21.jpeg', '22.jpeg','23.jpeg','24.jpeg','25.jpeg','26.jpeg','27.jpeg']
    }
  ];


  // Shared gallery modal
  currentSharedIndex = 0;
  currentSharedImages: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private cdr: ChangeDetectorRef,
    private reviewService: ReviewService,
    private http: HttpClient,

  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('admin_token');

  if (token) {
    this.http.get(
      `${this.apiUrl}/Room/validate-admin`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({
      next: () => this.isAdmin = true,
      error: () => this.isAdmin = false
    });
  }
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.roomService.getRoomById(id).subscribe({
      next: (data) => {
        this.room = data;
        this.room.roomImages = this.room.roomImages ?? [];
        this.room.reviews = this.room.reviews ?? [];
        this.loadReviewsForRoom(id);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load room', err)
    });
  }

  // Room Images
  getImageUrl(imageUrl?: string): string {
    return imageUrl ? `${this.domainOnly}${imageUrl}` : '';
  }
deleteReview(reviewId: number): void {
  if (!confirm('Delete this review?')) return;

  const token = localStorage.getItem('admin_token');

  this.http.delete(
    `${this.apiUrl}/Review/Delete/${reviewId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  ).subscribe({
    next: () => {
      this.room.reviews =
        this.room.reviews.filter(r => r.id !== reviewId);
    },
    error: () => alert('Failed to delete review')
  });
}

  getRoomImageUrl(room: any): string {
    if (room.roomImages && room.roomImages.length > 0) {
      return this.domainOnly + room.roomImages[0].imageUrl;
    }
    return 'room.jpeg'; 
  }

  selectImage(i: number): void { this.currentImageIndex = i; }
  prevImage(): void {
    if (!this.room?.roomImages?.length) return;
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.room.roomImages.length) % this.room.roomImages.length;
  }
  nextImage(): void {
    if (!this.room?.roomImages?.length) return;
    this.currentImageIndex =
      (this.currentImageIndex + 1) % this.room.roomImages.length;
  }

  // Reviews
  loadReviewsForRoom(roomId: number) {
    this.reviewService.getReviews().subscribe({
      next: (allReviews: Review[]) => {
        this.room.reviews = allReviews.filter(rev => rev.roomId === roomId);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching reviews:', err)
    });
  }

  get averageRating(): number {
    const reviews = this.room?.reviews ?? [];
    if (!reviews.length) return 0;
    return reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length;
  }

  get averageRatingRounded(): number {
    return Math.round(this.averageRating);
  }

  addReview(): void {
    if (!this.room || !this.newReview.author.trim() || !this.newReview.comment.trim()) return;

    const reviewToSave: Partial<Review> = {
      roomId: this.room.id,
      reviewerName: this.newReview.author,
      comment: this.newReview.comment,
      rating: this.newReview.rating,
      createdAt: new Date()
    };

    this.reviewService.addReview(reviewToSave).subscribe({
      next: (savedReview: Review) => {
        this.room.reviews = [...(this.room.reviews ?? []), savedReview];
        this.currentPage = 1;
        this.newReview = { author: '', rating: 5, comment: '' };
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to save review', err);
        alert('Error saving review. Please try again.');
      }
    });
  }

  // Reviews Pagination
  get totalPages(): number {
    return Math.ceil((this.room?.reviews?.length || 0) / this.reviewsPerPage);
  }

  get paginatedReviews(): Review[] {
    if (!this.room?.reviews) return [];
    const start = (this.currentPage - 1) * this.reviewsPerPage;
    return this.room.reviews.slice(start, start + this.reviewsPerPage);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  nextPage(): void { if (this.currentPage < this.totalPages) this.currentPage++; }
  prevPage(): void { if (this.currentPage > 1) this.currentPage--; }

  // Shared Facilities Gallery
  openSharedGallery(index: number = 0) {
    this.currentSharedImages = this.sharedFacilities[index]?.images ?? [];
    this.currentSharedIndex = 0;
    const modal = new bootstrap.Modal(document.getElementById('sharedGalleryModal'));
    modal.show();
  }

  prevSharedImage() {
    if (!this.currentSharedImages?.length) return;
    this.currentSharedIndex =
      (this.currentSharedIndex - 1 + this.currentSharedImages.length) % this.currentSharedImages.length;
  }

  nextSharedImage() {
    if (!this.currentSharedImages?.length) return;
    this.currentSharedIndex =
      (this.currentSharedIndex + 1) % this.currentSharedImages.length;
  }
}
