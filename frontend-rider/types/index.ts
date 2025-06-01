export interface RegisterFormData {
    name: string;
    email: string;
    phone_number: string;
}
export interface LoginFormData {
    name: string;
    email: string;
    phone_number: string;
}
export interface RiderProfile {
    id: number;
    name: string;
    email: string;
    phone_number?: string;
}
export interface FavouriteRide {
    id: number;
    source: string;
    destination: string;
    pickup_time: string;
    estimated_duration: string;
    distance: string;
    price: string;
    payment_mode: string;
    ride_rating: string;
    review_cleanliness: boolean;
    review_discipline: boolean;
    review_friendly: boolean;
    review_safety: boolean;
    review_arrive_on_time: boolean;
    status: boolean;
    favourite: boolean;
    rider: number;
    driver: number;
  };
  export type RiderData = {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    source: string;
    destination: string;
    source_latitude: number;
    source_longitude: number;
    source_details: string;
    destination_latitude: number;
    destination_longitude: number;
    destination_details: string;
    from: string;
    price:number;
    estimated_duration:number,
    distance:number
  };
  export interface DriverDetails {
    id: number;
    name: string;
    email: string;
    phone_number?: string;
    driving_license?: string;
    vehicle_plate?: string;
    vehicle_year?:string;
    rating?: number;
    from?:string;
  }