import { Component, OnInit } from '@angular/core';
import { Pet } from '../../models/pet.model';
import { PetService } from '../../services/pet.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pet-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pet-list.component.html',
  styleUrl: './pet-list.component.css'
})
export class PetListComponent implements OnInit {
  pets: Pet[] = [];

  constructor(private petService: PetService) {}

  ngOnInit(): void {
    this.petService.getPets().subscribe((data) => {
      this.pets = data;
    });
  }
}
