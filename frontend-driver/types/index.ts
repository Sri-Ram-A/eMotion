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
     total_rides?: number;     
      total_rating?: number;     
      earnings?: number;         
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
    price:number;
    estimated_duration:number,
    distance:number
<<<<<<< HEAD
  };
  export type HourlyTableEntry = {
    drop_locations: string[];
    hour: number;
    max_money: number;
  };
  
  export type PredictionData = {
    best_drop: string;
    best_hour: number;
    chart_type: string;
    hourly_table: HourlyTableEntry[];
  };
  
=======
  };
>>>>>>> 77904b7b670f6dbb80727df2ad00d583d198d858
