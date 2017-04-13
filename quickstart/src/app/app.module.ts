import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { AppComponent }   from './app.component';
import { AgGridModule }   from 'ag-grid-angular/main';
import { HttpModule }     from '@angular/http';
import 'ag-grid-enterprise';
import { CustomFilterComponent } from './CustomFilter/customFilter.component';

@NgModule({
  imports:      [
      BrowserModule,
      HttpModule,
      FormsModule,
      AgGridModule.withComponents([ CustomFilterComponent ])
  ],
  declarations: [
      AppComponent,
      CustomFilterComponent
  ],
    providers: [],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
