import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { PetService } from '../services/pet.service';
import { Pet } from '../models/pet.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  errorMessage: string | null = null;

  constructor(private petService: PetService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.petService.getPetById(+id).subscribe({
        next: (data: Pet) => this.pet = data,
        error: (err: any) => console.error('Failed to load pet:', err)
      });
    }
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) return;

    this.loading = true;
    const request = this.pet.id
      ? this.petService.updatePet(this.pet.id, this.pet)
      : this.petService.addPet(this.pet);

    request.subscribe({
      next: () => this.router.navigate(['/']),
      error: err => {
        this.loading = false;
        this.errorMessage = 'Failed to save pet.';
        console.error(err);
      }
    });
  }
}
