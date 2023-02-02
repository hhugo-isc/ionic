import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Map, Popup, Marker } from 'mapbox-gl';
import { MapService } from '../map.service';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit {
  @ViewChild('mapa', { static: true }) divMapa!: ElementRef<HTMLElement>;
  @Input() center: [number, number] | undefined = undefined;
  @Input() selectable: boolean = true;
  @Input() closeButtonText: string = 'Cancel';
  @Input() title: string = 'Pick Location';

  constructor(
    private modalController: ModalController,
    private mapService: MapService
  ) {}

  ngOnInit() {}

  get isUserLocationReady() {
    return this.mapService.isUserLoactionReady;
  }

  ngAfterViewInit(): void {
    if (!this.mapService.userLocation && !this.center) {
      throw new Error('No hay userlocation');
    }

    const mapa = new Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: this.center || this.mapService.userLocation,
      zoom: 14,
    });

    if (this.center) {
      const popup = new Popup().setHTML(`
        <h6>Picked location</h6>
      `);

      new Marker({ color: 'red' })
        .setLngLat(this.center)
        .setPopup(popup)
        .addTo(mapa);
      console.log('here');
    }

    if (this.selectable) {
      mapa.on('click', (e) => {
        const selectedCords = { lat: e.lngLat.lat, lng: e.lngLat.lng };
        this.modalController.dismiss(selectedCords);
      });
    }

    this.mapService.setMap(mapa);
  }

  onCancel() {
    this.modalController.dismiss();
  }
}
