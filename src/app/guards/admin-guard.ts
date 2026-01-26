import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environments';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
private apiUrl = environment.apiUrl;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  canActivate(): Observable<boolean> {
    const token = localStorage.getItem('admin_token');
    const expires = localStorage.getItem('admin_expires');
    if (!token|| !expires || Date.now() > +expires) {
       localStorage.clear();
      this.router.navigate(['/']);
      return of(false);
    }

    return this.http.get(
      `${this.apiUrl}/Room/validate-admin`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    ).pipe(
      map(() => true),
      catchError(() => {
        this.router.navigate(['/']);
        return of(false);
      })
    );
  }
}
