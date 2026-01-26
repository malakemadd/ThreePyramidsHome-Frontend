export interface Review {
  id: number;
  roomId: number;
  reviewerName: string;
  comment: string;
  rating: number;
  createdAt: Date;
}
