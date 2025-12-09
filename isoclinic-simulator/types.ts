
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
  width: number; // in grid units
  height: number; // in grid units
  color: string;
  wallColor: string;
  floorColor: string;
  nextRooms?: string[]; // IDs of possible next rooms
  closedWalls?: string[]; // 'North', 'West', etc.
  doorWalls?: string[]; // Walls that should have doors: 'North', 'South', 'East', 'West'
  openWalls?: string[]; // Walls to remove entirely: 'North', 'West', etc.
}

export interface Patient {
  id: string;
  type: 'patient';
  currentRoomId: string;
  targetRoomId: string | null;
  progress: number; // 0 to 1 along the path
  color: string;
  path: Point[]; // Visual path points to interpolate
  facing: 'left' | 'right';
}

export interface Staff {
  id: string;
  type: 'doctor' | 'nurse' | 'admin' | 'tech';
  roomId: string;
  gridX: number; // Relative to room
  gridY: number; // Relative to room
  facing: 'left' | 'right';
  name: string;
  isSeated?: boolean;
  color?: string; // Optional custom color
}

export interface StaticPatient {
  id: string;
  roomId: string;
  gridX: number;
  gridY: number;
  facing: 'left' | 'right';
  color: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
