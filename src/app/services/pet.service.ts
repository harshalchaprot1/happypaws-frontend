// services/pet.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pet } from '../models/pet.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PetService {
  private apiUrl = 'http://localhost:8080/api/pets';

  constructor(private http: HttpClient) { }


  getPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(this.apiUrl);
  }


  addPet(pet: Pet): Observable<Pet> {
    return this.http.post<Pet>(this.apiUrl, pet);
  }

  updatePet(id: number, pet: Pet): Observable<Pet> {
    return this.http.put<Pet>(`${this.apiUrl}/${id}`, pet);
  }

  markAsAdopted(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/adopt`, {});


  }

}
