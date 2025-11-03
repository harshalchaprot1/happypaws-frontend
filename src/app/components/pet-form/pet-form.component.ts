import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { Pet } from '../../models/pet.model';
import { PetService } from '../../services/pet.service';

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule
  ],
  templateUrl: './pet-form.component.html',
  styleUrls: ['./pet-form.component.css']
})
export class PetFormComponent implements OnInit {
  pet: Pet = {
    name: '',
    species: '',
    breed: '',
    age: 0,
    gender: '',
    description: '',
    imageUrl: '',
    status: 'AVAILABLE',
    addedBy: 1,
    createdAt: new Date().toISOString(),
    type: null
  };

  loading = false;
  isEditMode = false;
  imagePreview: string | null = null;
  imageRetryCount = 0;
  maxRetries = 20;
  useDefaultImage = false;

  constructor(
    private petService: PetService, 
    private router: Router, 
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadPet(+id);
    }
  }

  loadPet(id: number): void {
    this.loading = true;
    // Load all pets and find the one we need
    this.petService.getPets().subscribe({
      next: (pets: Pet[]) => {
        const foundPet = pets.find(p => p.id === id);
        if (foundPet) {
          this.pet = foundPet;
          this.imagePreview = foundPet.imageUrl || null;
        } else {
          this.showNotification('Pet not found', 'error');
          this.router.navigate(['/']);
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Failed to load pet:', err);
        this.showNotification('Failed to load pet details', 'error');
        this.loading = false;
      }
    });
  }

  onImageUrlChange(): void {
    this.imagePreview = this.pet.imageUrl || null;
    this.imageRetryCount = 0;
    this.useDefaultImage = false;
  }

  onImageError(): void {
    this.imageRetryCount++;
    if (this.imageRetryCount >= this.maxRetries) {
      this.useDefaultImage = true;
      this.imagePreview = this.getDefaultImage();
    }
  }

  getDefaultImage(): string {
    const species = this.pet.species?.toLowerCase() || '';
    if (species.includes('dog')) {
      return 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400';
    } else if (species.includes('cat')) {
      return 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400';
    } else if (species.includes('bird')) {
      return 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400';
    } else if (species.includes('rabbit')) {
      return 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400';
    }
    return 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400';
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      this.showNotification('Please fill in all required fields', 'error');
      return;
    }

    this.loading = true;
    const request = this.pet.id
      ? this.petService.updatePet(this.pet.id, this.pet)
      : this.petService.addPet(this.pet);

    request.subscribe({
      next: () => {
        this.showNotification(
          this.isEditMode ? 'Pet updated successfully!' : 'Pet added successfully!',
          'success'
        );
        this.router.navigate(['/']);
      },
      error: err => {
        this.loading = false;
        this.showNotification('Failed to save pet. Please try again.', 'error');
        console.error(err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }

  onReset(form: NgForm): void {
    form.reset();
    this.imagePreview = null;
    this.pet = {
      name: '',
      species: '',
      breed: '',
      age: 0,
      gender: '',
      description: '',
      imageUrl: '',
      status: 'AVAILABLE',
      addedBy: 1,
      createdAt: new Date().toISOString(),
      type: null
    };
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
