import { Component, Input, OnInit } from '@angular/core';
import { MapService } from '../map.service';

@Component({
  selector: 'app-map-screen',
  templateUrl: './map-screen.component.html',
  styleUrls: ['./map-screen.component.scss'],
})
export class MapScreenComponent implements OnInit {
  @Input() center: [number, number] | undefined = undefined;
  @Input() selectable: boolean = true;
  @Input() closeButtonText: string = 'Cancel';
  @Input() title: string = 'Pick Location';

  constructor(private mapService: MapService) {}

  ngOnInit() {}

  get isUserLocationReady() {
    return this.mapService.isUserLoactionReady;
  }
}
