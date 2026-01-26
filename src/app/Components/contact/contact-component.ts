import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-component.html',
  styleUrls: ['./contact-component.css']
})
export class ContactComponent implements OnInit {

  /** Room context (optional) */
  selectedRoom?: string;

  /** Contact form model */
  contact = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  sending = false;
  submitted = false;
  error?: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedRoom = params['room'];

      // Auto-prefill message if room exists 
      if (this.selectedRoom) {
        this.contact.message =
          `Hello, I’m interested in the ${this.selectedRoom}. Please share availability and prices.`;
      }
    });
  }

  onSubmit(form: any): void {
    if (!form?.valid) return;

    this.sending = true;
    this.error = undefined;

    setTimeout(() => {
      this.sending = false;
      this.submitted = true;
      form.resetForm();
    }, 800);
  }


  get whatsappLink(): string {
    const room = this.selectedRoom || 'a room';
    const message = `Hello, I would like to inquire about ${room} availability and prices.`;
    return `https://wa.me/201110222520?text=${encodeURIComponent(message)}`;
  }
}
