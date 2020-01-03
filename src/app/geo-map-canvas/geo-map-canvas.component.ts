import {Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {GeoMap} from '../domain/geo-map';
import {HotspotService} from '../hotspot.service';
import {HotspotList} from '../domain/hotspotlist';
import {Hotspot} from '../domain/hotspot';
import {BoundingBox} from '../domain/bounding-box';

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
  private bboxes: Map<string, ClientRect> = new Map<string, ClientRect>();

  private hiddenNames = false;
  hotspotList: HotspotList;
  scaling = 1;

  @Input('geoMap') geoMap: GeoMap;
  @Input('hotspotFile') hotspotFile: string;
  @Input('currentHotspot') currentHotspot: string;


  @ViewChild('canvas', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;

  constructor(
      private hotspotService: HotspotService
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
      this.loadHotspotsFromFile();

    };
  }

  loadHotspotsFromFile(): void {
    const currentGeoMap = this;
    currentGeoMap.hotspotService.getHotspotDefinition(this.geoMap, this.hotspotFile).subscribe(
        function (hotspotDefinition) {
          currentGeoMap.hotspotDefinition = hotspotDefinition;
          currentGeoMap.hotspotList = currentGeoMap.hotspotService.getHotspotList(currentGeoMap.hotspotDefinition);
          currentGeoMap.loadHotspotsInCanvas();
        }
    );
  }

  toggleEmptyChecked(): boolean {
    this.hiddenNames = !this.hiddenNames;
    return this.hiddenNames;
  }

  writeCurrentHotspotName(): void {
    console.log('In writeCurrentHotspotName');
    if (this.currentHotspot) {
      this.ctx.font = '25px Verdana';
      const bwidth = this.ctx.measureText(this.currentHotspot).width;

      this.ctx.fillStyle = 'green';
      const currentBoundingBox = this.bboxes.get(this.currentHotspot);
      const spaceToRight = this.image.width - currentBoundingBox.right;
      const spaceToLeft = currentBoundingBox.left;
      const centerVerticalBoundingBox = (currentBoundingBox.bottom - currentBoundingBox.top) / 2 + currentBoundingBox.top;
      const centerHorizontalBoundingBox = (currentBoundingBox.right - currentBoundingBox.left) / 2 + currentBoundingBox.left;
      const startCaption = centerHorizontalBoundingBox - bwidth / 2;
      // if (spaceToRight > spaceToLeft) {
      //   this.ctx.fillText(this.currentHotspot, currentBoundingBox.right, centerBoundingBox);
      //   console.log(`Writing ${this.currentHotspot} at ${currentBoundingBox.right}, ${centerBoundingBox}`);
      // } else {
      //   this.ctx.fillText(this.currentHotspot, currentBoundingBox.left - bwidth, centerBoundingBox);
      //   console.log(`Writing ${this.currentHotspot} at ${currentBoundingBox.left - bwidth}, ${centerBoundingBox}`);
      // }
      //
      this.ctx.fillText(this.currentHotspot, startCaption, centerVerticalBoundingBox);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    }
  }

  updateImageSrc() {
    console.log(`updateImageSrc: hiddenNames = ${this.hiddenNames}`);
    const current_img = this.hiddenNames ? this.geoMap.imgEmpty : this.geoMap.imgComp;
    this.image.src = `assets/maps/${this.geoMap.dir}${current_img}`;
    this.ctx.drawImage(this.image, 0, 0, this.geoMap.width, this.geoMap.height);
    if (this.currentHotspot) {
      const currentPath = this.paths.get(this.currentHotspot);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      this.ctx.fill(currentPath);
      if (this.hiddenNames) {
        this.writeCurrentHotspotName();
      }
    }
  }

  loadHotspotsInCanvas() {
    const min = Math.min;
    const max = Math.max;

    for (const obj of this.hotspotList.hotspots) {
      const hotspot: Hotspot = <Hotspot>obj;

      const name = hotspot.hotspotName;
      if (hotspot.getShape() === 'circle') {
        const [centerX, centerY, radius] = hotspot.getCoords(1)[0];
        this.ctx.beginPath();
        this.paths.set(name, new Path2D());
        this.paths.get(name).arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.closePath();
        this.bboxes.set(name, new BoundingBox(centerX - radius, centerY - radius, centerX + radius, centerY + radius ));
      } else {
        const all_coords = hotspot.getCoords(1);
        let minX = 0, minY = 0, maxX = this.image.width, maxY = this.image.height;
        this.ctx.beginPath();
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        this.paths.set(name, new Path2D());
        all_coords.forEach( (coord, index) => {
          const [x, y] = coord;
          minX = max(minX, x), minY = max(minY, y), maxX = min(maxX, x), maxY = min(maxY, y);
          if (index === 0) {
            this.paths.get(name).moveTo(x, y);
          } else {
            this.paths.get(name).lineTo(x, y);
          }
        });
        this.paths.get(name).lineTo(all_coords[0][0], all_coords[0][1]);
        this.ctx.closePath();
        console.log(name)
        this.bboxes.set(name, new BoundingBox(minX, minY, maxX, maxY));
      }
    }
  }



  @HostListener('mousedown', ['$event'])
  onMouseDown(event) {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.currentHotspot = '';
    this.paths.forEach((path: Path2D, key: string) => {
      if (this.ctx.isPointInPath(path, x, y, 'evenodd')) {
        this.ctx.drawImage(this.image, 0, 0, this.geoMap.width, this.geoMap.height);
        this.currentHotspot = key;
        this.ctx.fill(path);
        if (this.hiddenNames) {
          this.writeCurrentHotspotName();
        }
      }
    });
  }

}
