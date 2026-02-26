import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appClickLogger]',
  host: {
    '(click)': 'onClick()',
  },
})
export class ClickLogger {
  @Input() eventName: string = 'unknown';

  onClick() {
    console.log('[Analytics] Card Clicked: ', this.eventName);
  }
}
