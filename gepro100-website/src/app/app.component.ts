import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { CertificateService } from './services/certificate.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Gedeon Prosch';
  currentYear = new Date().getFullYear();

  // Certificate showcase
  certificates: any[] = [];

  showCertificateModal = false;
  selectedCertificate: any = null;
  certificateRequestForm: FormGroup;
  securityCode: string = '';
  securityTimestamp: string = '';
  isSubmitting: boolean = false;
  requestAttempts: number = 0;
  lastRequestTime: number = 0;

  contactForm: FormGroup;
  isContactSubmitting: boolean = false;
  contactSubmitSuccess: boolean = false;

  showCaptcha: boolean = false;

  @ViewChild('certificatesGallery') certificatesGallery!: ElementRef;
  scrollDots: number[] = [];
  currentScrollIndex: number = 0;

  constructor(private fb: FormBuilder, private certificateService: CertificateService) {
    this.certificateRequestForm = this.fb.group({
      requestorName: ['', [Validators.required, Validators.minLength(3)]],
      requestorEmail: ['', [Validators.required, Validators.email, this.validateBusinessEmail]],
      requestorCompany: ['', [Validators.required, Validators.minLength(2)]],
      requestorTitle: ['', [Validators.required]],
      requestReason: ['', [Validators.required]],
      otherReason: [''],
      additionalInfo: [''],
      securityCode: ['', [Validators.required, this.validateSecurityCode.bind(this)]],
      termsAgreed: [false, [Validators.requiredTrue]]
    });

    // Initialize contact form
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(4)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
      honeypot: [''] // No validators - we want this to remain empty
    });
  }

  ngOnInit() {
    this.certificates = this.certificateService.getPublicCertificates();
    this.generateSecurityCode();
    this.securityTimestamp = new Date().getTime().toString().slice(-6);

    // Dynamic validation for otherReason field
    this.certificateRequestForm.get('requestReason')?.valueChanges.subscribe(value => {
      const otherReasonControl = this.certificateRequestForm.get('otherReason');
      if (value === 'other') {
        otherReasonControl?.setValidators([Validators.required, Validators.minLength(5)]);
      } else {
        otherReasonControl?.clearValidators();
        otherReasonControl?.setValue('');
      }
      otherReasonControl?.updateValueAndValidity();
    });

    // Calculate number of scroll dots based on certificate count
    const itemsPerView = window.innerWidth < 768 ? 1 : 3;
    const pages = Math.ceil(this.certificates.length / itemsPerView);
    this.scrollDots = Array(pages).fill(0).map((_, i) => i);
  }

  ngAfterViewInit() {
    // Check if the background image loaded - updated path
    const img = new Image();
    img.src = '/assets/images/backgrounds/profile-bg.jpg';
    img.onerror = () => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.classList.add('img-failed');
      }
    };
  }

  // Custom validator for business email addresses
  validateBusinessEmail(control: any) {
    const email = control.value;
    if (!email) return null;

    // List of common free email domains
    const freeEmailDomains = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
      'aol.com', 'icloud.com', 'mail.com', 'protonmail.com'
    ];

    const domain = email.split('@')[1]?.toLowerCase();

    // If it's a free email, return a warning but not an error
    if (domain && freeEmailDomains.includes(domain)) {
      return { preferBusinessEmail: true };
    }

    return null;
  }

  // Validate security code
  validateSecurityCode(control: any) {
    const enteredCode = control.value;
    if (!enteredCode) return null;

    return enteredCode === this.securityCode ? null : { invalidCode: true };
  }

  // Generate a random security code
  generateSecurityCode() {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    this.securityCode = result;
  }

  refreshSecurityCode() {
    this.generateSecurityCode();
    this.certificateRequestForm.get('securityCode')?.setValue('');
    this.certificateRequestForm.get('securityCode')?.markAsUntouched();
  }

  requestCertificateAccess(certificate: any) {
    // Check if there have been too many recent requests (rate limiting)
    const now = new Date().getTime();
    if (now - this.lastRequestTime < 60000 && this.requestAttempts > 3) {
      alert('Too many requests. Please try again later.');
      return;
    }

    this.selectedCertificate = certificate;
    this.refreshSecurityCode();
    this.securityTimestamp = new Date().getTime().toString().slice(-6);
    this.showCertificateModal = true;
    this.certificateRequestForm.reset({
      requestReason: '',
      termsAgreed: false
    });

    // Prevent scrolling on the body when modal is open
    document.body.style.overflow = 'hidden';

    this.requestAttempts++;
    this.lastRequestTime = now;
  }

  closeCertificateModal(event: any) {
    if (event.target.classList.contains('certificate-modal') ||
        event.target.classList.contains('close-modal-btn')) {
      this.showCertificateModal = false;
      document.body.style.overflow = 'auto';
    }
  }

  submitCertificateRequest() {
    if (this.certificateRequestForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      // Create a secure request object with timestamp and request ID
      const secureRequest = {
        requestId: `REQ-${this.generateRequestId()}`,
        timestamp: new Date().toISOString(),
        certificate: {
          id: this.selectedCertificate.id,
          title: this.selectedCertificate.title,
          issuer: this.selectedCertificate.issuer
        },
        requestor: {
          name: this.certificateRequestForm.get('requestorName')?.value,
          email: this.certificateRequestForm.get('requestorEmail')?.value,
          company: this.certificateRequestForm.get('requestorCompany')?.value,
          title: this.certificateRequestForm.get('requestorTitle')?.value
        },
        purpose: this.certificateRequestForm.get('requestReason')?.value === 'other'
          ? this.certificateRequestForm.get('otherReason')?.value
          : this.certificateRequestForm.get('requestReason')?.value,
        additionalInfo: this.certificateRequestForm.get('additionalInfo')?.value,
        userAgent: navigator.userAgent,
        ipAddress: '[Will be logged server-side]'
      };

      // Add specific messaging for sensitive documents
      let confirmationMessage = `Thank you for your request (ID: ${secureRequest.requestId}). `;

      if (this.selectedCertificate.sensitiveDocument) {
        confirmationMessage += `As this involves a sensitive document, additional verification may be required. Your request will be reviewed within 2-3 business days. If approved, you will receive the document via encrypted communication.`;
      } else {
        confirmationMessage += `Your request has been securely submitted and will be reviewed within 1-2 business days. If approved, you will receive the document via encrypted email.`;
      }

      // Simulate server processing
      setTimeout(() => {
        this.isSubmitting = false;
        this.showCertificateModal = false;
        document.body.style.overflow = 'auto';

        // Show confirmation with request ID
        alert(confirmationMessage);
      }, 1500);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.certificateRequestForm.controls).forEach(key => {
        this.certificateRequestForm.get(key)?.markAsTouched();
      });
    }
  }

  // Generate a unique request ID
  generateRequestId(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase() +
           new Date().getTime().toString().slice(-4);
  }

  submitContactForm() {
    if (this.contactForm.invalid || this.isContactSubmitting) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
      return;
    }

    if (this.contactForm.get('honeypot')?.value) {
      // If honeypot is filled, silently reject (bot detected)
      console.log('Bot submission detected');
      this.isContactSubmitting = false;
      this.contactSubmitSuccess = true; // Pretend it worked
      setTimeout(() => this.contactSubmitSuccess = false, 5000);
      return;
    }

    this.isContactSubmitting = true;

    fetch(`https://formspree.io/f/${environment.formspreeId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.contactForm.value)
    })
    .then(response => {
      this.isContactSubmitting = false;
      if (response.ok) {
        this.contactSubmitSuccess = true;
        this.contactForm.reset();
        setTimeout(() => this.contactSubmitSuccess = false, 5000);
      } else {
        // Handle error - could show an error message to the user
        console.error('Form submission failed');
      }
    })
    .catch(error => {
      this.isContactSubmitting = false;
      console.error('Error submitting form:', error);
    });
  }

  requestCertificate(certificate: any) {
    this.selectedCertificate = certificate;
    this.showCertificateModal = true;
    this.showCaptcha = true;
  }

  viewCertificate(certificate: any) {
    // Open certificate in new tab or modal for public certificates
    if (certificate.documentPath) {
      window.open(certificate.documentPath, '_blank');
    } else {
      console.log('Document path not available');
    }
  }

  scrollCertificates(direction: string) {
    const gallery = this.certificatesGallery.nativeElement;
    const scrollAmount = gallery.clientWidth * 0.8;

    if (direction === 'left') {
      gallery.scrollLeft -= scrollAmount;
    } else {
      gallery.scrollLeft += scrollAmount;
    }

    // Update current scroll index
    setTimeout(() => {
      const itemWidth = 300 + 24; // width + gap
      this.currentScrollIndex = Math.round(gallery.scrollLeft / itemWidth / (window.innerWidth < 768 ? 1 : 3));
    }, 300);
  }

  scrollToIndex(index: number) {
    const gallery = this.certificatesGallery.nativeElement;
    const itemWidth = 300 + 24; // width + gap
    const itemsPerView = window.innerWidth < 768 ? 1 : 3;

    gallery.scrollLeft = index * itemWidth * itemsPerView;
    this.currentScrollIndex = index;
  }
}
