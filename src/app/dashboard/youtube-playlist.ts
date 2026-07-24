import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';

import { BackgroundMusicService } from '../background-music.service';

export interface PlaylistVideo {
  url: string;
  title?: string;
}

interface YoutubePlayer {
  loadVideoById(videoId: string): void;
  destroy(): void;
}

interface YoutubeNamespace {
  Player: new (
    element: HTMLElement,
    config: {
      videoId?: string;
      width?: string | number;
      height?: string | number;
      playerVars?: Record<string, string | number>;
      events?: {
        onStateChange?: (event: { data: number }) => void;
      };
    },
  ) => YoutubePlayer;
  PlayerState: {
    PLAYING: number;
    PAUSED: number;
    ENDED: number;
  };
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
  }
}

declare const YT: YoutubeNamespace;

@Component({
  selector: 'app-youtube-playlist',
  standalone: true,
  templateUrl: './youtube-playlist.html',
  styleUrl: './youtube-playlist.css',
})
export class YoutubePlaylist {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly backgroundMusic = inject(BackgroundMusicService);
  private readonly playerHost = viewChild<ElementRef<HTMLDivElement>>('playerHost');

  videos = input.required<PlaylistVideo[]>();
  readonly selectedIndex = signal(0);

  private player: YoutubePlayer | null = null;
  private apiReady = false;

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    afterNextRender(() => {
      this.loadYoutubeApi();
    });

    this.destroyRef.onDestroy(() => {
      this.player?.destroy();
      this.player = null;
    });
  }

  selectVideo(index: number): void {
    this.selectedIndex.set(index);

    const videoId = this.extractVideoId(this.videos()[index]?.url ?? '');

    if (this.player && videoId) {
      this.player.loadVideoById(videoId);
    }
  }

  trackTitle(video: PlaylistVideo, index: number): string {
    return video.title ?? `Canción ${index + 1}`;
  }

  private loadYoutubeApi(): void {
    if (this.apiReady) {
      this.createPlayer();
      return;
    }

    if (typeof YT !== 'undefined' && YT.Player) {
      this.apiReady = true;
      this.createPlayer();
      return;
    }

    const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');

    if (existingScript) {
      if (typeof YT !== 'undefined' && YT.Player) {
        this.apiReady = true;
        this.createPlayer();
      } else {
        window.onYouTubeIframeAPIReady = () => {
          this.apiReady = true;
          this.createPlayer();
        };
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    window.onYouTubeIframeAPIReady = () => {
      this.apiReady = true;
      this.createPlayer();
    };
    document.head.appendChild(script);
  }

  private createPlayer(): void {
    const host = this.playerHost()?.nativeElement;
    const firstVideoId = this.extractVideoId(this.videos()[0]?.url ?? '');

    if (!host || !firstVideoId || this.player) {
      return;
    }

    this.player = new YT.Player(host, {
      videoId: firstVideoId,
      width: '100%',
      height: '100%',
      playerVars: {
        rel: 0,
        modestbranding: 1,
      },
      events: {
        onStateChange: (event) => this.onPlayerStateChange(event),
      },
    });
  }

  private onPlayerStateChange(event: { data: number }): void {
    if (event.data === YT.PlayerState.PLAYING) {
      this.backgroundMusic.pauseForVideo();
      return;
    }

    if (
      event.data === YT.PlayerState.PAUSED ||
      event.data === YT.PlayerState.ENDED
    ) {
      this.backgroundMusic.resumeAfterVideo();
    }
  }

  private extractVideoId(url: string): string | null {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/,
    );

    return match?.[1] ?? null;
  }
}
