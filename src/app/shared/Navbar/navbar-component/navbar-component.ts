
 import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HostListener } from '@angular/core';
@Component({
  selector: 'app-navbar-component',
  imports: [RouterModule],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css',
})
export class NavbarComponent {
// Inside your HomeComponent or AppComponent class:
isScrolled = false;

@HostListener('window:scroll', [])
onWindowScroll() {
  // If scrolled more than 10px, activate the glass state
  this.isScrolled = window.scrollY > 10;
}
}