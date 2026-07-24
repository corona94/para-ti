import { Component, input } from '@angular/core';

@Component({
  selector: 'app-side-storm',
  standalone: true,
  host: {
    class: 'side-storm',
    '[class.side-storm--left]': 'side() === "left"',
    '[class.side-storm--right]': 'side() === "right"',
    'aria-hidden': 'true',
  },
  templateUrl: './side-storm.html',
  styleUrl: './side-storm.css',
})
export class SideStorm {
  side = input<'left' | 'right'>('left');
}
