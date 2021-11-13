import { Coordinate } from "ol/coordinate";

export interface MapLocation {
    center: Coordinate,
    zoom: number,
    rotation: number
}