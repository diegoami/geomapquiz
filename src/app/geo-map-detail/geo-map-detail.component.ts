import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {GeoMapService} from '../services/geo-map-service';
import {GeoMap} from '../domain/geo-map';

@Component({
  selector: 'app-geo-map-detail',
  templateUrl: './geo-map-detail.component.html',
  styleUrls: ['./geo-map-detail.component.css']
})
export class GeoMapDetailComponent implements OnInit {
  private geoMap: GeoMap;
  hotspotFile: string;

  constructor(
      private route: ActivatedRoute,
      private mapService: GeoMapService,
  ) { }

  ngOnInit() {
    const that = this;
    const id = +this.route.snapshot.paramMap.get('id');
    this.hotspotFile = this.route.snapshot.paramMap.get('hotspotfile')
    this.mapService.getMap(id).then((geoMap) => this.geoMap = geoMap);

  }

}
