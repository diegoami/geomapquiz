import {AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';

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
export class GeoMapDetailComponent implements OnInit, AfterViewInit {
  private geoMap: GeoMap;
  hotspotFile: string;
  quiz = 0;
  startVisible = false;
  hotspotToGuess = '';
  mapDetailHeader = '';


  @ViewChildren('geoMapCanvas')
  public geoMapCanvasQueryList: QueryList<GeoMapCanvasComponent>;
  private geoMapCanvas: GeoMapCanvasComponent;


  @ViewChildren('quizButton')
  public quizButtonQueryList: QueryList<Button>;
  private quizButton: Button;

  constructor(
      private route: ActivatedRoute,
      private mapService: GeoMapService,
      private router: Router
  ) { }

  ngOnInit() {
    const name = this.route.snapshot.paramMap.get('name');
    this.hotspotFile = this.route.snapshot.paramMap.get('hotspotfile');

    this.mapService.getMap(name).then(
        (geoMap) => this.geoMap = geoMap
    );
  }


  public ngAfterViewInit(): void {
    this.geoMapCanvasQueryList.changes.subscribe((comps: QueryList<GeoMapCanvasComponent>) => {
      this.geoMapCanvas = comps.first;
      this.mapDetailHeader = `${this.geoMap.name} - ${this.hotspotFile}`;
      if (this.route.snapshot.queryParamMap.get('quiz') === '1') {
        this.geoMapCanvas.toggleQuizChecked();
        this.geoMapCanvas.updateImageSrc();
        this.startVisible = true;
      }
    });
    this.quizButtonQueryList.changes.subscribe((comps: QueryList<Button>) => {
      this.quizButton = comps.first;
      if (this.route.snapshot.queryParamMap.get('quiz') === '1') {
        this.quizButton.icon = `pi pi-check`;
        this.quizButton.label = `Quiz`;
      }
    });
  }

  toggleQuiz(geoMapCanvas: GeoMapCanvasComponent, pbutton: Button ) {
    const quizMode = geoMapCanvas.toggleQuizChecked();
    geoMapCanvas.updateImageSrc();
    console.log(`toggleQuiz: ${quizMode}`)
    pbutton.icon = quizMode ? `pi pi-check` : `pi`;
    this.mapDetailHeader = quizMode ? `` : `${this.geoMap.name} - ${this.hotspotFile}`;
    this.startVisible = quizMode;
  }

  goBack() {
    this.router.navigateByUrl('geomapview');
  }

  startQuiz(): void {
    if (!this.geoMapCanvas.quizChecked) {
      this.toggleQuiz(this.geoMapCanvas, this.quizButton);
    }

    this.hotspotToGuess = this.geoMapCanvas.startQuiz();
    this.mapDetailHeader = this.hotspotToGuess;
    this.geoMapCanvas.updateImageSrc();
  }

  onGuess(event): void {
    const key = event;
    console.log(`Guessed: ${key}`)
    if (key === this.hotspotToGuess) {
      console.log(`hotspot guessed: ${this.hotspotToGuess}`)
      this.hotspotToGuess = this.geoMapCanvas.findHotspotNotSelected();
      this.mapDetailHeader = this.hotspotToGuess;
    } else {
      console.log(`Removing hotspot: ${key}, should have guessed ${this.hotspotToGuess}`)
      setTimeout(() => this.geoMapCanvas.removeHotspot(key), 500);
    }
  }
}
