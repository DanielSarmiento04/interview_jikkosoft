import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MemberService } from '../services/member.service';
import { MemberUpdate } from '../models/member.model';

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss']
})
export class MemberEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private memberService = inject(MemberService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  memberForm!: FormGroup;
  loading = signal(true);
  submitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  memberId!: number;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.memberId = parseInt(id, 10);
      this.loadMember();
    } else {
      this.router.navigate(['/members']);
    }
  }

  loadMember(): void {
    this.memberService.getMemberById(this.memberId).subscribe({
      next: (member) => {
        this.initForm(member);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Failed to load member data');
        this.loading.set(false);
      }
    });
  }

  initForm(member: any): void {
    this.memberForm = this.fb.group({
      name: [member.name, [Validators.required]],
      email: [member.email, [Validators.required, Validators.email]],
      phone: [member.phone || ''],
      address: [member.address || ''],
      max_loans: [member.max_loans, [Validators.required, Validators.min(1), Validators.max(20)]],
      status: [member.status, [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.memberForm.valid) {
      this.submitting.set(true);
      this.errorMessage.set(null);
      this.successMessage.set(null);

      const memberData: MemberUpdate = this.memberForm.value;

      this.memberService.updateMember(this.memberId, memberData).subscribe({
        next: (member) => {
          this.successMessage.set('Member updated successfully!');
          this.submitting.set(false);
          setTimeout(() => {
            this.router.navigate(['/members']);
          }, 1500);
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Failed to update member. Please try again.');
          this.submitting.set(false);
        }
      });
    }
  }

  onDelete(): void {
    if (confirm('Are you sure you want to delete this member? This action cannot be undone.')) {
      this.submitting.set(true);
      this.memberService.deleteMember(this.memberId).subscribe({
        next: () => {
          this.successMessage.set('Member deleted successfully!');
          setTimeout(() => {
            this.router.navigate(['/members']);
          }, 1000);
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Failed to delete member. Please try again.');
          this.submitting.set(false);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/members']);
  }
}
