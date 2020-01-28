import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule} from '@agm/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module'
import { LoginPopUpComponent } from './login-pop-up/login-pop-up.component';
import { RegisterPopUpComponent } from './register-pop-up/register-pop-up.component';
import { MapComponent } from './map/map.component';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { AppRoutingModule } from './app-routing.module';
import { CreateTripPageComponent } from './create-trip-page/create-trip-page.component';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { EmailConfirmationComponent } from './email-confirmation/email-confirmation.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TripDetailPageComponent } from './trip-detail-page/trip-detail-page.component';
import { TripItemListComponent } from './trip-item-list/trip-item-list.component';
import { TripUserListComponent } from './trip-user-list/trip-user-list.component';
import { TripListComponent } from './trip-list/trip-list.component';
import { SocialLoginModule, AuthServiceConfig, 
          FacebookLoginProvider,GoogleLoginProvider } from 'angularx-social-login';
import { TripDetailPageMapComponent } from './trip-detail-page-map/trip-detail-page-map.component';
import { UserService} from "./_services/user.service";
import { ErrorComponent } from './error/error.component';
import { TripRolesComponent } from './trip-roles/trip-roles.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { NewRolePopUpComponent } from './new-role-pop-up/new-role-pop-up.component';
import { JoinToTripComponent } from './join-to-trip/join-to-trip.component';
import { ClipboardModule } from 'ngx-clipboard';
import { ColorSketchModule } from 'ngx-color/sketch';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AvatarModule } from 'ngx-avatar';

// API key for google login
const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('API key goes here')
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    CreateTripPageComponent,
    MapComponent,
    LoginPopUpComponent,
    RegisterPopUpComponent,
    HeaderComponent,
    FooterComponent,
    EmailConfirmationComponent,
    UserProfileComponent,
    TripDetailPageComponent,
    TripItemListComponent,
    TripUserListComponent,
    TripListComponent,
    TripDetailPageMapComponent,
    ErrorComponent,
    TripRolesComponent,
    ConfirmationDialogComponent,
    NewRolePopUpComponent,
    JoinToTripComponent,
  ],
  imports: [
    MaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ClipboardModule,
    HttpClientModule,
    // API key for google maps
    AgmCoreModule.forRoot({apiKey:'API key goes here'}),
    FormsModule,
    ReactiveFormsModule,
    SocialLoginModule,
    ColorSketchModule,
    DragDropModule,
    AvatarModule,
  ],
  entryComponents: [
    LoginPopUpComponent,
    RegisterPopUpComponent,
    ConfirmationDialogComponent,
    NewRolePopUpComponent,
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
    UserService,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
