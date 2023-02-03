import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  ModalController,
} from '@ionic/angular';
import { map, of, switchMap } from 'rxjs';
import { Coordinates, PlaceLocation } from '../../../places/location.model';
import { environment } from 'src/environments/environment';
import { PlacesResponse } from '../../interfaces/places.interface';
import { MapScreenComponent } from '../../map-screen/map-screen.component';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { MapService } from '../../map.service';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  selectedLocationImage: string | undefined = undefined;
  isLoading: boolean = false;
  @Output() locationPick = new EventEmitter<PlaceLocation>();
  @Input() showPreview: boolean = false;

  constructor(
    private http: HttpClient,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private mapService: MapService
  ) {}

  ngOnInit() {}

  onPickLocation() {
    this.actionSheetController
      .create({
        header: 'Please Choose',
        buttons: [
          {
            text: 'Auto-Locate',
            handler: () => {
              this.locateUser();
            },
          },
          {
            text: 'Pick on Map',
            handler: () => {
              this.openMap();
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ],
      })
      .then((actionSheetEl) => {
        actionSheetEl.present();
      });
  }

  private locateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showErrorAlert();
      return;
    }
    this.isLoading = true;
    Geolocation.getCurrentPosition()
      .then((position) => {
        const coordinates: Coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.createPlace(coordinates.lat, coordinates.lng);
        this.isLoading = false;
      })
      .catch((err) => {
        console.log(err);

        this.isLoading = false;
        this.showErrorAlert();
      });
  }

  private showErrorAlert() {
    this.alertController
      .create({
        header: 'Could not fetch location',
        message: 'Please use the map to pick a location',
        buttons: ['okay'],
      })
      .then((alertElement) => {
        alertElement.present();
      });
  }

  private openMap() {
    this.modalController
      .create({ component: MapScreenComponent })
      .then((modalElement) => {
        modalElement.onDidDismiss().then((modalData) => {
          if (!modalData.data) {
            return;
          }
          const coordinates: Coordinates = {
            lat: modalData.data.lat,
            lng: modalData.data.lng,
          };
          this.createPlace(coordinates.lat, coordinates.lng);
        });
        modalElement.present();
      });
  }

  private createPlace(lat: number, lng: number) {
    this.isLoading = true;

    const pickedLocation: PlaceLocation = {
      lat: lat,
      lng: lng,
      address: null,
      staticMapImageUrl: null,
    };
    this.getAddress(lat, lng)
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
