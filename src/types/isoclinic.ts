export interface Point {
  x: number;
  y: number;
}

export enum RoomType {
  ENTRANCE = 'Entrance',
  TELEMEDICINE = 'Telemedicine',
  WAITING = 'Waiting Room',
  HALLWAY = 'Hallway',
  NURSE = 'Nurse Station',
  HEPATOLOGIST = 'Hepatologist',
  MONITORING = 'Monitoring AI',
  EXIT = 'Exit'
}

export type PropType = 'desk' | 'chair' | 'bed' | 'plant' | 'server' | 'shelf' | 'sofa' | 'reception_desk' | 'mri';

export interface RoomDef {
  id: string;
  name: string;
  type: RoomType;
  gridX: number;
  gridY: number;
  width: number;
  height: number;
  color: string;
  wallColor: string;
  floorColor: string;
  nextRooms?: string[];
  closedWalls?: string[];
  doorWalls?: string[];
  openWalls?: string[];
}

export interface Patient {
  id: string;
  type: 'patient';
  currentRoomId: string;
  targetRoomId: string | null;
  progress: number;
  color: string;
  path: Point[];
  facing: 'left' | 'right';
}

export interface Staff {
  id: string;
  type: 'doctor' | 'nurse' | 'admin' | 'tech';
  roomId: string;
  gridX: number;
  gridY: number;
  facing: 'left' | 'right';
  name: string;
  isSeated?: boolean;
  color?: string;
}

export interface StaticPatient {
  id: string;
  roomId: string;
  gridX: number;
  gridY: number;
  facing: 'left' | 'right';
  color: string;
}
