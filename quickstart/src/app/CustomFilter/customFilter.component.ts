import { Component, ViewChild, AfterContentInit } from '@angular/core';
import { IFilterAngularComp } from "ag-grid-angular";
import {Http, RequestOptions} from "@angular/http";
import {IDoesFilterPassParams, IFilterParams } from "ag-grid";

@Component({
  templateUrl: './customFilter.component.html',
  styleUrls: [ './customFilter.component.css' ]
})
export class CustomFilterComponent implements IFilterAngularComp, AfterContentInit {
  @ViewChild('search') private searchField: any;
  @ViewChild('overlay') private overlay: any;
  @ViewChild('applyBtn') private applyBtn: any;

  public itemsCount: number = 0;
  public inLoading: boolean = false;
  public isReadyToApply: boolean = true;

  private items: any[] = [];
  private requestDelay: number = 800;        // delay in ms
  private timer: any;
  private value: string = '';
  private inputListener: any;
  private applyBtnListener: any;
  private selectedItems: any[] = [];
  private params: any;

  constructor(private _http: Http) {}

  public ngAfterContentInit() {
    this.inputListener = this.inputChanged.bind(this);
    this.applyBtnListener = this.applyBtnClick.bind(this);
    this.searchField.nativeElement.addEventListener('input', this.inputListener);
    this.overlay.nativeElement.addEventListener('click', this.avoidBubblingForOverlay);
    this.applyBtn.nativeElement.addEventListener('click', this.applyBtnListener);
  }

  public agInit(params: IFilterParams) {
    this.params = params;
  }

  public isFilterActive() {
    return true;
  }

  public doesFilterPass(params: IDoesFilterPassParams) {
    let passed = true;
    let valueGetter = this.params.valueGetter;
    let value = valueGetter(params);

    if (this.selectedItems.indexOf(value) === -1) {
      passed = false;
    }

    return passed;
  }

  public getModel() {
    return this.selectedItems.slice();
  }

  public setModel(selectedItems: any[]) {
    this.selectedItems = selectedItems;

    selectedItems.map(item => {
      let id = this.findItemByValue(item.value);

      if (id) {
        this.items[id].selected = true;
      }
    });
  }

  public destroy() {
    this.searchField.nativeElement.removeEventListener('input', this.inputListener);
    this.overlay.nativeElement.removeEventListener('click', this.avoidBubblingForOverlay);
    this.applyBtn.nativeElement.removeEventListener('click', this.applyBtnListener);
  }

  private avoidBubblingForOverlay(event: any) {
    event.stopPropagation();
  }

  private inputChanged() {
    this.value = this.searchField.nativeElement.value;

    if (this.value.length) {
      if (this.timer) {
        clearTimeout(this.timer);
      }

      this.timer = setTimeout(() => {
        this.inLoading = true;
        this._http.get(`http://localhost:2010/items_for_filter?value=${this.value}`).map(response => response.json()).subscribe(
          (data) => {
            this.inLoading = false;
            this.items = data.map((item: any) => {
              return {
                name: item.name,
                selected: false
              };
            });
            this.itemsCount = data.length;

            setTimeout(() => {
              this.searchField.nativeElement.focus();
            }, 0);
          },
          () => {}
        );


      }, this.requestDelay);
    }
  }

  private applyBtnClick() {
    this.selectedItems = this.items.filter(item => item.selected);
    this.selectedItems = this.selectedItems.map(item => item.name);
    this.params.filterChangedCallback();
  }

  private findItemByValue(value: string) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].value === value) {
        return i;
      }
    }

    return null;
  }
}
