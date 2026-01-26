export interface Room{
  reviews: any[];
  id: number;
  name?: string;
  description?: string;
  price?: number;
  capacity?: number;
  roomImages: RoomImage[];
  isAvailable?: boolean;
  
} 
export interface RoomImage {
  id: number;
  imageUrl: string;
  roomId: number;
}
