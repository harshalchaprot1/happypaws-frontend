import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PetService } from '../../services/pet.service';
import { Pet } from '../../models/pet.model';

@Component({
  selector: 'app-pet-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './pet-detail.component.html',
  styleUrl: './pet-detail.component.css'
})
export class PetDetailComponent implements OnInit {
  pet: Pet | null = null;
  loading = false;
  errorMessage: string | null = null;
  actionPending = false;

  constructor(
    private route: ActivatedRoute,
    private petService: PetService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Try to get pet from navigation state first
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { pet: Pet };
    
    if (state?.pet) {
      // Pet data was passed through navigation
      this.pet = state.pet;
    } else {
      // Fallback: Check if pet data exists in window.history.state
      const historyState = window.history.state as { pet: Pet };
      if (historyState?.pet) {
        this.pet = historyState.pet;
      } else {
        // Last resort: Load all pets and find the one we need
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
          this.loadPetFromList(+id);
        }
      }
    }
  }

  loadPetFromList(id: number): void {
    this.loading = true;
    this.petService.getPets().subscribe({
      next: (pets: Pet[]) => {
        const foundPet = pets.find(p => p.id === id);
        if (foundPet) {
          this.pet = foundPet;
        } else {
          this.errorMessage = 'Pet not found.';
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Failed to load pet details.';
        this.loading = false;
        console.error('Failed to load pet:', err);
        this.showNotification('Failed to load pet details', 'error');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  goEdit(): void {
    if (!this.pet?.id) return;
    this.router.navigate(['/edit', this.pet.id]);
  }

  deletePet(): void {
    if (!this.pet?.id) return;
    
    const confirmed = confirm(`Are you sure you want to delete ${this.pet.name}? This action cannot be undone.`);
    if (!confirmed) return;

    this.actionPending = true;
    this.petService.deletePet(this.pet.id).subscribe({
      next: () => {
        this.showNotification('Pet deleted successfully', 'success');
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        this.actionPending = false;
        console.error('Failed to delete pet:', err);
        this.showNotification('Failed to delete pet', 'error');
      }
    });
  }

  markAsAdopted(): void {
    if (!this.pet?.id) return;
    if (this.pet.status.toUpperCase() === 'ADOPTED') {
      this.showNotification('This pet has already been adopted', 'error');
      return;
    }

    this.actionPending = true;
    this.petService.markAsAdopted(this.pet.id).subscribe({
      next: () => {
        if (this.pet) this.pet = { ...this.pet, status: 'ADOPTED' };
        this.actionPending = false;
        this.showNotification('Pet marked as adopted! 🎉', 'success');
      },
      error: (err: any) => {
        this.actionPending = false;
        console.error('Failed to mark as adopted:', err);
        this.showNotification('Failed to mark as adopted', 'error');
      }
    });
  }

  getStatusClass(): string {
    if (!this.pet) return '';
    switch (this.pet.status.toUpperCase()) {
      case 'AVAILABLE': return 'status-available';
      case 'PENDING': return 'status-pending';
      case 'ADOPTED': return 'status-adopted';
      default: return '';
    }
  }

  getStatusIcon(): string {
    if (!this.pet) return 'pets';
    switch (this.pet.status.toUpperCase()) {
      case 'AVAILABLE': return 'check_circle';
      case 'PENDING': return 'schedule';
      case 'ADOPTED': return 'favorite';
      default: return 'pets';
    }
  }

  getPlaceholderImage(): string {
    // Return species-appropriate placeholder images
    if (!this.pet) return 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=600&fit=crop';
    
    const species = this.pet.species?.toLowerCase();
    if (species === 'dog') {
      return 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop';
    } else if (species === 'cat') {
      return 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=600&fit=crop';
    }
    return 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=600&fit=crop';
  }

  private showNotification(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error'
    });
  }
}
