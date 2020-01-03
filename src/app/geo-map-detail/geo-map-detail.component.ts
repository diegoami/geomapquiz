import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

import {ActivatedRoute} from '@angular/router';
import {GeoMapService} from '../services/geo-map-service';
import {GeoMap} from '../domain/geo-map';
import {GeoMapCanvasComponent} from '../geo-map-canvas/geo-map-canvas.component';
import {Button} from 'primeng';
import { Router } from '@angular/router';

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
      private router: Router
  ) { }

  ngOnInit() {
    const that = this;
    const name = this.route.snapshot.paramMap.get('name');
    this.hotspotFile = this.route.snapshot.paramMap.get('hotspotfile')
    this.mapService.getMap(name).then((geoMap) => this.geoMap = geoMap);
  }

  handleClick(geoMapCanvas: GeoMapCanvasComponent, pbutton: Button ) {
    const hiddenNames = geoMapCanvas.toggleEmptyChecked();
    geoMapCanvas.updateImageSrc();

    pbutton.icon = hiddenNames ? `pi pi-check` : `pi`;
    pbutton.label = hiddenNames ? `Show Names` : `Hide Names`;
  }

  goBack() {
    this.router.navigateByUrl('');
  }
}
