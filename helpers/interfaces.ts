interface Detector {
  inference_speed: number;
  detection_start: number;
  pid: number;
}

interface CpuUsage {
  cpu: string; // `${0.0-100.0}`
  mem: string; // `${0.0-100.0}`
}

interface GpuUsage {
  gpu: string; // `${0.0-100.0} %`
  mem: string; // `${0.0-100.0} %`
}

export type StoragePlace =
  | '/dev/shm'
  | '/media/frigate/clips'
  | '/media/frigate/recordings'
  | '/tmp/cache';

export type StorageShortPlace = 'clips' | 'recordings' | 'cache' | 'shm';

export interface StorageInfo {
  used: number; // MB
  free: number; // MB
  total: number; // MB
  mount_type: 'ext4' | 'zfs' | 'tmpfs' | 'overlay';
}

export interface Service {
  last_updated?: number; // timestamp
  latest_version?: string; // latest frigate nvr version
  storage: Record<StoragePlace, StorageInfo>;
  temperatures?: {};
  uptime: number; // seconds
  version: string; // current frigate nvr version
}

interface CameraInfo {
  camera_fps: number;
  process_fps: number;
  skipped_fps: number;
  detection_fps: number;
  pid: number;
  capture_pid: number;
  ffmpeg_pid?: number;
  detection_enabled?: number; // 0 or 1
}

interface StatsInfo {
  cpu_usages?: Record<number, CpuUsage>;
  detectors: Record<string, Detector>;
  gpu_usages?: Record<string, GpuUsage>;
  service: Service;
}

export type Stats = {
  cameras: Record<string, CameraInfo | undefined>;
} & StatsInfo;

interface CameraStorageInfo {
  bandwidth: number; // MB/h
  usage: number; // MB
  usage_percent: number; // 0-100
}

export type CamerasStorage = Record<string, CameraStorageInfo>;
