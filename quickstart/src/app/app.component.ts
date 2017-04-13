import { Component }    from '@angular/core';
import { Http }         from '@angular/http';
import { GridOptions }  from 'ag-grid';

import 'rxjs/add/operator/map';
import { CustomFilterComponent } from "./CustomFilter/customFilter.component";

@Component({
    selector: 'my-app',
    styleUrls: [ './app.component.css' ],
    templateUrl: './app.component.html'
})
export class AppComponent  {
    public gridOptions: GridOptions = {
        suppressMenuMainPanel: true,
        suppressEnterprise: true,
        onGridReady: () => {
            this.createDatasource();
        },
        onFilterChanged: () => {
          var nameFilterComponent = this.gridOptions.api.getFilterInstance('name');
          var ageFilterComponent = this.gridOptions.api.getFilterInstance('age');
          var fruitFilterComponent = this.gridOptions.api.getFilterInstance('favoriteFruit');

          console.log('name', nameFilterComponent.getModel());
          console.log('age', ageFilterComponent.getModel());
          console.log('fruit', fruitFilterComponent.getModel());
          console.log('______________________________________');
        }
    };
    public rowData: any[] = [];
    public columnDefs = [
        {
            headerName: 'Name',
            field: 'name',
            filterFramework: CustomFilterComponent
        },
        {
            headerName: 'Age',
            field: 'age'
        },
      {
        headerName: 'Fruit',
        field: 'favoriteFruit',
        filterParams: {
          filter: 'set',
          apply: true,
          filterParams: {cellHeight: 20, values: ['A','B','C'], newRowsAction: 'keep'}
        }
      }
    ];

    constructor(private http: Http) {}

    public createDatasource() {
        this.http.get('http://localhost:2010/items').map(res => res.json()).subscribe(
            (data) => {
                if (this.gridOptions.api) {
                    this.gridOptions.api.setRowData(data);
                }
            },
            () => {}
        );
    }
}
