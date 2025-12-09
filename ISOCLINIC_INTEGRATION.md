# Isoclinic Simulator Integration

The isoclinic simulator main page has been successfully integrated into the main project.

## What Was Added

### Files Created:
- `src/types/isoclinic.ts` - Type definitions for rooms, patients, staff, and props
- `src/constants/isoclinic.ts` - Room layouts, staff positions, and configuration constants
- `src/utils/isometric.ts` - Isometric projection utility functions
- `src/components/isoclinic/IsoComponents.tsx` - Reusable isometric components (walls, floors, characters, props)
- `src/components/isoclinic/IsometricMap.tsx` - Main isometric clinic visualization component

### Routes Updated:
- `/` (root) - Isometric clinic simulator (main homepage)
- `/board` - Original board application (moved from root)
- `/nurse-sim` - Nurse simulation with clinical scenarios (accessed from triage rooms)

## Features Included

- Interactive isometric clinic simulation with patient flow visualization
- Real-time simulation with Start/Pause controls
- Patient spawning and movement through clinic workflow
- Collapsible sidebar with simulation metrics:
  - Productivity gain tracking
  - Patient treatment counts
  - Doctor/Nurse patient ratios
  - Arrival rate statistics
  - Real-time patient status by location
- Time-based simulation (9 AM - 6 PM clinic hours)
- Zoom controls and pan navigation
- Nurse simulation integration - click triage rooms to access clinical scenarios
- Click Hepatologist room to access the board application

## What Was Excluded

As requested, the following were NOT included:
- Chat Page (MonitoringChat component) from isoclinic-simulator
- Room Detail page from isoclinic-simulator
- Recharts dependencies from isoclinic-simulator
- Gemini AI integration from nurse-sim (WebSocket only)
- Decision Support tree component from nurse-sim

## Usage

The clinic simulator is now the main homepage:
```
http://localhost:3000/
```

To access the original board application:
```
http://localhost:3000/board
```

## Controls

### Clinic View (/)
- **Drag**: Click and drag to pan the view
- **Scroll**: Use mouse wheel to zoom in/out
- **Click Hepatologist Room or Doctor**: Navigate to the board application
- **Click Triage Rooms or Nurses/Patients in Triage**: Navigate to nurse simulation with clinical scenarios
- **Click Characters**: All staff and patients are clickable and will navigate to their room's destination
- **Observe**: Watch staff and patients interact with animated speech bubbles

### Board View (/board)
- **Back to Clinic Button**: Click the button in the top-left corner to return to the clinic view

### Nurse Simulation (/nurse-sim)
- **Auto-assigned Patients**: Each triage room automatically loads a specific patient:
  - Triage 1 → Sarah Miller (Methotrexate/Infection case)
  - Triage 2 → David Chen (Overdose/Gastritis case)
  - Triage 3 → Maria Garcia (Alcohol/Medication case)
- **Full Simulation Interface**:
  - Patient information sidebar with medical history
  - Real-time chat interface with nurse-patient conversation
  - Clinical dashboard with diagnostic assessment and checklist
  - WebSocket connection to backend for live simulation
  - Timer tracking (10-minute sessions)
  - Debug panel for WebSocket logs
- **Interactive Features**:
  - Start/Stop simulation
  - Reset simulation
  - Expand/collapse panels
  - Real-time diagnostic updates
  - Dynamic question checklist
- **Back to Clinic**: Return to the main clinic view from patient info panel
