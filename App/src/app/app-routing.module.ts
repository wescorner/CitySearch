import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { SavedCitiesComponent } from './pages/saved-cities/saved-cities.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'api/city/:name', component: MainPageComponent},
  { path: 'login', component: LoginComponent},
  { path: 'savedcities', component: SavedCitiesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
