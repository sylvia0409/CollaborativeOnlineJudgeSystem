import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { ProblemListComponent } from './components/problem-list/problem-list.component';
import { DataService } from './services/data.service';


@NgModule({
  declarations: [
    AppComponent,
    ProblemListComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [{
    provide: 'dataService',
    useClass: DataService
  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
