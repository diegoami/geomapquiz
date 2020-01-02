import {Hotspot} from './hotspot';


export class HotspotList {
  hotspots: Hotspot[] = new Array<Hotspot>();

  constructor(pointsFile: string) {
    this.parsePointsFile(pointsFile);
  }

  parsePointsFile(pointsFile): Hotspot[] {
    const pointLines = pointsFile .split('\n');
    const that = this;
    pointLines.forEach( (value) => {
      const hotspot = new Hotspot(value);
      if (hotspot.isDefined()) {
        that.hotspots.push(hotspot);
      } else {
        // alert("Could not parse : "+$(this));
      }
    });
    return this.hotspots;
  }

  findHotspot(hotspotName: string) {
    this.hotspots.find( (hotspot) =>  hotspot.hotspotName === hotspotName);
  }

  getAllHotspots(): string[] {
    return this.hotspots.map((hotspot) => hotspot.hotspotName);
  }

}
