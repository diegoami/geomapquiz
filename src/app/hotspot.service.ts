import { Injectable } from '@angular/core';
import {GeoMap} from './domain/geo-map';
import {HotspotList} from './domain/hotspotlist';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotspotService {
  private mapUrl = 'assets/maps/';

  constructor(private http: HttpClient) { }

  getHotspotDefinition(map: GeoMap, hotspotFile: string): Observable<string> {
    const totalPath = this.mapUrl + map.dir + hotspotFile + '.hsf';
    return this.http.get(totalPath, {responseType: 'text'});

  }

  getHotspotList(hotspotDefinition: string): HotspotList {
    const hotspotList = new HotspotList(hotspotDefinition);
    return hotspotList;
  }

}
