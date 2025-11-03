// Enhanced Material-based Pet List Component TypeScript
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pet } from '../../models/pet.model';
import { PetService } from '../../services/pet.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './pet-list.component.html',
  styleUrl: './pet-list.component.css'
})
export class PetListComponent implements OnInit {
  pets: Pet[] = [];
  searchText = '';
  loading = false;

  constructor(
    private petService: PetService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadPets();
  }

  loadPets(): void {
    this.loading = true;
    this.petService.getPets().subscribe({
      next: (data) => {
        this.pets = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load pets:', err);
        this.showNotification('Failed to load pets', 'error');
        this.loading = false;
      }
    });
  }

  get filteredPets(): Pet[] {
    if (!this.searchText.trim()) {
      return this.pets;
    }
    const search = this.searchText.toLowerCase();
    return this.pets.filter(p =>
      (p.name?.toLowerCase().includes(search) ||
       p.breed?.toLowerCase().includes(search))
    );
  }

  // Navigate to pet details page with pet data
  viewPetDetails(petId: number): void {
    const pet = this.pets.find(p => p.id === petId);
    if (pet) {
      // Pass the entire pet object through navigation state
      this.router.navigate(['/details', petId], { state: { pet } });
    }
  }

  adoptPet(id: number): void {
    const pet = this.pets.find(p => p.id === id);
    if (!pet) return;

    if (pet.status.toUpperCase() === 'ADOPTED') {
      this.showNotification('This pet has already been adopted', 'info');
      return;
    }

    this.petService.markAsAdopted(id).subscribe({
      next: () => {
        this.pets = this.pets.map(p =>
          p.id === id ? { ...p, status: 'ADOPTED' } : p
        );
        this.showNotification(`${pet.name} has been adopted! 🎉`, 'success');
      },
      error: err => {
        console.error('Failed to adopt pet:', err);
        this.showNotification('Failed to mark pet as adopted', 'error');
      }
    });
  }

  deletePet(id: number): void {
    const pet = this.pets.find(p => p.id === id);
    if (!pet) return;

    // Would use Material Dialog here for confirmation
    if (!confirm(`Are you sure you want to delete ${pet.name}?`)) {
      return;
    }

    this.petService.deletePet(id).subscribe({
      next: () => {
        this.pets = this.pets.filter(p => p.id !== id);
        this.showNotification(`${pet.name} has been removed`, 'success');
      },
      error: err => {
        console.error('Failed to delete pet:', err);
        this.showNotification('Failed to delete pet', 'error');
      }
    });
  }

  // Get CSS class for status badge
  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  // Get icon name for status
  getStatusIcon(status: string): string {
    switch (status.toUpperCase()) {
      case 'AVAILABLE':
        return 'check_circle';
      case 'PENDING':
        return 'schedule';
      case 'ADOPTED':
        return 'favorite';
      default:
        return 'info';
    }
  }

  // Get appropriate placeholder image based on species
  getImageUrl(pet: Pet): string {
    // Check if imageUrl is valid
    if (pet.imageUrl && pet.imageUrl.startsWith('http') && !pet.imageUrl.includes('dummy')) {
      return pet.imageUrl;
    }
    
    // Return species-appropriate placeholder
    const species = pet.species?.toLowerCase();
    if (species === 'dog') {
      return 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop';
    } else if (species === 'cat') {
      return 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop';
    }
    return 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=300&fit=crop';
  }

  private showNotification(message: string, type: 'success' | 'error' | 'info'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`]
    });
  }
}
