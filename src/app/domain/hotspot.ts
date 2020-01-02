
export class Hotspot {
  private file: string;
  public hotspotName: string;
  public hotspotType: string;
  private hotpointString: string;
  pcoords: string[];
  private defined: boolean;

  constructor(private lineHotSpot: string) {
    const pointRegExp = /([\w\.]+)\/([\w\s\'\d\-]+)\=([\d\-]+);([\d,;]+);/;

    const groups = pointRegExp.exec(lineHotSpot);
    if (groups != null && typeof(groups) !== undefined) {
      this.file = groups[1];
      this.hotspotName = groups[2];
      this.hotspotType = groups[3];
      this.hotpointString = groups[4];
      this.pcoords = this.hotpointString.split(';');
      this.defined = true;
    } else {
      this.defined = false;
    }
  }

  isDefined(): boolean  {
    return this.defined;
  }

  getShape(): string {
    if (this.hotspotType == '-3') {
      return 'circle';
    } else {
      return 'poly';
    }
  }

  getCenter(scaling: number): Array<number> {
    let xmax = 0, ymax = 0, xmin = 10000000, ymin = 10000000;
    for (let i = 0; i < this.pcoords.length; i++) {
      const c = this.pcoords[i].split(',').map((x) => parseInt(x, 10));
      if (c[0] > xmax)  {
         xmax = Number(c[0]);
      }
      if (c[0] < xmin) {
        xmin = Number(c[0]);
      }
      if (c[1] > ymax) {
        ymax = Number(c[1]);
      }
      if (c[1] < ymin) {
        ymin = Number(c[1]);
      }

    }
    const xres = xmin + (xmax - xmin) / 2;
    const yres = ymin + (ymax - ymin) / 2;
    const rlist = [xres, yres];
    return rlist;
  }

  getCoords(scaling: number): number[][] {
    if (scaling !== 1) {
      for (let i = 0 ; i < this.pcoords.length; i++) {
        const hotSpotXY =  this.pcoords[i].split(',').map( (x) => parseInt(x, 10));
        this.pcoords[i] = (hotSpotXY[0] * scaling).toString() + ',' + (hotSpotXY[1] * scaling).toString();
      }
    }
    if (this.hotspotType !== '-3') {
      return this.pcoords.map((c) => {
        const [x, y] = c.split(',');
        return [parseInt(x, 10), parseInt(y, 10)];
      });
    } else {

      const firstPoint = this.pcoords[0].split(',').map((x) => parseInt(x, 10));
      const secondPoint = this.pcoords[1].split(',').map((x) => parseInt(x, 10));
      const centerPoint = [
        (firstPoint[0] + secondPoint[0]) / 2,
        (firstPoint[1] + secondPoint[1]) / 2
      ];

      const radius =
        Math.max(
          Math.abs((firstPoint[0] - secondPoint[0]) / 2),
          Math.abs((firstPoint[1] - secondPoint[1]) / 2)
        );

      return [[centerPoint[0], centerPoint[1], radius]];
    }
  }


}




