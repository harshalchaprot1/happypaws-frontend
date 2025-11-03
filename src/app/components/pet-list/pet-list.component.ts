import { Component, OnInit } from '@angular/core';
import { Pet } from '../../models/pet.model';
import { PetService } from '../../services/pet.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pet-list.component.html',
  styleUrl: './pet-list.component.css'
})
export class PetListComponent implements OnInit {
  pets: Pet[] = [];
  searchText = '';

  constructor(private petService: PetService) {}

  ngOnInit(): void {
    this.petService.getPets().subscribe((data) => {
      this.pets = data;
    });
  }

  adoptPet(id: number): void {
    this.petService.markAsAdopted(id).subscribe({
      next: () => {
        this.pets = this.pets.map(p =>
          p.id === id ? { ...p, status: 'ADOPTED' } : p
        );
      },
      error: err => console.error('Failed to adopt pet:', err)
    });
  }

  deletePet(id?: number): void {
    if (!id) return;
    this.petService.deletePet(id).subscribe({
      next: () => {
        this.pets = this.pets.filter(p => p.id !== id);
      },
      error: err => console.error('Failed to delete pet:', err)
    });
  }

  get filteredPets(): Pet[] {
    return this.pets.filter(p =>
      (p.name + p.breed).toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}
