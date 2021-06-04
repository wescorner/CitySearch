import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CitySearchComponent } from './pages/city-search/city-search.component';
import { MainPageComponent } from './pages/main-page/main-page.component';

const routes: Routes = [
  { path: '', component: MainPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
