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