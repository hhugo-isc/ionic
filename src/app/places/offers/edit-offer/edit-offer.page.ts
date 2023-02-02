import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  form!: FormGroup;
  place!: Place;
  placesSubscription!: Subscription;
  isLoading: boolean = false;
  placeId!: string;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private placesService: PlacesService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      if (!params.has('placeId')) {
        this.navController.navigateBack('/places/tabs/offers');
        return;
      }
      this.placeId = params.get('placeId')!;
      this.isLoading = true;
      // this.place = this.placesService.getPlace(params.get('placeId')!);
      this.placesSubscription = this.placesService
        .getPlace(params.get('placeId')!)
        .subscribe(
          (place) => {
            this.place = place;
            this.form = new FormGroup({
              title: new FormControl(this.place.title, {
                updateOn: 'blur',
                validators: [Validators.required],
              }),
              description: new FormControl(this.place.description, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.maxLength(100)],
              }),
            });
            this.isLoading = false;
          },
          (error) => {
            this.alertController
              .create({
                header: 'An error occurred!',
                message: 'Place could not be fetched, Please try again later.!',
                buttons: [
                  {
                    text: 'okay',
                    handler: () => {
                      this.router.navigate(['/places/tabs/offers']);
                    },
                  },
                ],
              })
              .then((alertElement) => {
                alertElement.present();
              });
          }
        );
    });
  }

  ngOnDestroy(): void {
    if (this.placesSubscription) {
      this.placesSubscription.unsubscribe();
    }
  }

  onUpdateOffer() {
    if (!this.form.valid) {
      return;
    }
    this.loadingController
      .create({ message: 'Updating Place' })
      .then((loadingSpinner) => {
        loadingSpinner.present();
        this.placesService
          .updateOffer(
            this.place.id,
            this.form.value['title'],
            this.form.value['description']
          )
          .subscribe(() => {
            loadingSpinner.dismiss();
            this.router.navigate(['/places/tabs/offers']);
          });
      });
  }
}
