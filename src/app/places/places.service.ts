import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      'p1',
      'Mangattan Mansion',
      'In the heart of New York City.',
      'https://static2.mansionglobal.com/production/media/article-images/2f6a5dc3d80ef19f3bc23ddc1e911adf/large_Screen-Shot-2017-12-07-at-12.11.10-PM.png',
      149.99
    ),
    new Place(
      'p2',
      "L'Amour Toujours",
      'A romantic place in Paris',
      'https://static2.mansionglobal.com/production/media/article-images/2f6a5dc3d80ef19f3bc23ddc1e911adf/large_Screen-Shot-2017-12-07-at-12.11.10-PM.png',
      189.99
    ),
    new Place(
      'p3',
      'The foggy place',
      'Not your Average city trip',
      'https://static2.mansionglobal.com/production/media/article-images/2f6a5dc3d80ef19f3bc23ddc1e911adf/large_Screen-Shot-2017-12-07-at-12.11.10-PM.png',
      99.99
    ),
  ];

  constructor() {}

  get places() {
    return [...this._places];
  }

  getPlace(id: string) {
    return { ...this._places.find((p) => p.id === id)! };
  }
}
