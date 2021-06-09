import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/search.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
  }

  login(title: string){
    return this.searchService.login(title).subscribe((response) => {
      console.log(response);
    });
  }

  createNewUser(title: string){
    return this.searchService.createUser(title).subscribe((response) => {
      console.log(response);
    });
  }
  

}
