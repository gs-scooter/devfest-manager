import { DatePipe } from '@angular/common';
import { Component, computed, input, linkedSignal, output } from '@angular/core';

@Component({
  selector: 'app-event-card',
  imports: [DatePipe],
  template: `
    <div
      class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div class="relative h48 w-full bg-gray-200">
        <img
          [src]="image()"
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
            {{ isFavorite() ? '❤️' : '♡' }} Like
          </button>

          <!-- TODO Mod 1: Add Output -->
          <button
            (click)="removeEvent()"
            class="text-gray-400 text-sm hover:text-gray-600 cursor-pointer"
          >
            Remove
          </button>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-100 text-right">
          <a class="text-blue-600 font-medium hover:underline cursor-pointer"> View Details → </a>
        </div>
      </div>
    </div>
  `,
})
export class EventCard {
  readonly title = input.required<string>();
  readonly image = input.required<string>();
  readonly date = input<string>();
  readonly initialLike = input(false);
  readonly delete = output();

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
