import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places: BehaviorSubject<Place[]> = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Mangattan Mansion',
      'In the heart of New York City.',
      'https://static2.mansionglobal.com/production/media/article-images/2f6a5dc3d80ef19f3bc23ddc1e911adf/large_Screen-Shot-2017-12-07-at-12.11.10-PM.png',
      149.99,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    ),
    new Place(
      'p2',
      "L'Amour Toujours",
      'A romantic place in Paris',
      'https://static2.mansionglobal.com/production/media/article-images/2f6a5dc3d80ef19f3bc23ddc1e911adf/large_Screen-Shot-2017-12-07-at-12.11.10-PM.png',
      189.99,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'xyz'
    ),
    new Place(
      'p3',
      'The foggy place',
      'Not your Average city trip',
      'https://static2.mansionglobal.com/production/media/article-images/2f6a5dc3d80ef19f3bc23ddc1e911adf/large_Screen-Shot-2017-12-07-at-12.11.10-PM.png',
      99.99,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    ),
  ]);

  constructor(private authService: AuthService) {}

  get places() {
    return this._places.asObservable();
  }

  getPlace(id: string) {
    return this.places.pipe(
      take(1),
      map((places) => {
        return { ...places.find((place) => place.id === id)! };
      })
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    availableFrom: Date,
    availableTo: Date
  ) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://static2.mansionglobal.com/production/media/article-images/2f6a5dc3d80ef19f3bc23ddc1e911adf/large_Screen-Shot-2017-12-07-at-12.11.10-PM.png',
      price,
      availableFrom,
      availableTo,
      this.authService.userId
    );
    return this.places.pipe(
      take(1),
      delay(1000),
      tap((places) => {
        this._places.next(places.concat(newPlace));
      })
    );
  }

  updateOffer(placeId: string, title: string, description: string) {
    return this.places.pipe(
      take(1),
      delay(1000),
      tap((places) => {
        const updatedPlaceIndex = places.findIndex(
          (place) => place.id === placeId
        );
        const updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        this._places.next(updatedPlaces);
      })
    );
  }
}
