import { RoomType, PropType, Staff } from '../types/isoclinic';

export const TILE_WIDTH = 64;
export const TILE_HEIGHT = 32;
export const WALL_HEIGHT = 80;
export const PATIENT_SPEED = 0.003;
export const SPAWN_RATE_MS = 3500;

export interface PropDef {
  type: PropType;
  xOffset: number;
  yOffset: number;
  rotation?: 'none' | 'left' | 'right';
}

export interface ExtendedRoomDef {
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
  props: PropDef[];
}

export const STAFF: Staff[] = [
  { id: 'recep1', type: 'admin', roomId: 'entrance', gridX: 3.5, gridY: 1.5, facing: 'right', name: 'Receptionist', isSeated: false, color: '#fed7aa' },
  { id: 'tele_staff', type: 'admin', roomId: 'telemedicine', gridX: 4.5, gridY: 3.5, facing: 'right', name: 'Telehealth Coordinator', isSeated: true, color: '#bfdbfe' },
  { id: 'nurse_a', type: 'nurse', roomId: 'nurse1', gridX: 5, gridY: 5, facing: 'left', name: 'Nurse Joy', isSeated: false },
  { id: 'nurse_b', type: 'nurse', roomId: 'nurse2', gridX: 5, gridY: 5, facing: 'right', name: 'Nurse Lee', isSeated: false },
  { id: 'nurse_c', type: 'nurse', roomId: 'nurse3', gridX: 5, gridY: 5, facing: 'right', name: 'Nurse Ray', isSeated: false },
  { id: 'doc1', type: 'doctor', roomId: 'hepatologist', gridX: 4.5, gridY: 6.5, facing: 'right', name: 'Dr. House', isSeated: false },
  { id: 'tech1', type: 'tech', roomId: 'monitoring', gridX: 5.5, gridY: 6.5, facing: 'right', name: 'AI Tech', isSeated: false, color: '#000000'},
];

export const STATIC_PATIENTS = [
  { id: 'patient_reception', roomId: 'entrance', gridX: 4.5, gridY: 3.5, facing: 'left' as const, color: '#858585ff' },
  { id: 'patient_nurse1', roomId: 'nurse1', gridX: 4, gridY: 3, facing: 'right' as const, color: '#858585ff' },
  { id: 'patient_nurse2', roomId: 'nurse2', gridX: 4, gridY: 6, facing: 'right' as const, color: '#858585ff' },
  { id: 'patient_nurse3', roomId: 'nurse3', gridX: 7, gridY: 3, facing: 'right' as const, color: '#858585ff' },
  { id: 'patient_hepatologist', roomId: 'hepatologist', gridX: 3.5, gridY: 7.5, facing: 'left' as const, color: '#858585ff' },
  { id: 'patient_waiting1', roomId: 'waiting', gridX: 4, gridY: 3, facing: 'right' as const, color: '#06b6d4' },
  { id: 'patient_waiting2', roomId: 'waiting', gridX: 4, gridY: 6, facing: 'left' as const, color: '#f97316' },
];

const CLINIC_WALL = '#f8fafc';
const FLOOR_RECEPTION = '#f8fafc';
const FLOOR_TELE = '#f0f9ff';
const FLOOR_WAITING = '#f1f5f9';
const FLOOR_HALLWAY = '#f8fafc';
const FLOOR_NURSE = '#ecfeff';
const FLOOR_DOC = '#eff6ff';
const FLOOR_TECH = '#e2e8f0';

export const ROOMS: ExtendedRoomDef[] = [
  {
    id: 'entrance',
    name: 'Reception',
    type: RoomType.ENTRANCE,
    gridX: 0,
    gridY: 0,
    width: 8,
    height: 8,
    color: '#ffffff',
    floorColor: FLOOR_RECEPTION,
    wallColor: CLINIC_WALL,
    nextRooms: ['telemedicine'],
    doorWalls: ['North', 'West'],
    props: [
      { type: 'reception_desk', xOffset: 3.5, yOffset: 3 }
    ]
  },
  {
    id: 'telemedicine',
    name: 'Telemedicine',
    type: RoomType.TELEMEDICINE,
    gridX: 0,
    gridY: 8,
    width: 8,
    height: 10,
    color: '#ffffff',
    floorColor: FLOOR_TELE,
    wallColor: CLINIC_WALL,
    nextRooms: ['waiting'],
    closedWalls: ['South'],
    doorWalls: ['East'],
    props: [
      { type: 'desk', xOffset: 4, yOffset: 3 },
      { type: 'chair', xOffset: 4.5, yOffset: 3.5 }
    ]
  },
  {
    id: 'waiting',
    name: 'Waiting Area',
    type: RoomType.WAITING,
    gridX: 8,
    gridY: 4,
    width: 10,
    height: 16,
    color: '#ffffff',
    floorColor: FLOOR_WAITING,
    wallColor: CLINIC_WALL,
    nextRooms: ['hallway'],
    closedWalls: ['South'],
    doorWalls: ['East'],
    props: [
      { type: 'sofa', xOffset: 3, yOffset: 2 },
      { type: 'sofa', xOffset: 3, yOffset: 5 },
      { type: 'sofa', xOffset: 3, yOffset: 8 },
      { type: 'plant', xOffset: 3, yOffset: 6.5 },
      { type: 'plant', xOffset: 3, yOffset: 3.5 }
    ]
  },
  {
    id: 'hallway',
    name: 'Main Corridor',
    type: RoomType.HALLWAY,
    gridX: 18,
    gridY: 4,
    width: 24,
    height: 4,
    color: '#ffffff',
    floorColor: FLOOR_HALLWAY,
    wallColor: CLINIC_WALL,
    nextRooms: ['nurse1', 'nurse2', 'nurse3'],
    closedWalls: ['North'],
    doorWalls: ['West'],
    props: []
  },
  {
    id: 'nurse1',
    name: 'Triage 1',
    type: RoomType.NURSE,
    gridX: 8,
    gridY: -6,
    width: 10,
    height: 10,
    color: '#ffffff',
    floorColor: FLOOR_NURSE,
    wallColor: CLINIC_WALL,
    nextRooms: ['hallway_to_doc'],
    closedWalls: ['West'],
    doorWalls: ['South'],
    props: [
      { type: 'desk', xOffset: 3, yOffset: 5 },
      { type: 'bed', xOffset: 3, yOffset: 2 }
    ]
  },
  {
    id: 'nurse2',
    name: 'Triage 2',
    type: RoomType.NURSE,
    gridX: 18,
    gridY: -6,
    width: 10,
    height: 10,
    color: '#ffffff',
    floorColor: FLOOR_NURSE,
    wallColor: CLINIC_WALL,
    nextRooms: ['hallway_to_doc'],
    closedWalls: ['West'],
    doorWalls: ['South'],
    props: [
      { type: 'desk', xOffset: 3, yOffset: 5 },
      { type: 'bed', xOffset: 3, yOffset: 2 }
    ]
  },
  {
    id: 'nurse3',
    name: 'Triage 3',
    type: RoomType.NURSE,
    gridX: 28,
    gridY: -6,
    width: 10,
    height: 10,
    color: '#ffffff',
    floorColor: FLOOR_NURSE,
    wallColor: CLINIC_WALL,
    nextRooms: ['hallway_to_doc'],
    closedWalls: ['West', 'East'],
    doorWalls: ['South'],
    props: [
      { type: 'desk', xOffset: 3, yOffset: 5 },
      { type: 'bed', xOffset: 3, yOffset: 2 }
    ]
  },
  {
    id: 'hallway_to_doc',
    name: 'Corridor',
    type: RoomType.HALLWAY,
    gridX: 18,
    gridY: 4,
    width: 24,
    height: 4,
    color: '#ffffff',
    floorColor: FLOOR_HALLWAY,
    wallColor: CLINIC_WALL,
    nextRooms: ['hepatologist'],
    closedWalls: ['North'],
    props: []
  },
  {
    id: 'hepatologist',
    name: 'Hepatologist',
    type: RoomType.HEPATOLOGIST,
    gridX: 18,
    gridY: 8,
    width: 12,
    height: 12,
    color: '#ffffff',
    floorColor: FLOOR_DOC,
    wallColor: CLINIC_WALL,
    nextRooms: ['monitoring'],
    closedWalls: ['South', 'West'],
    props: [
      { type: 'desk', xOffset: 4, yOffset: 6 },
      { type: 'bed', xOffset: 3, yOffset: 8 },
      { type: 'plant', xOffset: 9, yOffset: 7 }
    ]
  },
  {
    id: 'monitoring',
    name: 'AI Monitoring',
    type: RoomType.MONITORING,
    gridX: 30,
    gridY: 8,
    width: 12,
    height: 12,
    color: '#ffffff',
    floorColor: FLOOR_TECH,
    wallColor: CLINIC_WALL,
    nextRooms: [],
    closedWalls: ['South', 'East'],
    props: [
      { type: 'server', xOffset: 9, yOffset: 6 },
      { type: 'server', xOffset: 9, yOffset: 7 },
      { type: 'server', xOffset: 9, yOffset: 8 },
      { type: 'desk', xOffset: 5, yOffset: 6 },
    ]
  }
];
