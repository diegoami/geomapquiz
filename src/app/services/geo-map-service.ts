import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GeoMap } from '../domain/geo-map';

@Injectable()
export class GeoMapService {

    constructor(private http: HttpClient) {}

    getGeoMaps() {
        return this.http.get<any>('assets/data/geo-maps.json')
            .toPromise()
            .then(res => <GeoMap[]> res.data)
            .then(data => data);
    }
}
