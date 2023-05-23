import { Component, Inject, OnInit, } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormControlName } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig} from '@angular/material/dialog';

@Component({
  selector: 'app-search-general-dialog',
  templateUrl: './search-general-dialog.component.html',
  styleUrls: ['./search-general-dialog.component.css']
})
export class SearchGeneralDialogComponent implements OnInit {
  searchstring: string;
  

  searchgeneralform = new FormGroup({ 
      Mysearchstring: new FormControl('', { nonNullable: true }), 
      Myotherfield: new FormControl('', { nonNullable: true })
  })
 
  
  constructor(
    public fb: FormBuilder,
    public dialogRef: MatDialogRef<SearchGeneralDialogComponent>,
    @Inject(MAT_DIALOG_DATA) 
    public data: {searchstring: string},  
         )
         
    {
      this.searchstring = data.searchstring
    }
  

  ngOnInit() {
        /*
        this.searchgeneralform= this.fb.group({
          Mysearchstring: [this.searchstring],
          Myotherfield: [""]
        });
        */
  }
 
  onConfirmClick() {
        // this.dialogRef.close(this.searchgeneralform.value);
      
        this.dialogRef.close(this.searchgeneralform.controls['Mysearchstring'].value);
        
  }

  onCancel() {
        this.dialogRef.close("");
  }

}
