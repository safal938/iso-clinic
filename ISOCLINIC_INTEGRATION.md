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

## Features Included

- Interactive isometric clinic layout with multiple rooms (Reception, Telemedicine, Waiting Area, Triage Rooms, Hepatologist, AI Monitoring)
- Animated staff and patients with conversation bubbles
- Draggable viewport with mouse
- Zoom in/out with mouse wheel
- Waiting room patients that move between positions
- Detailed 3D-style props (desks, beds, sofas, plants, servers)

## What Was Excluded

As requested, the following sub-pages were NOT included:
- Chat Page (MonitoringChat component)
- Room Detail page
- Gemini AI integration
- Recharts dependencies

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
- **Click Hepatologist Room**: Navigate to the board application
- **Observe**: Watch staff and patients interact with animated speech bubbles

### Board View (/board)
- **Back to Clinic Button**: Click the button in the top-left corner to return to the clinic view
