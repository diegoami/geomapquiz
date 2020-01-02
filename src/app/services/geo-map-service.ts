import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GeoMap } from '../domain/geo-map';
import {of} from 'rxjs';

@Injectable()
export class GeoMapService {
    private data: GeoMap[];

    constructor(private http: HttpClient) {}

    getGeoMaps() {
        if (this.data) {
            return of(this.data).toPromise();
        } else {
           return this.http.get<any>('assets/data/geo-maps.json')
                .toPromise()
                .then(res => <GeoMap[]>res.data)
                .then((data) => {
                    this.data = data;
                    return this.data;
                });
        }
    }

    getMap(name: string) {
        return this.getGeoMaps().then((data) => data.find((element) => element.name === name));
    }
}
