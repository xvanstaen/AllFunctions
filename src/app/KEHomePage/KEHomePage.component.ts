import { Component } from '@angular/core';

import { MatDialogConfig, MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SearchGeneralDialogComponent } from '../search-general-dialog/search-general-dialog.component'; 



@Component({
  selector: 'KEHomePage',
  templateUrl: './KEHomePage.component.html',
  styleUrls: ['./KEHomePage.component.css']
})


export class KEHomePageComponent {

  searchstring: string="";
  
  constructor(public matDialog: MatDialog,
      private router:Router) {}
  
  ngOnInit(){
    
  }

  ReturnOther(){
    console.log("ReturnOther function");
    this.router.navigateByUrl('myRouting');
  }

  OpenSearchGeneralDialog() {

    const MydialogConfig = new MatDialogConfig();
      // DISPLAY THE SEARCH BAR

       // user cannot close the dialog just by clicking outside the box if set to true
       MydialogConfig.disableClose = true;

       // focus will be set automatically on the first form field of the dialog
       MydialogConfig.autoFocus = true;
 
       // hasBackdrop --> blocks the user from clicking on the rest of the UI while the dialog is opened
       MydialogConfig.hasBackdrop=true;
 
         // panelClass --> adds a list of custom CSS classes
       MydialogConfig.panelClass = 'MypanelClass';                                                                                                                                                                      
         
       MydialogConfig.backdropClass = 'MybackdropClass';
       MydialogConfig.width = '760px';
       MydialogConfig.height = '300px';
                           
        // position --> defines a starting absolute position for the dialog
        // bottom, left, right, top
      MydialogConfig.position = {
        top: '230px',
        left: '30px',            
      };

      // direction --> frines if the elements inside the dialog are right or left justified
      // default is left-to-right (ltr) otherwise can specify right-to-left (rtl)
      //closeon navigation --> deault is true. Dialog automatically closes when we navigate to another route in our sigle page application

      
      
    MydialogConfig.data={searchstring:  ""}
    
  
    const dialogRef = this.matDialog.open(SearchGeneralDialogComponent , MydialogConfig);
    
      /*
    dialogRef.beforeClosed().subscribe((result: string) => {
      console.log('Before Closed', result.length);
    });
    */

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result.length !== 0 ) {
        /* this.searchstring = "it's working ==> " + JSON.stringify(result);
        */
        this.searchstring = result;
      }
    })  
  }                                                                                                                         
 

}

