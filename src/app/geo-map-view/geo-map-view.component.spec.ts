import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoMapViewComponent } from './geo-map-view.component';

describe('GeoMapViewComponent', () => {
  let component: GeoMapViewComponent;
  let fixture: ComponentFixture<GeoMapViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeoMapViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoMapViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
