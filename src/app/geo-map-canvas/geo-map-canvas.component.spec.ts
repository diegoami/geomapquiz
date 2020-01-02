import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoMapCanvasComponent } from './geo-map-canvas.component';

describe('GeoMapCanvasComponent', () => {
  let component: GeoMapCanvasComponent;
  let fixture: ComponentFixture<GeoMapCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeoMapCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoMapCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
