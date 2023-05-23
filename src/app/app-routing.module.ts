import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RespondContactComponent } from './Special-Services/Respond-Contact.component';
import { LoginComponent } from './Login/login.component';


import { ViewRegionsDialogComponent } from './booking-dialog/booking-dialog-viewregions.component';
import { BookingDialogComponent } from './booking-dialog/booking-dialog.component';
import { BookingFormComponent } from './Booking-Process/Booking-form.component';
import { SearchGeneralDialogComponent } from './search-general-dialog/search-general-dialog.component'; 
import { TheCalendarComponent } from './the-calendar/the-calendar.component';
import { MyDatePickerComponent } from './my-date-picker/my-date-picker.component';
import { KEHomePageComponent } from './KEHomePage/KEHomePage.component';
import { RoutingAppComponent } from './routing-app/routing-app.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { ColorPaletteComponent } from './color-picker/color-palette/color-palette.component';
import { ColorSliderComponent } from './color-picker/color-slider/color-slider.component';
import { XmvcompanyRootComponent } from './xmvcompany-root/xmvcompany-root.component';
//import { NgxIntlTelInputComponent } from './ngx-intl-tel-input/ngx-intl-tel-input.component';
import { ManageUrlTopicComponent } from './routing-app/manage-url-topic/manage-url-topic.component';
import { XMVCompanyContactComponent } from './xmv-company/xmvcompany-contact/xmvcompany-contact.component';
import { MyCanvasComponent } from './my-canvas/my-canvas.component';
//import { TutorialsListComponent } from './components/tutorials-list/tutorials-list.component';
//import { TutorialDetailsComponent } from './components/tutorial-details/tutorial-details.component';
//import { AddTutorialComponent } from './components/add-tutorial/add-tutorial.component';
import { FitnessStatComponent } from './Health/fitness-stat/fitness-stat.component';
import { XmvCompanyComponent } from './xmv-company/xmv-company.component';

const routes: Routes = [
  { path: 'GoRespondContact', component: RespondContactComponent},
  { path: 'GoLogin', component: LoginComponent},

  { path: './Booking-Process/Booking-form.component', component: BookingFormComponent },
  { path: 'myKEHP', component: KEHomePageComponent },
  { path: 'myRouting', component: RoutingAppComponent },
  { path: 'myColorPicker', component: ColorPickerComponent },
  { path: 'myColorSlider', component: ColorSliderComponent },
  { path: 'myColorPalette', component: ColorPaletteComponent },
  //{ path: 'IntlPhoneNb', component: NgxIntlTelInputComponent},
  { path: 'myXMVcompany', component: XmvcompanyRootComponent},
  { path: 'TopicURL', component: ManageUrlTopicComponent},
  { path: './booking-dialog/booking-dialog.component', component: BookingDialogComponent} ,
  { path: './booking-dialog/booking-dialog-viewregions.component', component: ViewRegionsDialogComponent} ,
  { path: './search-general-dialog/search-general-dialog.component', component:SearchGeneralDialogComponent },
  { path: './the-calendar/the-calendar.component', component:TheCalendarComponent },
  { path: './my-date-picker/my-date-picker.component', component:MyDatePickerComponent},
  { path: 'Contact', component: XMVCompanyContactComponent},
  { path: 'MyCanvas', component: MyCanvasComponent},
  { path: 'MyLogin', component: LoginComponent},
  { path: 'myFitnessStat', component: FitnessStatComponent},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
