import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PetService } from '../../services/pet.service';
import { Pet } from '../../models/pet.model';

@Component({
  selector: 'app-pet-detail',
  standalone: true,
  imports: [CommonModule],
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
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading = true;
      this.petService.getPetById(+id).subscribe({
        next: (p: Pet) => {
          this.pet = p;
          this.loading = false;
        },
        error: (err: any) => {
          this.errorMessage = 'Failed to load pet details.';
          this.loading = false;
          console.error('Failed to load pet:', err);
        }
      });
    }
  }

  goEdit(): void {
    if (!this.pet?.id) return;
    this.router.navigate(['/edit', this.pet.id]);
  }

  deletePet(): void {
    if (!this.pet?.id) return;
    if (!confirm('Are you sure you want to delete this pet?')) return;
    this.actionPending = true;
    this.petService.deletePet(this.pet.id).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err: any) => {
        this.actionPending = false;
        console.error('Failed to delete pet:', err);
        alert('Failed to delete pet.');
      }
    });
  }

  markAsAdopted(): void {
    if (!this.pet?.id) return;
    if (this.pet.status === 'ADOPTED') return;
    this.actionPending = true;
    this.petService.markAsAdopted(this.pet.id).subscribe({
      next: () => {
        if (this.pet) this.pet = { ...this.pet, status: 'ADOPTED' };
        this.actionPending = false;
      },
      error: (err: any) => {
        this.actionPending = false;
        console.error('Failed to mark as adopted:', err);
        alert('Failed to mark as adopted.');
      }
    });
  }
}
