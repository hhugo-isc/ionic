import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Booking } from './booking.model';
import { BookingService } from './booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  public loadedBookings: Booking[] = [];
  bookingsSubscription!: Subscription;
  isLoading = false;
  constructor(
    private bookinsService: BookingService,
    private loadingController: LoadingController
  ) {}

  ionViewWillEnter() {
    this.isLoading = true;
    this.bookinsService.fetchBookings().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnInit() {
    this.bookingsSubscription = this.bookinsService.bookings.subscribe(
      (bookings) => {
        this.loadedBookings = bookings;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.bookingsSubscription) {
      this.bookingsSubscription.unsubscribe();
    }
  }

  onCancelBooking(bookingId: string, sliding: IonItemSliding) {
    sliding.close();
    this.loadingController
      .create({ message: 'Deleting booking...' })
      .then((loadingElement) => {
        loadingElement.present();
        this.bookinsService.cancelBooking(bookingId).subscribe(() => {
          loadingElement.dismiss();
        });
      });
  }
}
