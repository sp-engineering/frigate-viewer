declare module '@lunarr/vlc-player' {
  type ViewProps = import('react-native').ViewProps;

  interface Source {
    uri?: string | undefined;
    headers?: {[key: string]: string} | undefined;
    type?: string | undefined;
  }

  export interface State {
    currentTime: number;
    duration: number;
  }

  interface VLCPlayerProps extends ViewProps {
    rate?: number;
    seek?: number;
    resume?: boolean;
    position?: number;
    snapshotPath?: string;
    paused?: boolean;
    autoAspectRatio?: boolean;
    videoAspectRatio?: string;

    volume?: number;
    volumeUp?: number;
    volumeDown?: number;
    repeat?: boolean;
    muted?: boolean;

    hwDecoderEnabled?: number;
    hwDecoderForced?: number;

    /* Internal events */
    // onVideoLoadStart?: (loadEvent: any) => void;
    // onVideoStateChange?: (stateChangeEvent: any) => void;
    // onVideoProgress?: (progressEvent: any) => void;
    // onSnapshot?: (snapshotEvent: any) => void;
    // onLoadStart?: (loadStartEvent: any) => void;

    source: Source | number;
    play?: (paused: boolean) => void;
    snapshot?: (path: string) => void;
    onError?: (state: State) => void;
    onSeek?: (state: State) => void;
    onProgress?: (state: State) => void;
    onMetadata?: (state: State) => void;
    onBuffer?: (state: State) => void;
    onEnd?: (state: State) => void;
    onStopped?: (state: State) => void;

    scaleX?: number;
    scaleY?: number;
    translateX?: number;
    translateY?: number;
    rotation?: number;
  }

  export default class VLCPlayer extends React.Component<VLCPlayerProps> {
    setNativeProps(nativeProps: Partial<VLCPlayerProps>): void;
    seek(timeSec: number): void;
    autoAspectRatio(isAuto: boolean): void;
    changeVideoAspectRatio(ratio: string): void;
    snapshot(path: string): void;
    play(paused: boolean): void;
    position(position: number): void;
    resume(isResume: boolean): void;
  }
}
