import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { AppComponent } from './app.component';
import {AppRoutingModule} from './app-routing/app-routing.module';
import { GeoMapViewComponent } from './geo-map-view/geo-map-view.component';
import {
    CardModule,
    CheckboxModule,
    DataViewModule,
    DropdownModule,
    OverlayPanelModule,
    PanelModule,
    TabViewModule,
    TooltipModule
} from 'primeng';
import {GeoMapService} from './services/geo-map-service';
import { GeoMapDetailComponent } from './geo-map-detail/geo-map-detail.component';
import { GeoMapCanvasComponent } from './geo-map-canvas/geo-map-canvas.component';
import {StorageServiceModule} from 'ngx-webstorage-service';


@NgModule({
    declarations: [
        AppComponent,
        GeoMapViewComponent,
        GeoMapDetailComponent,
        GeoMapCanvasComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        TableModule,
        HttpClientModule,
        DialogModule,
        ButtonModule,
        AppRoutingModule,
        FormsModule,
        DataViewModule,
        PanelModule,
        DialogModule,
        DropdownModule,
        TabViewModule,
        ButtonModule,
        CardModule,
        CheckboxModule,
        StorageServiceModule,
        TooltipModule,
        OverlayPanelModule
    ],
    providers: [HttpClientModule, GeoMapService],
    bootstrap: [AppComponent]
})
export class AppModule { }
