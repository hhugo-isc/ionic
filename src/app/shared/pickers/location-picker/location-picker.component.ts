import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { map, of, switchMap } from 'rxjs';
import { PlaceLocation } from '../../../places/location.model';
import { environment } from 'src/environments/environment';
import { PlacesResponse } from '../../interfaces/places.interface';
import { MapScreenComponent } from '../../map-screen/map-screen.component';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  selectedLocationImage: string | undefined = undefined;
  isLoading: boolean = false;
  @Output() locationPick = new EventEmitter<PlaceLocation>();

  constructor(
    private modalController: ModalController,
    private http: HttpClient
  ) {}

  ngOnInit() {}

  onPickLocation() {
    this.modalController
      .create({ component: MapScreenComponent })
      .then((modalElement) => {
        modalElement.onDidDismiss().then((modalData) => {
          if (!modalData.data) {
            return;
          }
          const pickedLocation: PlaceLocation = {
            lat: modalData.data.lat,
            lng: modalData.data.lng,
            address: null,
            staticMapImageUrl: null,
          };
          this.isLoading = true;
          this.getAddress(modalData.data.lat, modalData.data.lng)
            .pipe(
              switchMap((address) => {
                pickedLocation.address = address;
                return of(
                  this.getMapImage(pickedLocation.lat, pickedLocation.lng, 16)
                );
              })
            )
            .subscribe((staticMapImageUrl: string) => {
              pickedLocation.staticMapImageUrl = staticMapImageUrl;
              this.selectedLocationImage = staticMapImageUrl;
              this.isLoading = false;
              this.locationPick.emit(pickedLocation);
            });
        });
        modalElement.present();
      });
  }

  private getAddress(lat: number, lng: number) {
    return this.http
      .get<PlacesResponse>(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`,
        { params: { access_token: environment.mapboxToken } }
      )
      .pipe(
        map((responseData) => {
          if (
            !responseData ||
            !responseData.features ||
            responseData.features.length <= 0
          ) {
            return null;
          } else {
            return responseData.features[0].place_name;
          }
        })
      );
  }

  private getMapImage(lat: number, lng: number, zoom: number) {
    const width = 400;
    const height = 400;
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-l+F00(${lng},${lat})/${lng},${lat},${zoom},20/${width}x${height}?access_token=${environment.mapboxToken}`;
  }
}
