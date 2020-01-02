import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {GeoMap} from '../domain/geo-map';

@Component({
  selector: 'app-geo-map-canvas',
  templateUrl: './geo-map-canvas.component.html',
  styleUrls: ['./geo-map-canvas.component.css']
})
export class GeoMapCanvasComponent implements OnInit {

  private hotspotDefinition: string;
  private ctx: CanvasRenderingContext2D;
  private image: any;
  private paths: Map<string, Path2D> = new Map<string, Path2D>();
  private currentPath: Path2D;
//  hotspotList: HotspotList;
  scaling = 1;

  @Input('geoMap') geoMap: GeoMap;
  @Input('hotspotFile') hotspotFile: string;
  @Input('currentHotspot') currentHotspot: string;

  @ViewChild('canvas', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;

  constructor(
  ) { }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.image = new Image();
    this.image.src = `assets/maps/${this.geoMap.dir}${this.geoMap.imgComp}`;
    this.loadImage();
  }

  loadImage(): void {
    this.image.onload = () => {
      this.ctx.drawImage(this.image, 0, 0, this.geoMap.width, this.geoMap.height);
    };
  }


}
