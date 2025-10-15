import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MemberService } from '../services/member.service';
import { MemberCreate } from '../models/member.model';

@Component({
  selector: 'app-member-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.scss']
})
export class MemberFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private memberService = inject(MemberService);
  private router = inject(Router);

  memberForm!: FormGroup;
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.memberForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
      max_loans: [5, [Validators.min(1), Validators.max(20)]]
    });
  }

  onSubmit(): void {
    if (this.memberForm.valid) {
      this.loading.set(true);
      this.errorMessage.set(null);
      this.successMessage.set(null);

      const memberData: MemberCreate = this.memberForm.value;

      this.memberService.createMember(memberData).subscribe({
        next: (member) => {
          this.successMessage.set('Member registered successfully!');
          this.loading.set(false);
          setTimeout(() => {
            this.router.navigate(['/members']);
          }, 1500);
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Failed to create member. Please try again.');
          this.loading.set(false);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/members']);
  }
}
