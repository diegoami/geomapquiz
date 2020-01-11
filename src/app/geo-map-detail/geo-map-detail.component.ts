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
  hide = 0;
  quiz = 0;
  startVisible = false;


  @ViewChildren('geoMapCanvas')
  public geoMapCanvasQueryList: QueryList<GeoMapCanvasComponent>;
  private geoMapCanvas: GeoMapCanvasComponent;


  @ViewChildren('quizButton')
  public quizButtonQueryList: QueryList<Button>;
  private quizButton: Button;

  @ViewChildren('hideButton')
  public hideButtonQueryList: QueryList<Button>;
  private hideButton: Button;

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
      if (this.route.snapshot.queryParamMap.get('hide') === '1') {
        this.geoMapCanvas.toggleEmptyChecked();
        this.geoMapCanvas.updateImageSrc();
      }
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
    this.hideButtonQueryList.changes.subscribe((comps: QueryList<Button>) => {
      this.hideButton = comps.first;
      if (this.route.snapshot.queryParamMap.get('hide') === '1') {
        this.hideButton.icon = `pi pi-check`;
        this.hideButton.label = `Hide`;
      }
    });
  }

  toggleHide(geoMapCanvas: GeoMapCanvasComponent, pbutton: Button ) {
    const hiddenNames = geoMapCanvas.toggleEmptyChecked();
    geoMapCanvas.updateImageSrc();
    console.log(`toggleHide: ${hiddenNames}`)
    pbutton.icon = hiddenNames ? `pi pi-check` : `pi`;
    pbutton.label = hiddenNames ? `Hide` : `Show`;
  }

  toggleQuiz(geoMapCanvas: GeoMapCanvasComponent, pbutton: Button ) {
    const quizMode = geoMapCanvas.toggleQuizChecked();
    geoMapCanvas.updateImageSrc();
    console.log(`toggleQuiz: ${quizMode}`)
    pbutton.icon = quizMode ? `pi pi-check` : `pi`;
    pbutton.label = quizMode ? `Quiz` : `Browse`;
    this.startVisible = quizMode;
  }

  goBack() {
    this.router.navigateByUrl('geomapview');
  }
}
