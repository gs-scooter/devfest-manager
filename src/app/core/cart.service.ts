import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { TICKETS_URL } from './tokens';

interface TicketEntry {
  id: string;
  eventId: string;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly ticketsUrl = inject(TICKETS_URL);

  private readonly ticketIds = signal<string[]>([]);
  readonly count = computed(() => this.ticketIds().length);

  private loadTickets() {
    this.http.get<TicketEntry[]>(this.ticketsUrl).subscribe({
      next: (data) => {
        const ids = data.map((t) => t.eventId);
        this.ticketIds.set(ids);
      },
      error: (e) => console.error(e),
    });
  }

  addTicket(eventId: string) {
    const previousTickets = this.ticketIds();
    this.ticketIds.update((ids) => [...ids, eventId]);
    this.http.post(this.ticketsUrl, { eventId }).subscribe({
      next: () => console.log('Update successful'),
      error: (e) => {
        console.error('Update error: ', e);
        this.ticketIds.set(previousTickets);
      },
    });
  }
}
