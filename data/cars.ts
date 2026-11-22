export type Car = {
  id: number;
  name: string;
  type: string;
  brand: string;
  image: string;
  price: number;
  fuel: string;
  transmission: string;
  seats: number;
  rating: number;
  fuelType: "Benzin" | "Dizel" | "Elektr";
  available: boolean;
  newArrival?: boolean;
  discount?: number;
};

export const cars: Car[] = [
  { id: 1, name: "Koenigsegg", type: "Sport", brand: "Mercedes", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85", price: 99, fuel: "90L", transmission: "Avtomat", seats: 2, rating: 4.9, fuelType: "Benzin", available: true, newArrival: true },
  { id: 2, name: "Nissan GT-R", type: "Sport", brand: "Toyota", image: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&q=85", price: 80, fuel: "80L", transmission: "Avtomat", seats: 2, rating: 4.8, fuelType: "Benzin", available: true, discount: 10 },
  { id: 3, name: "Rolls-Royce", type: "Sedan", brand: "Mercedes", image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=900&q=85", price: 96, fuel: "70L", transmission: "Avtomat", seats: 4, rating: 4.7, fuelType: "Benzin", available: true },
  { id: 4, name: "BMW M4", type: "Sport", brand: "BMW", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=85", price: 25, fuel: "90L", transmission: "Avtomat", seats: 4, rating: 4.9, fuelType: "Benzin", available: true, newArrival: true },
  { id: 5, name: "All New MG GS", type: "SUV", brand: "Jeep", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=85", price: 74, fuel: "80L", transmission: "Avtomat", seats: 6, rating: 4.6, fuelType: "Dizel", available: true, discount: 15 },
  { id: 6, name: "New MG ZX", type: "Hatchback", brand: "Toyota", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=85", price: 74, fuel: "70L", transmission: "Mexanika", seats: 5, rating: 4.5, fuelType: "Benzin", available: false },
  { id: 7, name: "Audi R8", type: "Kabriolet", brand: "Audi", image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=900&q=85", price: 92, fuel: "80L", transmission: "Avtomat", seats: 2, rating: 4.8, fuelType: "Benzin", available: true, discount: 12 },
  { id: 8, name: "Toyota Hilux", type: "Pikap", brand: "Ford", image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=900&q=85", price: 68, fuel: "90L", transmission: "Avtomat", seats: 5, rating: 4.6, fuelType: "Dizel", available: true },
  { id: 9, name: "Mercedes Vito", type: "Miniven", brand: "Mercedes", image: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=900&q=85", price: 88, fuel: "75L", transmission: "Avtomat", seats: 7, rating: 4.7, fuelType: "Dizel", available: true, newArrival: true },
];
