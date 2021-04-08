import { Component,Input,OnInit } from '@angular/core';
import{ GlobalConstants } from '../common/global-constants';
import { ServiceService } from "../app/servicios/service.service"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent{

  title = 'ventas';
  @Input()usuario:boolean;
  @Input()nombre:string;
  @Input()showVar:boolean = false;
  
  constructor( public authenticationService:ServiceService) {
  }
  logout() {
    this.authenticationService.logout();
  }
  
  // dondestoy()
  // {
  //   console.log(window.location.href);
    
  // }
}
