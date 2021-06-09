import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private webReqService: WebRequestService) { }

  searchCity(title: string){
    //send web req to search a city
    return this.webReqService.get('api/city');
  }

}
