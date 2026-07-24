import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

type MusicTrack = 'default' | 'frankie';

@Injectable({ providedIn: 'root' })
export class BackgroundMusicService {
  private readonly platformId = inject(PLATFORM_ID);

  private readonly tracks: Record<MusicTrack, string> = {
    default: encodeURI('/Musica/Doing Nothing Well.mp3'),
    frankie: encodeURI('/Musica/Frankie Ruíz - Tú Con Él (Visualizer).mp3'),
  };

  readonly showPrompt = signal(false);

  private audio: HTMLAudioElement | null = null;
  private currentTrack: MusicTrack = 'default';
  private unlocked = false;
  private initialized = false;
  private frankieActivated = false;
  private pausedForVideo = false;
  private wasPlayingBeforeVideo = false;

  init(): void {
    if (this.initialized || !isPlatformBrowser(this.platformId)) {
      return;
    }

    this.initialized = true;
    this.loadTrack('default');
    void this.tryPlay();

    window.setTimeout(() => {
      if (!this.unlocked) {
        this.showPrompt.set(true);
      }
    }, 1200);
  }

  unlockAndPlay(): void {
    void this.tryPlay();
  }

  activateFrankieRuiz(): void {
    if (this.frankieActivated) {
      return;
    }

    this.frankieActivated = true;
    this.loadTrack('frankie');
    void this.tryPlay();
  }

  pauseForVideo(): void {
    if (!this.audio || this.pausedForVideo) {
      return;
    }

    this.wasPlayingBeforeVideo = !this.audio.paused;
    this.audio.pause();
    this.pausedForVideo = true;
  }

  resumeAfterVideo(): void {
    if (!this.audio || !this.pausedForVideo) {
      return;
    }

    this.pausedForVideo = false;

    if (this.wasPlayingBeforeVideo && this.unlocked) {
      void this.audio.play();
    }
  }

  destroy(): void {
    this.audio?.pause();
    this.audio = null;
    this.initialized = false;
  }

  private loadTrack(track: MusicTrack): void {
    this.currentTrack = track;
    this.audio?.pause();
    this.audio = new Audio(this.tracks[track]);
    this.audio.loop = true;
    this.audio.volume = 0.65;
    this.audio.preload = 'auto';
  }

  private async tryPlay(): Promise<void> {
    if (!this.audio) {
      return;
    }

    try {
      await this.audio.play();
      this.unlocked = true;
      this.showPrompt.set(false);
    } catch {
      // Autoplay bloqueado hasta interacción del usuario.
    }
  }
}
