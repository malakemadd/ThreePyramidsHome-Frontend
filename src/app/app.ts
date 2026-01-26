import { Component, signal } from '@angular/core';
import { RouterModule,RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "./shared/Navbar/navbar-component/navbar-component";
import { FooterComponent } from "./shared/Footer/footer-component";
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, FormsModule, NavbarComponent, FooterComponent,HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ThreePyramidsHome');
}
