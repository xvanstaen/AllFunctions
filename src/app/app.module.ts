import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule} from '@angular/material/icon';
import { CommonModule,  DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule} from '@angular/material/dialog';
import  { NgChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { KEHomePageComponent } from './KEHomePage/KEHomePage.component';
import { BookingFormComponent} from './Booking-Process/Booking-form.component';
import { ViewRegionsDialogComponent } from './booking-dialog/booking-dialog-viewregions.component';
import {  BookingDialogComponent} from './booking-dialog/booking-dialog.component';
import { TheCalendarComponent } from './the-calendar/the-calendar.component'
import { MyDatePickerComponent } from './my-date-picker/my-date-picker.component';
import { RoutingAppComponent } from './routing-app/routing-app.component';
import { ManageUrlTopicComponent } from './routing-app/manage-url-topic/manage-url-topic.component';

import { XmvcompanyRootComponent } from './xmvcompany-root/xmvcompany-root.component';
import { XmvCompanyComponent } from './xmv-company/xmv-company.component';
import { XMVCompanyContactComponent } from './xmv-company/xmvcompany-contact/xmvcompany-contact.component';
import { XMVCompanyOfferComponent } from './xmv-company/xmvcompany-offer/xmvcompany-offer.component';
import { XMVCompanyProfileComponent } from './xmv-company/xmvcompany-profile/xmvcompany-profile.component';
import { RespondContactComponent } from './Special-Services/Respond-Contact.component';
import { LoginComponent } from './Login/login.component';
import { Event27AugComponent}  from './Special-Services/Event-27AUG2022.component';
import { Event02JULComponent}  from './Special-Services/Event-02JUL2022.component';
import { WeddingPhotosComponent}  from './Special-Services/WeddingPhotos.component';
import { GetImagesComponent}  from './Special-Services/GetImages.component';
import { AdminJsonComponent}  from './Special-Services/AdminJson.component';
import { AdminLoginComponent}  from './Special-Services/AdminLogin.component';
import { AdminConsoleComponent}  from './Special-Services/AdminConsole.component';
import { ListBucketContentComponent}  from './Special-Services/ListBucketContent.component';
import { ChangeSaveFileNameComponent}  from './Special-Services/ChangeSaveFileName.component';
import { OneCalendarComponent } from './one-calendar/one-calendar.component';
import { FitnessStatComponent } from './Health/fitness-stat/fitness-stat.component';
import { ManageGoogleService} from 'src/app/CloudServices/ManageGoogle.service';
import { ManageMangoDBService} from 'src/app/CloudServices/ManageMangoDB.service';
// import { TutorialService} from 'src/app/CloudServices/tutorial.service';
import { AccessConfigService} from 'src/app/CloudServices/access-config.service';
import { FitnessChartComponent } from './Health/fitness-chart/fitness-chart.component';
import { MyDropDownComponent } from './Health/my-drop-down/my-drop-down.component';
import { HealthComponent } from './Health/healthfood/health.component';
import { ConverterComponent } from './converter/converter.component';
import { CaloriesFatComponent } from './Health/calories-fat/calories-fat.component';
import { ReportHealthComponent } from './Health/report-health/report-health.component';
import { ColorPickerComponent } from 'src/app/color-picker/color-picker.component';
import { ColorPaletteComponent } from 'src/app/color-picker/color-palette/color-palette.component';
import { ColorSliderComponent } from 'src/app/color-picker/color-slider/color-slider.component';
//import { NgxIntlTelInputComponent } from './ngx-intl-tel-input/ngx-intl-tel-input.component';

@NgModule({
  declarations: [
    AppComponent,
    XmvCompanyComponent,
    XMVCompanyContactComponent,
    XMVCompanyOfferComponent,
    XMVCompanyProfileComponent,
    XmvcompanyRootComponent,
    RespondContactComponent,
    LoginComponent,
    Event27AugComponent,
    Event02JULComponent,
    WeddingPhotosComponent,
    GetImagesComponent,
    AdminJsonComponent,
    AdminLoginComponent,
    AdminConsoleComponent,
    ListBucketContentComponent,
    ChangeSaveFileNameComponent,
    FitnessStatComponent,
    OneCalendarComponent,
    FitnessChartComponent,
    MyDropDownComponent,
    HealthComponent,
    ConverterComponent,
    CaloriesFatComponent,
    ReportHealthComponent,
    ColorPickerComponent,
    ColorPaletteComponent,
    ColorSliderComponent,
    KEHomePageComponent,
    BookingFormComponent,
    ViewRegionsDialogComponent,
    BookingDialogComponent,
    TheCalendarComponent,
    MyDatePickerComponent,
    RoutingAppComponent,
    ManageUrlTopicComponent,

    

  ],
  imports: [

    AppRoutingModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgChartsModule,
    
   
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    DatePipe, AccessConfigService, ManageGoogleService, ManageMangoDBService,
    // TutorialService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  
 }
