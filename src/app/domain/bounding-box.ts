export class BoundingBox implements ClientRect {
    bottom: number;
    readonly height: number;
    left: number;
    right: number;
    top: number;
    readonly width: number;

    constructor (left: number, top: number, right: number, bottom: number) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.width = this.right - this.left;
        this.height = this.top - this.bottom;
    }
}


