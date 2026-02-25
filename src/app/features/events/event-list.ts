import { Component, inject, signal } from '@angular/core';
import { EventCard } from './event-card';
import { SearchBar } from './search-bar';
import { EventsService } from '../../core/events.service';

@Component({
  selector: 'app-event-list',
  imports: [EventCard, SearchBar],
  template: `
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Upcoming Events</h1>
      <app-search-bar [(query)]="searchQuery" />
      Searching for: {{ searchQuery() }}
    </div>

    @if (events.isLoading()) {
      <div class="text-center py-12 text-gray-500 animate-pulse">Loading events...</div>
    } @else {
      <!-- TODO Mod 2: Wrap in @if (events.isLoading()) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- TODO Mod 2: Use @for to iterate over resource -->

        @if (events.hasValue()) {
          @for (event of events.value(); track $index) {
            <app-event-card
              [id]="event.id"
              [title]="event.title"
              [image]="event.image"
              [date]="event.date"
              [trackingId]="'event_card_' + event.id"
              (delete)="deleteEvent(event.id)"
            />
          } @empty {
            <p class="col-span-3 text-center text-gray-500">No events found.</p>
          }
        }
      </div>
    }
  `,
})
export class EventList {
  readonly eventsService = inject(EventsService);
  public searchQuery = signal('');
  readonly events = this.eventsService.getEventsResource(this.searchQuery);

  public deleteEvent(id: string) {
    this.eventsService.deleteEvent(id).subscribe({
      next: () => {
        this.events.reload();
      },
      error: (e) => {
        console.error('Delete event failed.', e);
        alert('Could not delete event');
      },
    });
  }
}
