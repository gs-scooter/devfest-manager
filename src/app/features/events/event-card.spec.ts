import { TestBed } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import { EventCard } from './event-card';
import { provideRouter } from '@angular/router';
import { ClickLogger } from '../../shared/directives/click-logger';
import { inputBinding, signal } from '@angular/core';

describe('EventCard', () => {
  async function setup() {
    await TestBed.configureTestingModule({
      imports: [EventCard, ClickLogger],
      providers: [provideRouter([])],
    }).compileComponents();

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);

    const fixture = TestBed.createComponent(EventCard);
    const component = fixture.componentInstance;

    // Set Default Required Inputs
    fixture.componentRef.setInput('title', 'Test Event');
    fixture.componentRef.setInput('image', 'img.jpg');
    fixture.componentRef.setInput('id', '1');

    return { fixture, component };
  }

  it('toggles favorite state on click', async () => {
    const { fixture, component } = await setup();

    // Assert Initial State
    expect(component.isFavorite()).toBe(false);

    // Act
    await fixture.whenStable(); // Wait for initial render

    // Find the button that contains "Like"
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const heartButton = Array.from(buttons).find((btn: any) =>
      btn.textContent.includes('Like'),
    ) as HTMLElement;

    if (!heartButton) throw new Error('Like button not found');

    heartButton.click();
    await fixture.whenStable(); // Wait for click update

    expect(heartButton.textContent).toContain('♥');
  });

  it('calculates computed daysUntil correctly', async () => {
    const { fixture, component } = await setup();

    // Set a date 5 days in the future
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    fixture.componentRef.setInput('date', futureDate.toISOString());

    // Note: Computed signals are lazy and synchronous, so reading them
    // triggers recalculation. No flushEffects() needed!

    expect(component.daysUntil()).toBe(5);
  });
});
