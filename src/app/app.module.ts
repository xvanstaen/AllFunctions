import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule} from '@angular/material/icon';

import { MatInputModule} from '@angular/material/input';

import { MatDialogModule} from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatAutocompleteModule} from '@angular/material/autocomplete';

import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule} from '@angular/material/core';

import { ColorPickerModule } from 'ngx-color-picker';
import { FileSaverModule } from 'ngx-filesaver';
import { HttpClientModule } from '@angular/common/http';

import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewRegionsDialogComponent } from './booking-dialog/booking-dialog-viewregions.component';
import { BookingDialogComponent } from './booking-dialog/booking-dialog.component';
import { BookingFormComponent } from './Booking-Process/Booking-form.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { ColorPaletteComponent } from './color-picker/color-palette/color-palette.component';
import { ColorSliderComponent } from './color-picker/color-slider/color-slider.component';
import { FirstChildComponent } from './first-child/first-child.component';
import { SecondChildComponent } from './second-child/second-child.component';
import { KEHomePageComponent } from './KEHomePage/KEHomePage.component';
import { MyDatePickerComponent } from './my-date-picker/my-date-picker.component';
import { NgxIntlTelInputComponent } from './ngx-intl-tel-input/ngx-intl-tel-input.component';
import { RoutingAppComponent } from './routing-app/routing-app.component';
import { SearchGeneralDialogComponent } from './search-general-dialog/search-general-dialog.component';
import { TheCalendarComponent } from './the-calendar/the-calendar.component';
import { XmvCompanyComponent } from './xmv-company/xmv-company.component';
import { XMVCompanyContactComponent } from './xmv-company/xmvcompany-contact/xmvcompany-contact.component';
import { XMVCompanyOfferComponent } from './xmv-company/xmvcompany-offer/xmvcompany-offer.component';
import { XMVCompanyProfileComponent } from './xmv-company/xmvcompany-profile/xmvcompany-profile.component';
import { ManageUrlTopicComponent } from './routing-app/manage-url-topic/manage-url-topic.component';
import { ConfigComponent } from './config/config.component';
import { HttpErrorHandler } from './http-error-handler.service';
import { AuthService } from './auth.service';
import { MyCanvasComponent } from './my-canvas/my-canvas.component';
import { RespondContactComponent } from './Special-Services/Respond-Contact.component';
import { LoginComponent } from './Login/login.component';
import { Event27AugComponent}  from './Special-Services/Event-27AUG2022.component';
import { Event02JULComponent}  from './Special-Services/Event-02JUL2022.component';


@NgModule({
  declarations: [
    AppComponent,
    ViewRegionsDialogComponent,
    BookingDialogComponent,
    BookingFormComponent,
    ColorPickerComponent,
    ColorPaletteComponent,
    ColorSliderComponent,
    FirstChildComponent,
    SecondChildComponent,
    KEHomePageComponent,
    MyDatePickerComponent,
    NgxIntlTelInputComponent,
    RoutingAppComponent,
    SearchGeneralDialogComponent,
    TheCalendarComponent,
    XmvCompanyComponent,
    XMVCompanyContactComponent,
    XMVCompanyOfferComponent,
    XMVCompanyProfileComponent,
    ManageUrlTopicComponent,
    ConfigComponent,
    MyCanvasComponent,
    RespondContactComponent,
    LoginComponent,
    Event27AugComponent,
    Event02JULComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    ColorPickerModule,
    FileSaverModule,
    HttpClientModule,
    NgxIntlTelInputModule,
    BsDropdownModule.forRoot(),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [MatDatepickerModule, HttpErrorHandler,  AuthService,
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
