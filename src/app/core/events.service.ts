import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { DevFestEvent } from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private apiUrl = 'http://localhost:3000/events';
  private http = inject(HttpClient);

  public deleteEvent(id: string) {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  public getEventResource(id: Signal<string>) {
    return httpResource<DevFestEvent>(() => {
      const eventId = id();
      return `${this.apiUrl}/${eventId}`;
    });
  }

  public getEventsResource(query: Signal<string>) {
    return httpResource<DevFestEvent[]>(() => {
      const q = query();
      return this.apiUrl + (q ? `?q=${q}` : '');
    });
  }
}
