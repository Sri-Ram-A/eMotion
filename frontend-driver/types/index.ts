export interface RegisterFormData {
    name: string;
    email: string;
    phone_number: string;
    vehicle_year: string;
    vehicle_plate: string;
    driving_license: string;
}
export interface LoginFormData {
    name: string;
    email: string;
    phone_number: string;
}
export interface DriverProfile {
    id: number;
    name: string;
    email: string;
    phone_number?: string;
    driving_license?: string;
    vehicle_plate?: string;
    vehicle_year?:string;
    rating?: number;
  }
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
  };
  