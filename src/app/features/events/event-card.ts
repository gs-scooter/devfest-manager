import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, input, linkedSignal, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiCard } from '../../shared/ui-card';
import { ClickLogger } from '../../shared/directives/click-logger';

@Component({
  selector: 'app-event-card',
  imports: [DatePipe, RouterLink, NgOptimizedImage, UiCard, ClickLogger],
  hostDirectives: [
    {
      directive: ClickLogger,
      inputs: ['eventName: trackingId'],
    },
  ],
  template: `
    <app-ui-card>
      <div card-header class="relative h48 w-full bg-gray-200">
        <img
          [ngSrc]="image().replace('/images', '')"
          width="500"
          height="200"
          priority
          alt="Event Thumbnail"
          class="object-cover w-full h-full max-h-full max-w-full"
        />
      </div>

      <div class="p-6">
        <div class="flex justify-between items-center mt-4">
          <!-- TODO Mod 1: Add Date using DatePipe -->
          <p class="text-sm text-blue-600 font-semibold mb-2">
            {{ (date() | date: 'mediumDate') || 'TBA' }}
          </p>

          <!-- TODO Mod 1: Add daysUntil() using @let -->
          @let days = daysUntil();
          @if (days) {
            <div
              class="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm"
            >
              @if (days > 0) {
                {{ days }} days to go!
              } @else {
                Happening Now!
              }
            </div>
          }
        </div>

        <!-- TODO Mod 1: Add Title Input -->
        <h3 class="text-xl font-bold text-gray-800 my-2">{{ title() }}</h3>

        <div class="flex justify-between items-center mt-4">
          <!-- TODO Mod 1: Add Derived State (Like Button) -->
          <button
            (click)="toggleFavorite()"
            class="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
            [class.text-red-500]="isFavorite()"
          >
            {{ isFavorite() ? '♥' : '♡' }} Like
          </button>

          <!-- TODO Mod 1: Add Output -->
          <button
            (click)="removeEvent()"
            class="text-gray-400 text-sm hover:text-gray-600 cursor-pointer"
          >
            Remove
          </button>
        </div>
      </div>
      <div card-footer class="mt-4 text-right">
        <a
          class="text-blue-600 font-medium hover:underline cursor-pointer"
          [routerLink]="['event', id()]"
        >
          View Details →
        </a>
      </div>
    </app-ui-card>
  `,
})
export class EventCard {
  readonly id = input.required<string>();
  title = input.required<string>();
  image = input.required<string>();
  date = input<string>();
  initialLike = input(false);
  delete = output();

  public daysUntil = computed(() => {
    const eventDate = this.date();
    if (!eventDate) return null;

    const today = new Date();
    const targetDate = new Date(eventDate);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (24 * 60 * 60 * 1000));

    return diffDays;
  });

  public isFavorite = linkedSignal(() => this.initialLike());

  public toggleFavorite(): void {
    this.isFavorite.update((val) => !val);
  }

  public removeEvent() {
    this.delete.emit();
  }
}
