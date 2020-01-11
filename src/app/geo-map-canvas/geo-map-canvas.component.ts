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

  hiddenNames = false;
  quizChecked = false;

  private hotspotList: HotspotList;
  private currentHotspot: string;
  private quizHotspots: string[] = [];

  availableHotspots: string[] = [];

  @Input('geoMap') geoMap: GeoMap;
  @Input('hotspotFile') hotspotFile: string;

  @ViewChild('canvas', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;

  constructor(
      private hotspotService: HotspotService
  ) { }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.image = new Image();
    this.image.src = `assets/maps/${this.geoMap.dir}${this.geoMap.imgComp}`;
    this.loadHotspotsFromFile();
    this.loadImage();

  }

  loadImage(): void {
    this.image.onload = () => {
      console.log(`loading Image: ${this.geoMap.name}`)
      this.ctx.drawImage(this.image, 0, 0, this.geoMap.width, this.geoMap.height);
      if (Object.keys(this.paths).length === 0 || Object.keys(this.bboxes).length === 0) {
        this.loadHotspotsFromFile();
      }
      const hotspots_to_add = (this.quizChecked) ? this.quizHotspots : [this.currentHotspot];
      hotspots_to_add.forEach((hotspot: string) => {
        if (hotspot) {
          console.log(`updatingHotspot: ${hotspot}`);
          const currentPath = this.paths.get(hotspot);
          this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          this.ctx.fill(currentPath);
          if (this.hiddenNames) {
            this.writeCurrentHotspotName(hotspot);
          }
        }
      });
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


  toggleQuizChecked(): boolean {
    this.quizChecked = !this.quizChecked;
    this.hiddenNames = !this.hiddenNames;
    this.currentHotspot = undefined;
    this.quizHotspots = [];
    return this.quizChecked;
  }

  writeCurrentHotspotName(hotspot: string): void {
    console.log(`In writeCurrentHotspotName: ${hotspot}`);
    if (hotspot) {
      this.ctx.font = '25px Verdana';
      const bwidth = this.ctx.measureText(hotspot).width;

      this.ctx.fillStyle = 'green';
      const currentBoundingBox = this.bboxes.get(hotspot);

      const centerVerticalBoundingBox = (currentBoundingBox.bottom - currentBoundingBox.top) / 2 + currentBoundingBox.top;
      const centerHorizontalBoundingBox = (currentBoundingBox.right - currentBoundingBox.left) / 2 + currentBoundingBox.left;
      const startCaption = centerHorizontalBoundingBox - bwidth / 2;
      this.ctx.fillText(hotspot, startCaption, centerVerticalBoundingBox);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    }
  }

  updateImageSrc() {
    console.log(`updateImageSrc: hiddenNames = ${this.hiddenNames}`);

    const current_img = this.hiddenNames ? this.geoMap.imgEmpty : this.geoMap.imgComp;
    this.image.src = `assets/maps/${this.geoMap.dir}${current_img}`;


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
        this.bboxes.set(name, new BoundingBox(minX, minY, maxX, maxY));
      }
      this.availableHotspots.push(name);
    }
  }



  @HostListener('mousedown', ['$event'])
  onMouseDown(event) {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.paths.forEach((path: Path2D, key: string) => {
      if (this.ctx.isPointInPath(path, x, y, 'evenodd')) {
        if (this.quizChecked) {
          if (this.quizHotspots.includes(key)) {
            const found_index = this.quizHotspots.indexOf(key);
            this.quizHotspots.splice(found_index, 1);
          } else {
            this.quizHotspots.push(key);
          }

        } else {
          if (this.currentHotspot === key) {
            this.currentHotspot = undefined;
          } else {
            this.currentHotspot = key;
          }
        }

      }
    });
    this.updateImageSrc();
  }

}
