import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  // Only store public metadata about certificates, not actual documents
  private certificates = [
    {
      id: 'HIGHSCHOOL-DIPLOMA',
      title: 'High School Diploma',
      issuer: 'Heinrich Heine Gymnasium (HHG)',
      date: '2018',
      thumbnailPath: 'assets/images/certificates/placeholder_academic_cert.jpg',
      documentPath: '',
      logoPath: 'assets/images/logos/hhg-hamburg.jpg',
      sensitiveDocument: true
    },
    {
      id: 'BSC-MATH',
      title: 'Bachelor of Science in Mathematics',
      issuer: 'Heinrich Heine University Düsseldorf',
      date: 'January 2024',
      thumbnailPath: 'assets/images/certificates/placeholder_academic_cert.jpg',
      documentPath: '',
      logoPath: 'assets/images/logos/hhu-duesseldorf.png',
      sensitiveDocument: true
    },
    {
      id: 'DIPLOMA-SUPPLEMENT',
      title: 'Official Diploma Supplement',
      issuer: 'Heinrich Heine University Düsseldorf',
      date: 'January 2024',
      thumbnailPath: 'assets/images/certificates/placeholder_academic_cert.jpg',
      documentPath: '',
      logoPath: 'assets/images/logos/hhu-duesseldorf.png',
      sensitiveDocument: true
    },
    {
      id: 'US-CITIZENSHIP',
      title: 'US Citizenship Verification',
      issuer: 'U.S. Government',
      date: 'Confidential',
      thumbnailPath: 'assets/images/certificates/placeholder_citizenship.jpg',
      documentPath: '',
      logoPath: 'assets/images/logos/department_of_state_US_Goverment.webp',
      sensitiveDocument: true
    },
    {
      id: 'INFOSYS-CERT',
      title: 'Internship Completion Certificate',
      issuer: 'Infosys',
      date: '2022',
      thumbnailPath: 'assets/images/certificates/placeholder_cert5.jpg',
      documentPath: 'assets/certificates/Gedeon Jeremy Prosch - Internship Completion Form.pdf',
      logoPath: 'assets/images/logos/Infosys_Technologies_logo.svg.png',
      sensitiveDocument: false
    },
    {
      id: 'INFOSYS-LETTER',
      title: 'Internship Completion Letter',
      issuer: 'Infosys',
      date: '2022',
      thumbnailPath: 'assets/images/certificates/placeholder_cert6.jpg',
      documentPath: 'assets/certificates/Gedeon Jeremy Prosch - Internship Completion Letter.pdf',
      logoPath: 'assets/images/logos/Infosys_Technologies_logo.svg.png',
      sensitiveDocument: false
    },
    {
      id: 'HACKATHON-HHU',
      title: 'Hackathon Certificate',
      issuer: 'HHU AI Research Department',
      date: 'November 2023',
      thumbnailPath: 'assets/images/certificates/placeholder_achievement_cert.jpg',
      documentPath: 'assets/certificates/Hackathon Certificate.pdf',
      logoPath: 'assets/images/logos/hhu-duesseldorf.png',
      sensitiveDocument: false
    },
    {
      id: '3D-ENGINE-HHG',
      title: '3D-Printed Engine Project',
      issuer: 'Technical Club, Heinrich Heine Gymnasium',
      date: 'June 2017',
      thumbnailPath: 'assets/images/certificates/placeholder_project_cert.jpg',
      documentPath: 'assets/certificates/3D_Engine_Project.pdf',
      logoPath: 'assets/images/logos/T-Club-Logo.png',
      sensitiveDocument: false,
      description: 'This project showcases a fully functional 3D-printed engine model. Coming soon: Interactive 3D model viewer that allows you to explore the engine design in detail, rotate, and examine internal components.',
      modelPlaceholder: true
    }
  ];

  getPublicCertificates() {
    return this.certificates.map(cert => ({
      ...cert,
      // Only public info is exposed
      documentPath: cert.sensitiveDocument ? null : cert.documentPath
    }));
  }

  // Method to validate and handle certificate requests
  requestCertificateAccess(certificateId: string, requestData: any) {
    // Send to backend service/email
    console.log(`Request for certificate ${certificateId} received`);
    return true; // Simulated success
  }
}
