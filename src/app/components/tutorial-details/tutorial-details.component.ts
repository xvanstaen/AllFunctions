import { Component, OnInit } from '@angular/core';
import { TutorialService } from '../../CloudServices/tutorial.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Tutorial } from '../../components/TutorialClass';

@Component({
  selector: 'app-tutorial-details',
  templateUrl: './tutorial-details.component.html',
  styleUrls: ['./tutorial-details.component.css']
})
export class TutorialDetailsComponent implements OnInit {

  currentTutorial = new Tutorial;
  message = '';
  constructor(
    private tutorialService: TutorialService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.message = '';
    //this.getTutorial(this.route.snapshot.paramMap.get('id'));
  }

  updateTutorial(){

  }

  getTutorial(id:any){

  }

  updatePublished(status:any){

  }

  deleteTutorial(){
    
  }

  /*
  getTutorial(id:any): void {
    this.tutorialService.get(id)
      .subscribe(
        data => {
          this.currentTutorial = data;
          console.log('get details ', data);
        },
        error => {
          console.log('get details ', error);
        });
  }
  updatePublished(status:any): void {
    const data = {
      title: this.currentTutorial.title,
      description: this.currentTutorial.description,
      published: status
    };
    this.tutorialService.update(this.currentTutorial.id, data)
      .subscribe(
        response => {
          this.currentTutorial.published = status;
          console.log(response);
        },
        error => {
          console.log(error);
        });
  }
  updateTutorial(): void {
    this.tutorialService.update(this.currentTutorial.id, this.currentTutorial)
      .subscribe(
        response => {
          console.log(response);
          this.message = 'The tutorial was updated successfully!';
        },
        error => {
          console.log(error);
        });
  }
  deleteTutorial(): void {
    this.tutorialService.delete(this.currentTutorial.id)
      .subscribe(
        response => {
          console.log(response);
          this.router.navigate(['/tutorials']);
        },
        error => {
          console.log(error);
        });
  }
*/
}
