import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MainPageComponent} from "./main-page/main-page.component";
import {CreateTripPageComponent} from "./create-trip-page/create-trip-page.component";
import {TripListComponent} from './trip-list/trip-list.component'
import {EmailConfirmationComponent} from './email-confirmation/email-confirmation.component';
import {TripDetailPageComponent} from './trip-detail-page/trip-detail-page.component';
import {UserProfileComponent} from "./user-profile/user-profile.component";
import { ErrorComponent } from './error/error.component';
import {JoinToTripComponent} from './join-to-trip/join-to-trip.component';
import {AuthGuard} from './auth/auth.guard';

const routes: Routes = [
  { path: 'index', component: MainPageComponent },
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: 'create_trip', component: CreateTripPageComponent, canActivate: [AuthGuard]},
  { path: 'trip-list', component: TripListComponent,  canActivate: [AuthGuard] },
  { path: 'email-confirmation', component: EmailConfirmationComponent },
  { path: 'trip_detail/:trip_id', component: TripDetailPageComponent, canActivate: [AuthGuard] },
  { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'error', component: ErrorComponent},
  { path: 'join', component: JoinToTripComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
