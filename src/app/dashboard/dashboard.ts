import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  ApplicationRef,
  Component,
  DestroyRef,
  inject,
  NgZone,
  PLATFORM_ID,
  signal,
} from '@angular/core';

import { FlowerBouquet } from './flower-bouquet';
import { SideHearts } from './side-hearts';
import { SideStorm } from './side-storm';
import { BackgroundMusicService } from '../background-music.service';
import { PlaylistVideo, YoutubePlaylist } from './youtube-playlist';

interface CornerImage {
  src: string;
  alt: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

interface GalleryItem {
  src: string;
  alt: string;
  type?: 'image' | 'video';
}

interface StoryItem {
  lines: string[];
  corners?: CornerImage[];
  gallery?: GalleryItem[];
  bouquets?: boolean;
  hearts?: boolean;
  storm?: boolean;
  musicTrack?: 'frankie';
  playlist?: PlaylistVideo[];
}

interface LineToken {
  text: string;
  start: number;
  isSpace: boolean;
}

type LetterKey = `${number}-${number}`;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FlowerBouquet, SideHearts, SideStorm, YoutubePlaylist],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly appRef = inject(ApplicationRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly backgroundMusic = inject(BackgroundMusicService);
  readonly startedSections = signal<Set<number>>(new Set());
  private readonly revealIntervals: ReturnType<typeof setInterval>[] = [];
  private readonly onViewportChange = () => {
    this.ngZone.run(() => this.checkSectionsInView());
  };

  readonly revealedLetters = signal<Set<LetterKey>>(new Set());

  /** Última sección (incluida) con efecto de letras cayendo. */
  private readonly lastAnimatedSectionIndex = 3;

  story: StoryItem[] = [
  {
    lines: ['Esto', 'es para ti...'],
    bouquets: true,
  },
  {
    lines: ['Hay historias', 'que merecen ser contadas...'],
    bouquets: true,
  },
  {
    lines: ['Personas que,', 'cuando llegan, lo cambian todo.'],
    bouquets: true,
  },
  {
    lines: ['Y tú eres esa persona,', 'Aida.'],
    bouquets: true,
  },
  {
    lines: ['Desde el primer día que te conocí, sentí miles de cosas por ti. Y tú sabes que es verdad, te lo dije muchas veces con emoción'],
    bouquets: true,
  },
  {
    
    lines: ['Fueron meses muy difíciles para mí, pero cuando estaba contigo, mi mundo cambiaba...'],
    bouquets: true,
  },
  {
    lines: ['No vengo a pedirte una repuesta o que hablemos ya; solo a recordarte que mi corazón sigue eligiéndote'],
    bouquets: true,
  },

  {
    lines: [' No he dejado de pensar en ti, en lo que sucedió y en la necesidad de hablar de frente, sin minimizar tu dolor.'],
    bouquets: true,
  },
  {
    lines: ['Se que han habido más situaciones dificiles, y claro que he pensado en cada una de ellas.'],
    bouquets: true,
  },
  {
    lines: ['Pero no quiero quedarme en el mismo lugar de antes. Estoy buscando las herramientas para cambiar de verdad.'],
    bouquets: true, 
  },
 
  ,
  {
    lines: ['Y no es un secreto lo que siento por ti, que te amo y te extraño...']
    ,
    corners: [
        {
          src: '/images/corners/fotito_1.jpeg',
          alt: 'fotito_1',
          position: 'top-left',
        },
        {
          src: '/images/corners/foto%20(2).jpg',
          alt: 'foto (2)',
          position: 'top-right',
        },
        {
          src: '/images/corners/foto%20(3).jpg',
          alt: 'foto (3)',
          position: 'bottom-left',
        },
        {
          src: '/images/corners/foto%20(4).jpg',
          alt: 'foto (4)',
          position: 'bottom-right',
        },
      ],
  }
  
  ,
  {
    // EL ATERRIZAJE: Reconocer que esto no es magia
    lines: ['Sé perfectamente que esta página y estas palabras no solucionan las cosas por arte de magia...']
    ,
    corners: [
        {
          src: '/images/corners/foto (22).jpg',
          alt: 'fotito_1',
          position: 'top-left',
        },
        {
          src: '/images/corners/foto (24).jpeg',
          alt: 'foto (2)',
          position: 'top-right',
        },
        {
          src: '/images/corners/foto (35).jpeg',
          alt: 'foto (3)',
          position: 'bottom-left',
        },
        {
          src: '/images/corners/foto (71).jpeg',
          alt: 'foto (4)',
          position: 'bottom-right',
        },
      ],
  }
  ,
  {
    // LA INTENCIÓN: El valor de intentarlo y abrir paso a los recuerdos
    lines: ['Pero al menos sabía que tenía que intentarlo una vez más, y recordarte por qué valía la pena hacerlo...','Y si el destino nos da una oportunidad, me gustaría sanar contigo...']

     ,
    corners: [
        {
          src: '/images/corners/foto (73).jpeg',
          alt: 'fotito_1',
          position: 'top-left',
        },
        {
          src: '/images/corners/foto.jpeg',
          alt: 'foto (2)',
          position: 'top-right',
        },
        {
          src: '/images/corners/foto (82).jpeg',
          alt: 'foto (3)',
          position: 'bottom-left',
        },
        {
          src: '/images/corners/foto (84).jpeg',
          alt: 'foto (4)',
          position: 'bottom-right',
        },
      ],
  }
  ,
  {
    // Bloque enfocado en la intención pura de querer hablar
    lines: ['Mi única intención con todo esto es pedirte que nos demos la oportunidad de hablar. Con el corazón en la mano y escucharnos de verdad.']
    ,
    corners: [
        {
          src: '/images/corners/foto (2).jpeg',
          alt: 'fotito_1',
          position: 'top-left',
        },
        {
          src: '/images/corners/foto (10).jpeg',
          alt: 'foto (2)',
          position: 'top-right',
        },
        {
          src: '/images/corners/foto (11).jpeg',
          alt: 'foto (3)',
          position: 'bottom-left',
        },
        {
          src: '/images/corners/foto (58).jpeg',
          alt: 'foto (4)',
          position: 'bottom-right',
        },
      ],
  },
  {
    
    lines: ['Hoy entiendo, con toda claridad, cuánta falta te hicieron mis abrazos, mi cuidado y mi escucha. Me dolió no haber estado a la altura cuando más me necesitabas.']

    ,
    corners: [
        {
          src: '/images/corners/foto (51).jpeg',
          alt: 'fotito_1',
          position: 'top-left',
        },
        {
          src: '/images/corners/foto (42).jpeg',
          alt: 'foto (2)',
          position: 'top-right',
        },
        {
          src: '/images/corners/foto (14).jpeg',
          alt: 'foto (3)',
          position: 'bottom-left',
        },
        {
          src: '/images/corners/foto (16).jpeg',
          alt: 'foto (4)',
          position: 'bottom-right',
        },
      ],
  }
  ,
  {
    lines: [],
    gallery: [
      { src: '/images/corners/foto (5).jpeg', alt: 'Recuerdo 1' },
      { src: '/images/corners/foto (6).jpeg', alt: 'Recuerdo 2' },
      { src: '/images/corners/foto (144).jpg', alt: 'Recuerdo 3' },
      { src: '/images/corners/foto (15).jpg', alt: 'Recuerdo 4' },
    ],
    bouquets: true,
  }
  ,
  {
    lines: ['Aida, te amo.'],
    gallery: [
      { src: '/images/corners/foto (6)1.jpg', alt: 'Recuerdo 1' },
      { src: '/images/corners/foto (5)1.jpg', alt: 'Recuerdo 2' },
      { src: '/images/corners/foto (57).jpeg', alt: 'Recuerdo 3' },
      { src: '/images/corners/foto (49).jpeg', alt: 'Recuerdo 4' },
    ],
    hearts: true,
  },

  {
    lines: ['Pero espera, no te vayas todavía...']
    ,
    bouquets: true,
  },
  {
    lines: ['.', '.', '.', '.', '.', '.','.', '.', '.', '.', '.', '.','.', '.', '.', '.', '.', '.'],
  }
  ,
  {
    lines: ['.', '.', '.', '.', '.', '.','.', '.', '.', '.', '.', '.','.', '.', '.', '.', '.', '.'],
  }
  ,

  {
    lines: ['Continúa'],
    gallery: [
      { src: '/images/corners/foto_17.gif', alt: 'Video' },
    ],
  }
   ,
  {
    lines: ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.',]
    }
  ,
  {
    lines: ['¿Por qué no?'],
    bouquets: true,
    musicTrack: 'frankie',
  }
 
  ,
  {
    lines: ['.', '.', '.', '.', '.', '.','.', '.', '.', '.', '.', '.','.', '.', '.', '.', '.', '.'],
  }

  
  ,

  {
    lines: [],
    gallery: [
      { src: '/images/corners/nuestra_boda.jpeg', alt: 'Recuerdo 1' },
      { src: '/images/corners/nuestra_familia.png', alt: 'Recuerdo 2' },
      
    ],
    bouquets: true,
  }
  ,
  {
    lines: ['.', '.', '.', '.', '.', '.','.', '.', '.', '.', '.', '.','.', '.', '.', '.', '.', '.'],

  }
  ,
  {
    lines: ['¿Quieres continuar?']
    ,
    gallery: [
      { src: '/images/corners/foto (18).jpg', alt: 'Recuerdo 1' },
      { src: '/images/corners/foto_3.jpeg', alt: 'Recuerdo 2' },
      { src: '/images/corners/foto_4.jpeg', alt: 'Recuerdo 3' },
      { src: '/images/corners/foto_6.jpeg', alt: 'Recuerdo 4' },
    ],
    bouquets: true,
  }
  ,
  {
    lines: ['.', '.', '.', '.', '.', '.','.', '.', '.', '.', '.', '.','.', '.', '.', '.', '.', '.'],

  }
  ,
  {
    
lines: [],
     gallery: [
      { src: '/images/corners/lobos.jpeg', alt: 'Recuerdo 1' },
      { src: '/images/corners/wolf.gif', alt: 'Recuerdo 2' },
      { src: '/images/corners/loba.jpeg', alt: 'Recuerdo 2' },
      { src: '/images/corners/loba2.jpg', alt: 'Recuerdo 2' },
    ],
    bouquets: true,
  }
  ,

  
  {
    lines: ['.', '.', '.', '.', '.', '.','.', '.', '.', '.', '.', '.','.', '.', '.', '.', '.', '.'],

  }

  ,
  {
    lines: [''],
    gallery: [
      { src: '/images/corners/mariachi.jpeg', alt: 'imagen' },
    ],
    hearts: true,
    bouquets: true,
  }
  ,
  {
    lines: ['Te amo.'],
    gallery: [
      { src: '/images/corners/video.gif', alt: 'Video' },
    ],
    hearts: true,
    bouquets: true,
  }
  ,
  {
    lines: ['.', '.', '.', '.', '.', '.','.', '.', '.', '.', '.', '.','.', '.', '.', '.', '.', '.','.','.'],

  }
  ,

  {

    lines: ['Canciones que me recuerdan a ti.'],
    playlist: [
      // Agrega tus links de YouTube aquí:
       { url: 'https://www.youtube.com/watch?v=b-XkexlmElM&list=RDb-XkexlmElM&start_radio=1', title: 'Amor' },
       { url: 'https://www.youtube.com/watch?v=guSS5qJz1pc&list=RDguSS5qJz1pc&start_radio=1', title: 'Desesperados' },
       { url: 'https://www.youtube.com/watch?v=1Kc2sZNyWT0&list=RD1Kc2sZNyWT0&start_radio=1', title: 'Besito en la frente' },
       { url: 'https://www.youtube.com/watch?v=Q6wR1eb-ytI&list=RDQ6wR1eb-ytI&start_radio=1', title: 'Hechizo de luna' },


       { url: 'https://www.youtube.com/watch?v=a1Iu90A8vqU&list=RDa1Iu90A8vqU&start_radio=1', title: 'Tú con él' },
       { url: 'https://www.youtube.com/watch?v=0JeughwzfR0&list=RD0JeughwzfR0&start_radio=1', title: 'Lokera' },
       { url: 'https://www.youtube.com/watch?v=mxRXN5-Dq2k&list=RDmxRXN5-Dq2k&start_radio=1', title: '¿Y eso?' },


       { url: 'https://www.youtube.com/watch?v=yC2AY3Q5olc&list=RDyC2AY3Q5olc&start_radio=1', title: 'Escombros' },
       { url: 'https://www.youtube.com/watch?v=tokScbZh544&list=RDtokScbZh544&start_radio=1', title: 'Enamorada' },
       { url: 'https://www.youtube.com/watch?v=LyXIoVOGU3M&list=RDLyXIoVOGU3M&start_radio=1', title: 'Corazón de acero' },
       { url: 'https://www.youtube.com/watch?v=vX1fgqKXSsk&list=RDvX1fgqKXSsk&start_radio=1', title: 'Si no es contigo' },

       { url: 'https://www.youtube.com/watch?v=k9lhzDqyOy4&list=RDk9lhzDqyOy4&start_radio=1', title: 'Mientras duermes' },
       { url: 'https://www.youtube.com/watch?v=kU3rdltZ6nk&list=RDkU3rdltZ6nk&start_radio=1', title: 'Intro' },
       { url: 'https://www.youtube.com/watch?v=6bXOBFzgmv4&list=RD6bXOBFzgmv4&start_radio=1', title: 'El hijo del palenque' },
       { url: 'https://www.youtube.com/watch?v=b4rd9VfMhWM&list=RDb4rd9VfMhWM&start_radio=1', title: 'Aguanile' },
    ],
    bouquets: true,

  }
  ,

  {
    lines: ['Gracias por verlo'],
    
    corners: [
        {
          src: '/images/corners/foto (7).jpeg',
          alt: 'fotito_1',
          position: 'top-left',
        },
        {
          src: '/images/corners/foto (76).jpeg',
          alt: 'foto (2)',
          position: 'top-right',
        },
        {
          src: '/images/corners/foto (8)22.jpg',
          alt: 'foto (3)',
          position: 'bottom-left',
        },
        {
          src: '/images/corners/foto (233).jpg',
          alt: 'foto (4)',
          position: 'bottom-right',
        },
      ],
    bouquets: true,
  }

  ,

  {
    lines: ['Agradecimientos especiales a ti, a loba y pues, a mí porque me gustó hacer esto para ti.'],
    bouquets: true,
  }
  
  ,

  
// ... (después del bloque de Agradecimientos especiales)
{
  lines: [
    'Sé que el camino para sanar toma su propio tiempo y respeto profundamente tu proceso.', ],

    corners: [
      {
        src: '/images/corners/foto (194).jpg',
        alt: 'fotito_1',
        position: 'top-left',
      },
      {
        src: '/images/corners/foto (63).jpeg',
        alt: 'foto (2)',
        position: 'top-right',
      },
      {
        src: '/images/corners/foto_11.jpeg',
        alt: 'foto_12',
        position: 'bottom-left',
      },
      {
        src: '/images/corners/foto_12.jpeg',
        alt: 'foto_13',
        position: 'bottom-right',
      },
    ],

  bouquets: true,
}

,

{
  lines: [
    'Aquí estaré, trabajando en mí y cuidando lo que somos, listo para cuando te sientas lista para hablar.',
    'Con todo mi amor, Octavio.'
  ],
  hearts: true,

  corners: [
    {
      src: '/images/corners/foto_8.jpeg',
      alt: 'fotito_1',
      position: 'top-left',
    },
    {
      src: '/images/corners/foto_9.jpeg',
      alt: 'foto (2)',
      position: 'top-right',
    },
    {
      src: '/images/corners/foto_10.jpeg',
      alt: 'foto (3)',
      position: 'bottom-left',
    },
    {
      src: '/images/corners/foto_11.jpeg',
      alt: 'foto (4)',
      position: 'bottom-right',
    },
  ],

}

,

{

  lines: ['Pd: Te eligiria una y mil veces más'],
  hearts: true,
  bouquets: true,
}


 
 
  

];

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      afterNextRender(() => {
        void this.appRef.whenStable().then(() => {
          this.ngZone.run(() => this.setupViewportTracking());
        });
      });
    }

    this.destroyRef.onDestroy(() => {
      for (const interval of this.revealIntervals) {
        clearInterval(interval);
      }

      window.removeEventListener('scroll', this.onViewportChange);
      window.removeEventListener('resize', this.onViewportChange);
    });
  }

  split(text: string): string[] {
    return text.split('');
  }

  getTokens(line: string): LineToken[] {
    const tokens: LineToken[] = [];
    const pattern = /(\S+|\s+)/g;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(line)) !== null) {
      tokens.push({
        text: match[0],
        start: match.index,
        isSpace: /^\s+$/.test(match[0]),
      });
    }

    return tokens;
  }

  isLetterRevealed(
    sectionIndex: number,
    lineIndex: number,
    charIndexInLine: number,
    lines: string[],
  ): boolean {
    return this.revealedLetters().has(
      this.letterKey(sectionIndex, lineIndex, charIndexInLine, lines),
    );
  }

  isSectionStarted(sectionIndex: number): boolean {
    return this.startedSections().has(sectionIndex);
  }

  usesLetterAnimation(sectionIndex: number): boolean {
    return sectionIndex <= this.lastAnimatedSectionIndex;
  }

  isCenterNumber(line: string): boolean {
    return /^[0-9]$/.test(line);
  }

  cornerClass(position: CornerImage['position']): string {
    return `corner-image corner-image--${position}`;
  }

  private letterKey(
    sectionIndex: number,
    lineIndex: number,
    charIndexInLine: number,
    lines: string[],
  ): LetterKey {
    let globalIndex = charIndexInLine;

    for (let i = 0; i < lineIndex; i++) {
      globalIndex += lines[i].length;
    }

    return `${sectionIndex}-${globalIndex}`;
  }

  private setupViewportTracking(): void {
    this.checkSectionsInView();

    window.addEventListener('scroll', this.onViewportChange, { passive: true });
    window.addEventListener('resize', this.onViewportChange, { passive: true });
  }

  private checkSectionsInView(): void {
    const sections = document.querySelectorAll<HTMLElement>(
      '[data-section-index]',
    );

    for (const section of sections) {
      const sectionIndex = Number(section.dataset['sectionIndex']);

      if (Number.isNaN(sectionIndex) || this.startedSections().has(sectionIndex)) {
        continue;
      }

      if (!this.isSectionInView(section)) {
        continue;
      }

      this.startedSections.update((current) => {
        const next = new Set(current);
        next.add(sectionIndex);
        return next;
      });

      if (this.story[sectionIndex]?.musicTrack === 'frankie') {
        this.backgroundMusic.activateFrankieRuiz();
      }

      if (this.usesLetterAnimation(sectionIndex)) {
        this.startLetterReveal(sectionIndex);
      }
    }
  }

  private isSectionInView(section: HTMLElement): boolean {
    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    if (rect.height <= 0) {
      return false;
    }

    const visibleHeight = Math.max(
      0,
      Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0),
    );

    if (visibleHeight <= 0) {
      return false;
    }

    const sectionCenter = rect.top + rect.height / 2;
    const centerInViewport =
      sectionCenter >= viewportHeight * 0.12 &&
      sectionCenter <= viewportHeight * 0.88;

    return centerInViewport || visibleHeight / viewportHeight >= 0.2;
  }

  private startLetterReveal(sectionIndex: number): void {
    const totalLetters = this.story[sectionIndex].lines.join('').length;
    let revealedCount = 0;

    const interval = setInterval(() => {
      if (revealedCount >= totalLetters) {
        clearInterval(interval);
        return;
      }

      const key: LetterKey = `${sectionIndex}-${revealedCount}`;

      this.ngZone.run(() => {
        this.revealedLetters.update((current) => {
          const next = new Set(current);
          next.add(key);
          return next;
        });
      });

      revealedCount++;
    }, 120);

    this.revealIntervals.push(interval);
  }
}
