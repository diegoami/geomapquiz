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

}
