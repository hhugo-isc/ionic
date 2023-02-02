import { Injectable } from '@angular/core';
import { Map } from 'mapbox-gl';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private _map: Map | undefined;
  public userLocation: [number, number] | undefined;
  public isLoadingPlaces: boolean = false;

  constructor() {
    this.getUserLocation();
  }

  get isMapReady(): boolean {
    return !!this._map;
  }

  get map() {
    return this._map;
  }

  setMap(mapa: Map) {
    this._map = mapa;
  }

  get isUserLoactionReady(): boolean {
    return !!this.userLocation;
  }

  getUserLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.userLocation = [coords.longitude, coords.latitude];
          resolve(this.userLocation);
        },
        (error) => {
          alert('No se pudo obtener la geolocalizacion');
          reject(error);
        }
      );
    });
  }
}
