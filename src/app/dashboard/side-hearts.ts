import { Component, input } from '@angular/core';

@Component({
  selector: 'app-side-hearts',
  standalone: true,
  host: {
    class: 'side-hearts',
    '[class.side-hearts--left]': 'side() === "left"',
    '[class.side-hearts--right]': 'side() === "right"',
    'aria-hidden': 'true',
  },
  templateUrl: './side-hearts.html',
  styleUrl: './side-hearts.css',
})
export class SideHearts {
  side = input<'left' | 'right'>('left');
}
