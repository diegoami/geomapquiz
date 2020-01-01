import { Component, OnInit } from '@angular/core';
import { Car } from './domain/car';
import { CarService } from './services/carservice';



@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],

})
export class AppComponent implements OnInit {

    ngOnInit() {
    }

}
