import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-saved-cities',
  templateUrl: './saved-cities.component.html',
  styleUrls: ['./saved-cities.component.scss']
})
export class SavedCitiesComponent implements OnInit {

  savedCities: any[] = [

  ];

  deleteMessage = "";

  saveError: any[] = [
    {
      error: ""
    }
  ];

  constructor(private searchService: SearchService, private router: Router) { }

  ngOnInit(): void {
    this.searchService.savedCities().subscribe((response) => {
      console.log(response);
      this.savedCities = response;
    },
    (error) => {
      console.error(error);
      window.alert(error.error);
      this.router.navigate(['/']);
    });
  }

  deleteCity(title: string){
    this.searchService.deleteCity(title).subscribe((response) => {
      console.log(response);
      this.deleteMessage = response;
      location.reload();
    },
    (error) => {
      console.error(error);
      window.alert(error.error);
    });
  }

}
