import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-login.html',
  styleUrls: ['./admin-login.css'],
})
export class AdminLoginComponent {

  username = '';
  password = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login() {
    this.http.post<any>('https://localhost:7256/api/Room/admin-login', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res) => {
       
        localStorage.setItem('admin_token', res.token);
       localStorage.setItem(
        'admin_expires',
        (Date.now() + 30 * 60 * 1000).toString() // 30 min
      );
        this.router.navigate(['/admin']);
      },
      error: () => {
        alert('Invalid credentials');
      }
    });
  }
}
