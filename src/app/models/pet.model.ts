// src/app/models/pet.model.ts
export interface Pet {
  id?: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  description: string;
  imageUrl: string;
  status: string;
  addedBy: number;
  createdAt: string;
  type: string | null;
}
