import { Component, OnInit,ViewChild } from '@angular/core'; 
import { MatSidenav } from '@angular/material/sidenav';

//ini 
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; 
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { AzureAdDemoService } from 'src/app/azure-ad-demo.service';
import { Profile } from 'src/app/profile.model';

//ennd
@Component({
  selector: 'app-home-main',
  templateUrl: './home-main.component.html',
  styleUrls: ['./home-main.component.css']
})
export class HomeMainComponent implements OnInit {

  @ViewChild('sidenav') sidenav!: MatSidenav; 
  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }
 
//dd
profile?:Profile;
profilePic?:SafeResourceUrl;
constructor(private azureAdDemoService:AzureAdDemoService,
  private domSanitizer:DomSanitizer,private authService:MsalService,  
  private router: Router) { }

  dominio:String=""; 
  rutaImagen: string = '';
ngOnInit(): void {
  this.dominio= window.location.hostname;   
    this.rutaImagen='../../assets/fondo1.jpeg'; 
}
getProfile()
{
  this.azureAdDemoService.getUserProfile()
  .subscribe(profileInfo=>{ 
    this.profile=profileInfo;
  })
}
getProfilePic()
{
  this.azureAdDemoService.getProfilePic()
  .subscribe(response=>{
    var urlCreator = window.URL ||window.webkitURL
    this.profilePic = this.domSanitizer.bypassSecurityTrustResourceUrl
    (urlCreator.createObjectURL(response));
  });
}

}

