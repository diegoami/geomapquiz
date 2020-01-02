import {Component, OnInit } from '@angular/core';
import {GeoMap} from '../domain/geo-map';
import {GeoMapService} from '../services/geo-map-service';
import {SelectItem} from 'primeng';

@Component({
  selector: 'app-geo-map-view',
  templateUrl: './geo-map-view.component.html',
  styleUrls: ['./geo-map-view.component.css']
})
export class GeoMapViewComponent implements OnInit {

  geoMaps: GeoMap[];

  selectedGeoMap: GeoMap;

  displayDialog: boolean;

  sortOptions: SelectItem[];

  sortKey: string;

  sortField = 'name';

  sortOrder = 1;

  constructor(private geoMapService: GeoMapService) { }

  ngOnInit() {
    this.sortOptions = [
      {label: 'By Name Asc', value: 'name'},
      {label: 'By Name Desc', value: '!name'},
      {label: 'By Continent Asc', value: 'continent'},
      {label: 'By Continent Desc', value: '!continent'}

    ];

    this.geoMapService.getGeoMaps().then(
        geoMaps => this.geoMaps = geoMaps
    ).then(() => console.log(this.geoMaps));
  }

  selectGeoMap(event: Event, geoMap: GeoMap) {
    this.selectedGeoMap = geoMap;
    this.displayDialog = true;
    event.preventDefault();
  }

  onDialogHide() {
    this.selectedGeoMap = null;
  }

  onSortChange(event) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    }
    else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }


}
