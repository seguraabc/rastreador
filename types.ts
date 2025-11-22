export enum ScannerStatus {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  DETECTED = 'DETECTED',
  ERROR = 'ERROR',
}

export interface BeaconData {
  uuid: string;
  major?: number;
  minor: number;
  rssi: number;
  timestamp: number;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface ScanEvent {
  id: string;
  beacon: BeaconData;
  location: GeoLocation | null;
  status: 'pending' | 'synced';
}

export enum PetStatus {
  SAFE = 'SAFE',
  LOST = 'LOST',
  UNKNOWN = 'UNKNOWN'
}
