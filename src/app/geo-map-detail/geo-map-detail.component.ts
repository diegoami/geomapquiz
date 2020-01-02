import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {ActivatedRoute} from '@angular/router';
import {GeoMapService} from '../services/geo-map-service';
import {GeoMap} from '../domain/geo-map';
import {GeoMapCanvasComponent} from '../geo-map-canvas/geo-map-canvas.component';

@Component({
  selector: 'app-geo-map-detail',
  templateUrl: './geo-map-detail.component.html',
  styleUrls: ['./geo-map-detail.component.css']
})
export class GeoMapDetailComponent implements OnInit {
  private geoMap: GeoMap;
  hotspotFile: string;

  @ViewChild('geoMapCanvas', {static: true})
  geoMapCanvas: GeoMapCanvasComponent;

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
