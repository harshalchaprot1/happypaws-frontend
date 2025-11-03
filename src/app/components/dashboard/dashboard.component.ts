import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { PetService } from '../../services/pet.service';
import { Pet } from '../../models/pet.model';

interface DashboardStats {
  totalPets: number;
  availablePets: number;
  adoptedPets: number;
  pendingPets: number;
  dogs: number;
  cats: number;
  birds: number;
  others: number;
}

interface BreedCount {
  breed: string;
  count: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatChipsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  loading = false;
  stats: DashboardStats = {
    totalPets: 0,
    availablePets: 0,
    adoptedPets: 0,
    pendingPets: 0,
    dogs: 0,
    cats: 0,
    birds: 0,
    others: 0
  };
  
  topBreeds: BreedCount[] = [];
  recentPets: Pet[] = [];
  displayedColumns: string[] = ['name', 'species', 'breed', 'age', 'status'];

  constructor(private petService: PetService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.petService.getPets().subscribe({
      next: (pets) => {
        this.calculateStats(pets);
        this.calculateTopBreeds(pets);
        this.getRecentPets(pets);
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load dashboard data:', err);
        this.loading = false;
      }
    });
  }

  calculateStats(pets: Pet[]): void {
    this.stats.totalPets = pets.length;
    
    // Count by status
    this.stats.availablePets = pets.filter(p => p.status.toUpperCase() === 'AVAILABLE').length;
    this.stats.adoptedPets = pets.filter(p => p.status.toUpperCase() === 'ADOPTED').length;
    this.stats.pendingPets = pets.filter(p => p.status.toUpperCase() === 'PENDING').length;
    
    // Count by species
    this.stats.dogs = pets.filter(p => p.species?.toLowerCase() === 'dog').length;
    this.stats.cats = pets.filter(p => p.species?.toLowerCase() === 'cat').length;
    this.stats.birds = pets.filter(p => p.species?.toLowerCase() === 'bird').length;
    this.stats.others = pets.filter(p => {
      const species = p.species?.toLowerCase();
      return species !== 'dog' && species !== 'cat' && species !== 'bird';
    }).length;
  }

  calculateTopBreeds(pets: Pet[]): void {
    const breedMap = new Map<string, number>();
    
    pets.forEach(pet => {
      if (pet.breed) {
        const count = breedMap.get(pet.breed) || 0;
        breedMap.set(pet.breed, count + 1);
      }
    });
    
    this.topBreeds = Array.from(breedMap.entries())
      .map(([breed, count]) => ({ breed, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  getRecentPets(pets: Pet[]): void {
    this.recentPets = pets
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  getAdoptionRate(): number {
    if (this.stats.totalPets === 0) return 0;
    return Math.round((this.stats.adoptedPets / this.stats.totalPets) * 100);
  }
}
