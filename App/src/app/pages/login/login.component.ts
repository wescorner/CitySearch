import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/search.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginMessage: any[] = [
    {
    message: ""
    }
  ];


  createMessage = "";

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
  }

  login(title: string){
    return this.searchService.login(title).subscribe((response) => {
      console.log(response);
      this.loginMessage = response;

    });
  }


  createNewUser(title: string){
    return this.searchService.createUser(title).subscribe((response: any) => {
      this.createMessage = response;
      console.log(response);
    });
  }
  

}
