import {AfterViewInit, Component, Host, Inject, OnInit, SkipSelf, ViewChild} from '@angular/core';
import {GeoMap} from '../domain/geo-map';
import {GeoMapService} from '../services/geo-map-service';
import {SelectItem} from 'primeng';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';


@Component({
  selector: 'app-geo-map-view',
  templateUrl: './geo-map-view.component.html',
  styleUrls: ['./geo-map-view.component.css']
})
export class GeoMapViewComponent implements OnInit, AfterViewInit {

  geoMaps: GeoMap[];

  selectedGeoMap: GeoMap;

  displayDialog: boolean;

  sortOptions: SelectItem[];

  sortKey: string;

  sortField = 'name';

  sortOrder = 1;

  filter = '';

  @ViewChild('dv', {static: true})
  dv: any;


  constructor(private geoMapService: GeoMapService, @Inject(LOCAL_STORAGE) private storage: StorageService) {
  }

  ngOnInit() {
    this.sortOptions = [
      {label: 'By Name Asc', value: 'name'},
      {label: 'By Name Desc', value: '!name'},
      {label: 'By Continent Asc', value: 'continent'},
      {label: 'By Continent Desc', value: '!continent'}

    ];

    const that = this;
    this.geoMapService.getGeoMaps().then(
        geoMaps => this.geoMaps = geoMaps
    ).then( function() {
      if (that.storage.get('filter')) {
        that.filter = that.storage.get('filter');
        that.dv.filter(that.storage.get('filter'));
      }
    });
  }

  selectGeoMap(event: Event, geoMap: GeoMap) {
    this.selectedGeoMap = geoMap;
    this.displayDialog = true;
    event.preventDefault();
  }

  onSortChange(event) {
    const value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  onFilter(event) {
    this.dv.filter(event.target.value);
    this.storage.set('filter', event.target.value);

  }
}
