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

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
    this.searchService.savedCities().subscribe((response) => {
      console.log(response);
      this.savedCities = response;
    })
  }

}
