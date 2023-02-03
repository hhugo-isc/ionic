import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MapModalComponent } from './map-modal/map-modal.component';
import { MapScreenComponent } from './map-screen/map-screen.component';
import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';
import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';

@NgModule({
  declarations: [
    LocationPickerComponent,
    ImagePickerComponent,
    MapScreenComponent,
    MapModalComponent,
  ],
  imports: [CommonModule, IonicModule],
  exports: [
    LocationPickerComponent,
    ImagePickerComponent,
    MapScreenComponent,
    MapModalComponent,
  ],
  entryComponents: [MapModalComponent],
})
export class SharedModule {}
