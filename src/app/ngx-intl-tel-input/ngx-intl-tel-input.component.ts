import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-ngx-intl-tel-input',
  templateUrl: './ngx-intl-tel-input.component.html',
  styleUrls: ['./ngx-intl-tel-input.component.css']
})
export class NgxIntlTelInputComponent  {

  
  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.Singapore, CountryISO.France, CountryISO.SouthKorea, CountryISO.HongKong];
	phoneForm = new FormGroup({
		phone: new FormControl(undefined, [Validators.required])
	});
  phoneNumber:number=0;
	changePreferredCountries() {
		this.preferredCountries = [CountryISO.Singapore];
	}

  submitPhone(){
    if (this.phoneForm.valid) {
           this.phoneNumber = this.phoneForm.controls['phone'].value;
      }
 }


}
