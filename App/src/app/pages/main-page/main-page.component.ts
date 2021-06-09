import { Component, OnInit } from '@angular/core';
import { SearchService } from 'src/app/search.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  cityInfo: any[] = [
    {
      conversion: "",
      country: "",
      humidity: "",
      temperature: "",
      time: "",
      wind: ""
    }
  ];

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
  }

  searchCityInfo(title: string){
    return this.searchService.searchCity(title).subscribe((response: any) => {
      console.log(response);
      this.cityInfo = response;
      console.log(this.cityInfo[0].conversion);
    })
  }

}
