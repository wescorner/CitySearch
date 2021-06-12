import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/search.service';

@Component({
  selector: 'app-saved-cities',
  templateUrl: './saved-cities.component.html',
  styleUrls: ['./saved-cities.component.scss']
})
export class SavedCitiesComponent implements OnInit {

  savedCities: any[] = [

  ];

  deleteMessage = "";

  error: any[] = [
    {
      error: ""
    }
  ];

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
    this.searchService.savedCities().subscribe((response) => {
      console.log(response);
      this.savedCities = response;
    },
    (error) => {
      console.error(error);
      this.error = error;
    });
  }

  deleteCity(title: string){
    this.searchService.deleteCity(title).subscribe((response) => {
      console.log(response);
      this.deleteMessage = response;
      location.reload();
    });
  }

}
