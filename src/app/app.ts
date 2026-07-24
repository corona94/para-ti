import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  DestroyRef,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BackgroundMusicService } from './background-music.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly music = inject(BackgroundMusicService);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    afterNextRender(() => {
      this.music.init();

      const unlockAudio = () => {
        this.music.unlockAndPlay();
      };

      window.addEventListener('pointerdown', unlockAudio);
      window.addEventListener('scroll', unlockAudio, { passive: true });
      window.addEventListener('keydown', unlockAudio);
      window.addEventListener('touchstart', unlockAudio, { passive: true });

      this.destroyRef.onDestroy(() => {
        this.music.destroy();

        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('scroll', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
      });
    });
  }

  protected startMusic(): void {
    this.music.unlockAndPlay();
  }
}
