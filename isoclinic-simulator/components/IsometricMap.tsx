
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROOMS, TILE_HEIGHT, TILE_WIDTH, WALL_HEIGHT, PATIENT_SPEED, SPAWN_RATE_MS, ExtendedRoomDef, PropDef, STAFF, STATIC_PATIENTS } from '../constants';
import { Patient, RoomType, RoomDef, Staff } from '../types';
import { getRoomCenter, gridToScreen, lerp, getRandomColor, getIsoDepth } from '../utils/isometric';
import { IsoWall, IsoFloor, IsoCharacter, IsoProp, IsoLabel, IsoSpeechBubble } from './IsoComponents';

const IsometricMap: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [viewState, setViewState] = useState({ x: 0, y: 150, zoom: 0.9 });
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>(0);
  const lastSpawnTime = useRef<number>(0);
  const [, setTick] = useState(0); // Force re-render for animation
  
  // Randomized conversation phases for each room - now includes 'none' for pauses
  const [roomConversations, setRoomConversations] = useState<Record<string, 'staff' | 'patient' | 'none'>>({
    'nurse1': 'staff',
    'nurse2': 'none',
    'nurse3': 'patient',
    'hepatologist': 'none'
  });

  // Waiting room patient positions and movement
  const waitingPositions = [
    { x: 4, y: 3 },
    { x: 4, y: 6 },
    { x: 4, y: 9 },
    { x: 6, y: 4 },
    { x: 6, y: 7 }
  ];
  
  const [waitingPatients, setWaitingPatients] = useState([
    { id: 'patient_waiting1', currentPos: 0, targetPos: 1, progress: 0, color: '#06b6d4', facing: 'right' as const },
    { id: 'patient_waiting2', currentPos: 1, targetPos: 2, progress: 0, color: '#f97316', facing: 'left' as const }
  ]);

  // --- Simulation Logic ---
  
  // Randomize conversation timing for each room independently with pauses
  useEffect(() => {
    const rooms = ['nurse1', 'nurse2', 'nurse3', 'hepatologist'];
    
    // Set up different intervals for each room
    const intervals = rooms.map(roomId => {
      const randomDelay = Math.random() * 2000; // Random initial delay 0-2s
      
      const cycleConversation = () => {
        setRoomConversations(prev => {
          const current = prev[roomId];
          // Cycle: staff -> patient -> none -> staff
          if (current === 'staff') return { ...prev, [roomId]: 'patient' };
          if (current === 'patient') return { ...prev, [roomId]: 'none' };
          return { ...prev, [roomId]: 'staff' };
        });
      };
      
      return setTimeout(() => {
        const interval = setInterval(cycleConversation, 2000 + Math.random() * 1500); // 2-3.5s intervals
        return interval;
      }, randomDelay);
    });
    
    return () => {
      intervals.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  const spawnPatient = useCallback(() => {
    const entrance = ROOMS.find(r => r.type === RoomType.ENTRANCE);
    if (!entrance) return;

    const newPatient: Patient = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'patient',
      currentRoomId: entrance.id,
      targetRoomId: entrance.nextRooms ? entrance.nextRooms[0] : null,
      progress: 0,
      color: getRandomColor(),
      path: [getRoomCenter(entrance.gridX, entrance.gridY, entrance.width, entrance.height)],
      facing: 'right'
    };
    
    setPatients(prev => [...prev, newPatient]);
  }, []);

  const updateSimulation = useCallback((timestamp: number) => {
    // DISABLED: No more automatic patient spawning or movement
    // Only static patients are shown now
    
    // Trigger re-render for subtle animations in waiting room
    setTick(t => t + 1);
    
    // Update waiting room patient positions
    setWaitingPatients(prev => prev.map(patient => {
      if (patient.progress < 1) {
        // Still moving - slower speed
        return { ...patient, progress: patient.progress + 0.003 };
      } else {
        // Reached target, pick new random target after a pause
        if (Math.random() < 0.01) { // 1% chance per frame to start moving
          const availablePositions = [0, 1, 2, 3, 4].filter(p => p !== patient.targetPos);
          const newTarget = availablePositions[Math.floor(Math.random() * availablePositions.length)];
          return {
            ...patient,
            currentPos: patient.targetPos,
            targetPos: newTarget,
            progress: 0,
            facing: newTarget > patient.targetPos ? 'right' : 'left'
          };
        }
        return patient;
      }
    }));
    
    // Keep animation frame for potential future use
    animationFrameRef.current = requestAnimationFrame(updateSimulation);
  }, []);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(updateSimulation);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [updateSimulation]);


  // --- Interaction Logic ---

  const handleWheel = (e: React.WheelEvent) => {
    const zoomSensitivity = 0.001;
    const newZoom = Math.max(0.4, Math.min(2.0, viewState.zoom - e.deltaY * zoomSensitivity));
    setViewState(prev => ({ ...prev, zoom: newZoom }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    setViewState(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleRoomClick = (room: RoomDef) => {
    if (room.type === RoomType.HEPATOLOGIST) {
      navigate('/doctor');
    } else if (room.type === RoomType.MONITORING) {
      navigate('/monitoring');
    }
  };

  // --- Rendering Loop ---
  
  // Helper to check interval overlap
  const checkOverlap = (min1: number, max1: number, min2: number, max2: number) => {
    return Math.max(min1, min2) < Math.min(max1, max2);
  };

  const renderList = useMemo(() => {
    const floorItems: React.ReactNode[] = [];
    const wallItems: { depth: number; node: React.ReactNode; id: string }[] = [];
    const objectItems: { y: number; node: React.ReactNode; id: string }[] = [];
    const labelItems: React.ReactNode[] = [];

    ROOMS.forEach((room) => {
      // 1. Floor
      const p1 = gridToScreen(room.gridX, room.gridY);
      const p2 = gridToScreen(room.gridX + room.width, room.gridY);
      const p3 = gridToScreen(room.gridX + room.width, room.gridY + room.height);
      const p4 = gridToScreen(room.gridX, room.gridY + room.height);

      floorItems.push(
        <g
          key={`floor-${room.id}`}
          onClick={() => handleRoomClick(room)}
          className="hover:opacity-90 cursor-pointer transition-all"
        >
          <IsoFloor points={[p1, p2, p3, p4]} color={room.floorColor} />
        </g>
      );

      // Label Calculation (Moved to Back Corner "North-East")
      // Skip label for logical routing rooms like hallway_to_doc
      // Skip labels for corridor/hallway rooms
      if (room.id !== 'hallway_to_doc' && room.id !== 'hallway') {
        const labelPos = gridToScreen(room.gridX + 1.5, room.gridY + 1.5);
        labelItems.push(
          <IsoLabel
            key={`lbl-${room.id}`}
            x={labelPos.x}
            y={labelPos.y}
            text={room.name}
          />
        );
      }

      // 2. Walls (with Doors logic and closedWalls check)

      const neighborNorth = ROOMS.find(
        (r) =>
          Math.abs(r.gridY + r.height - room.gridY) < 0.1 &&
          checkOverlap(
            room.gridX,
            room.gridX + room.width,
            r.gridX,
            r.gridX + r.width
          )
      );
      // Check if wall is manually closed
      const isNorthClosed = room.closedWalls?.includes('North');
      const hasNorthDoor = !!neighborNorth && !isNorthClosed;

      const neighborWest = ROOMS.find(
        (r) =>
          Math.abs(r.gridX + r.width - room.gridX) < 0.1 &&
          checkOverlap(
            room.gridY,
            room.gridY + room.height,
            r.gridY,
            r.gridY + r.height
          )
      );
      // Check if wall is manually closed
      const isWestClosed = room.closedWalls?.includes('West');
      const hasWestDoor = (!!neighborWest && !isWestClosed) || room.doorWalls?.includes('West');

      // West Wall (Left side) - depth based on gridX (lower X = further back)
      // Skip if openWalls includes 'West'
      const skipWestWall = room.openWalls?.includes('West');
      if (!skipWestWall) {
        wallItems.push({
          depth: room.gridX + room.gridY,
          id: `wall-w-${room.id}`,
          node: (
            <IsoWall
              key={`wall-w-${room.id}`}
              p1={p1}
              p2={p4}
              height={WALL_HEIGHT}
              color={room.wallColor}
              hasDoor={hasWestDoor}
            />
          ),
        });
      }
      // North Wall (Right side) - depth based on gridY (lower Y = further back)
      // Skip rendering if wall is closed AND there are neighbors with doors (to avoid covering their doors)
      const skipNorthWall = isNorthClosed && !!neighborNorth;
      if (!skipNorthWall) {
        wallItems.push({
          depth: room.gridX + room.gridY,
          id: `wall-n-${room.id}`,
          node: (
            <IsoWall
              key={`wall-n-${room.id}`}
              p1={p1}
              p2={p2}
              height={WALL_HEIGHT}
              color={room.wallColor}
              hasDoor={hasNorthDoor}
            />
          ),
        });
      }

      // South Wall (Back-left side) - only render if explicitly closed OR has door
      const hasSouthDoor = room.doorWalls?.includes('South');
      if (room.closedWalls?.includes('South') || hasSouthDoor) {
        wallItems.push({
          // South wall is at gridY + height, use full room extent for proper sorting
          depth: room.gridX + room.width + room.gridY + room.height,
          id: `wall-s-${room.id}`,
          node: (
            <IsoWall
              key={`wall-s-${room.id}`}
              p1={p4}
              p2={p3}
              height={WALL_HEIGHT}
              color={room.wallColor}
              hasDoor={hasSouthDoor}
            />
          ),
        });
      }

      // East Wall (Back-right side) - only render if explicitly closed
      if (room.closedWalls?.includes('East')) {
        wallItems.push({
          // East wall depth: higher gridY means closer to viewer, should render on top
          depth: room.gridX + room.width + room.gridY + room.height,
          id: `wall-e-${room.id}`,
          node: (
            <IsoWall
              key={`wall-e-${room.id}`}
              p1={p2}
              p2={p3}
              height={WALL_HEIGHT}
              color={room.wallColor}
              hasDoor={false}
            />
          ),
        });
      }

      // 3. Props
      room.props.forEach((prop, idx) => {
        const center = gridToScreen(
          room.gridX + prop.xOffset,
          room.gridY + prop.yOffset
        );
        objectItems.push({
          y: center.y,
          id: `prop-${room.id}-${idx}`,
          node: (
            <IsoProp
              key={`prop-${room.id}-${idx}`}
              type={prop.type}
              x={center.x}
              y={center.y}
            />
          ),
        });
      });
    });

    // 4. Staff
    STAFF.forEach(staff => {
      const room = ROOMS.find(r => r.id === staff.roomId);
      if (room) {
        const center = gridToScreen(room.gridX + staff.gridX, room.gridY + staff.gridY);
        objectItems.push({
          y: center.y,
          id: `staff-${staff.id}`,
          node: <IsoCharacter key={`staff-${staff.id}`} x={center.x} y={center.y} color={staff.color || "#fff"} role={staff.type} facing={staff.facing} isSeated={staff.isSeated} />
        });
      }
    });

    // 4b. Static Patients (excluding waiting room)
    STATIC_PATIENTS.filter(p => p.roomId !== 'waiting').forEach(staticPatient => {
      const room = ROOMS.find(r => r.id === staticPatient.roomId);
      if (room) {
        const center = gridToScreen(room.gridX + staticPatient.gridX, room.gridY + staticPatient.gridY);
        
        objectItems.push({
          y: center.y,
          id: `static-${staticPatient.id}`,
          node: <IsoCharacter key={`static-${staticPatient.id}`} x={center.x} y={center.y} color={staticPatient.color} role="patient" facing={staticPatient.facing} isWalking={false} />
        });
        
        // Add speech bubbles for patients - only when it's patient's turn in that specific room
        const roomPhase = roomConversations[staticPatient.roomId];
        if ((staticPatient.roomId.includes('nurse') || staticPatient.roomId === 'hepatologist') && roomPhase === 'patient') {
          objectItems.push({
            y: center.y - 1,
            id: `bubble-${staticPatient.id}`,
            node: <IsoSpeechBubble key={`bubble-${staticPatient.id}`} x={center.x} y={center.y} type="dots" />
          });
        }
      }
    });

    // 4c. Waiting Room Patients (with movement)
    const waitingRoom = ROOMS.find(r => r.id === 'waiting');
    if (waitingRoom) {
      waitingPatients.forEach(patient => {
        const currentPosData = waitingPositions[patient.currentPos];
        const targetPosData = waitingPositions[patient.targetPos];
        
        const startPos = gridToScreen(waitingRoom.gridX + currentPosData.x, waitingRoom.gridY + currentPosData.y);
        const endPos = gridToScreen(waitingRoom.gridX + targetPosData.x, waitingRoom.gridY + targetPosData.y);
        
        const currentX = lerp(startPos, endPos, patient.progress).x;
        const currentY = lerp(startPos, endPos, patient.progress).y;
        
        objectItems.push({
          y: currentY,
          id: `waiting-${patient.id}`,
          node: <IsoCharacter 
            key={`waiting-${patient.id}`} 
            x={currentX} 
            y={currentY} 
            color={patient.color} 
            role="patient" 
            facing={patient.facing} 
            isWalking={patient.progress < 1} 
          />
        });
      });
    }

    // 4c. Speech bubbles for staff - only when it's staff's turn in that specific room
    STAFF.forEach(staff => {
      const room = ROOMS.find(r => r.id === staff.roomId);
      const roomPhase = roomConversations[staff.roomId];
      if (room && roomPhase === 'staff') {
        const center = gridToScreen(room.gridX + staff.gridX, room.gridY + staff.gridY);
        
        // Show bubbles for nurses and doctor, but NOT for monitoring tech
        if (staff.roomId.includes('nurse') || staff.roomId === 'hepatologist') {
          objectItems.push({
            y: center.y - 1,
            id: `bubble-staff-${staff.id}`,
            node: <IsoSpeechBubble key={`bubble-staff-${staff.id}`} x={center.x + 15} y={center.y} type="dots" />
          });
        }
      }
    });

    // 5. Moving Patients - DISABLED
    // No automatic patient spawning/movement anymore

    // Sort objects by Y
    objectItems.sort((a, b) => a.y - b.y);

    // Sort walls by depth (lower depth = further back = render first)
    wallItems.sort((a, b) => a.depth - b.depth);

    return {
      floorItems,
      sortedWalls: wallItems.map((i) => i.node),
      sortedObjects: objectItems.map((i) => i.node),
      labelItems,
    };
  }, [patients, roomConversations, waitingPatients]); // Re-calc when patients move or room conversations change

  return (
    <div 
      className="w-full h-screen bg-slate-50 overflow-hidden relative select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{
        cursor: isDragging.current ? 'grabbing' : 'grab'
      }}
    >
      {/* UI Overlay */}
      <div className="absolute top-8 left-8 z-20 pointer-events-none">
        <h1 className="text-3xl font-light text-slate-700 tracking-tight">Medforce<span className="font-bold text-sky-500">AI</span></h1>
        <p className="text-slate-400 font-light text-sm tracking-widest uppercase mt-1">AI Powered Clinic</p>
      </div>

  

      {/* SVG Canvas */}
      <svg width="100%" height="100%" className="block" style={{ shapeRendering: 'geometricPrecision' }}>
        <g transform={`translate(${window.innerWidth / 2 + viewState.x}, ${window.innerHeight / 4 + viewState.y}) scale(${viewState.zoom})`}>
          {/* 1. Floors */}
          {renderList.floorItems}

          {/* 2. Walls (sorted by depth) */}
          {renderList.sortedWalls}

          {/* 3. Objects (Staff, Props, Patients) sorted by depth */}
          {renderList.sortedObjects}

          {/* 4. Labels (On Top) */}
          {renderList.labelItems}
        </g>
      </svg>
    </div>
  );
};

export default IsometricMap;
