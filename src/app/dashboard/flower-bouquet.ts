import { Component, input } from '@angular/core';



@Component({

  selector: 'app-flower-bouquet',

  standalone: true,

  host: {

    class: 'flower-bouquet',

    '[class.flower-bouquet--left]': 'side() === "left"',

    '[class.flower-bouquet--right]': 'side() === "right"',

    'aria-hidden': 'true',

  },

  templateUrl: './flower-bouquet.html',

  styleUrl: './flower-bouquet.css',

})

export class FlowerBouquet {

  side = input<'left' | 'right'>('left');

}

