import {  RouterModule,Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home-component';
import { NgModule } from '@angular/core';
import { RoomComponent } from './Components/room-component/room-component';
import { AboutusComponent } from './Components/aboutus-component/aboutus-component';
import { RoomDetailsComponent } from './Components/room-details/room-details-component';
import { ContactComponent } from './Components/contact/contact-component';
import { AdminDashboardComponent } from './Components/admin-dashboard/admin-dashboard-component';
import { AdminGuard } from './guards/admin-guard';
import { AdminLoginComponent } from './Components/admin-login/admin-login';




export const routes: Routes = [
    { path: 'home', component: HomeComponent},
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'room', component: RoomComponent},
    { path: 'aboutus', component: AboutusComponent},
    { path: 'room/:id', component: RoomDetailsComponent},
    { path: 'contact', component: ContactComponent},
    { path: 'admin', component: AdminDashboardComponent, canActivate: [AdminGuard]},
    { path: 'adminlogin', component: AdminLoginComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }