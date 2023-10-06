declare module 'react-native-vlc-media-player' {
  type ViewProps = import('react-native').ViewProps;

  interface Source {
    uri?: string | undefined;
    headers?: {[key: string]: string} | undefined;
    type?: string | undefined;
  }

  interface Track {
    id: number;
    name: string;
  }

  type AudioTrack = Track;
  type TextTrack = Track;

  export interface VideoInfo {
    duration: number;
    videoSize: {
      height: number;
      width: number;
    };
    audioTracks: AudioTrack[];
    textTracks: TextTrack[];
  }

  export interface ProgressInfo {
    duration: number;
    position: number;
    currentTime: number;
    remainingTime: number;
  }

  export interface PlayingInfo {
    target: number;
    duration: number;
    seekable: boolean;
  }

  interface VLCPlayerProps extends ViewProps {
    rate?: number;
    seek?: number;
    resume?: boolean;
    snapshotPath?: string;
    paused?: boolean;

    autoAspectRatio?: boolean;
    videoAspectRatio?: string;
    volume?: number;
    disableFocus?: boolean;
    src?: string;
    playInBackground?: boolean;
    playWhenInactive?: boolean;
    resizeMode?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
    poster?: string;
    repeat?: boolean;
    muted?: boolean;
    audioTrack?: number;
    textTrack?: number;

    onVideoLoadStart?: () => void;
    onVideoError?: () => void;
    onVideoProgress?: (progressInfo: ProgressInfo) => void;
    onVideoEnded?: () => void;
    onVideoPlaying?: (playingInfo: PlayingInfo) => void;
    onVideoPaused?: () => void;
    onVideoStopped?: () => void;
    onVideoBuffering?: () => void;
    onVideoOpen?: () => void;
    onVideoLoad?: (videoInfo: VideoInfo) => void;

    source: Source | number;
    subtitleUri?: string;

    onError?: () => void;
    onProgress?: (progressInfo: ProgressInfo) => void;
    onEnded?: () => void;
    onStopped?: () => void;
    onPlaying?: (playingInfo: PlayingInfo) => void;
    onPaused?: () => void;

    scaleX?: number;
    scaleY?: number;
    translateX?: number;
    translateY?: number;
    rotation?: number;
  }

  export class VLCPlayer extends React.Component<VLCPlayerProps> {
    setNativeProps(nativeProps: Partial<VLCPlayerProps>): void;
    seek(pos: number): void;
    resume(isResume: boolean): void;
    snapshot(path: string): void;
    autoAspectRatio(isAuto: boolean): void;
    changeVideoAspectRatio(ratio: string): void;
  }
}
