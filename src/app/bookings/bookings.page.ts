import { Component, OnInit } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Booking } from './booking.model';
import { BookingService } from './booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  public loadedBookings: Booking[] = [];
  constructor(private bookinsService: BookingService) {}

  ngOnInit() {
    this.loadedBookings = this.bookinsService.bookings;
  }

  onCancelBooking(offerId: string, sliding: IonItemSliding) {
    sliding.close();
    // cancel booking with id offerId
  }
}
