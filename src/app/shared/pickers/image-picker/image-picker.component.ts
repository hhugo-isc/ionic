import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  selectedImage: string | undefined = '';
  @Output() imagePick = new EventEmitter<string | File>();
  @ViewChild('filePicker') filePicker!: ElementRef<HTMLInputElement>;
  userPicker: boolean = false;
  @Input() showPreview = false;
  constructor(private platform: Platform) {}

  ngOnInit() {
    if (
      (this.platform.is('mobile') && !this.platform.is('hybrid')) ||
      this.platform.is('desktop')
    ) {
      this.userPicker = true;
    }
  }

  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.filePicker.nativeElement.click();
      return;
    }

    Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 320,
      resultType: CameraResultType.DataUrl,
    })
      .then((image) => {
        this.selectedImage = image.dataUrl;
        this.imagePick.emit(image.dataUrl);
      })
      .catch((error) => {
        console.log(error);

        if (this.filePicker) {
          this.filePicker.nativeElement.click();
        }
      });
  }

  onFileChosen(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files![0];
    if (!pickedFile) {
      return;
    }

    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result?.toString();
      this.selectedImage = dataUrl;
      this.imagePick.emit(pickedFile);
    };
    fr.readAsDataURL(pickedFile);
  }
}
