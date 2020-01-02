import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoMapDetailComponent } from './geo-map-detail.component';

describe('GeoMapDetailComponent', () => {
  let component: GeoMapDetailComponent;
  let fixture: ComponentFixture<GeoMapDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeoMapDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoMapDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
