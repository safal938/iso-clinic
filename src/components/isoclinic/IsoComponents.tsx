import React from 'react';
import { PropType } from '../../types/isoclinic';

const getCubePath = (x: number, y: number, w: number, h: number, z: number) => {
  const hw = w / 2;
  const hh = h / 4;
  
  const p_bot = { x, y };
  const p_right = { x: x + hw, y: y - hh };
  const p_left = { x: x - hw, y: y - hh };
  const p_top = { x, y: y - 2 * hh };
  
  const p_bot_z = { x, y: y - z };
  const p_right_z = { x: x + hw, y: y - hh - z };
  const p_left_z = { x: x - hw, y: y - hh - z };
  const p_top_z = { x, y: y - 2 * hh - z };

  const topFace = `M${p_left_z.x},${p_left_z.y} L${p_top_z.x},${p_top_z.y} L${p_right_z.x},${p_right_z.y} L${p_bot_z.x},${p_bot_z.y} Z`;
  const rightFace = `M${p_bot.x},${p_bot.y} L${p_right.x},${p_right.y} L${p_right_z.x},${p_right_z.y} L${p_bot_z.x},${p_bot_z.y} Z`;
  const leftFace = `M${p_bot.x},${p_bot.y} L${p_left.x},${p_left.y} L${p_left_z.x},${p_left_z.y} L${p_bot_z.x},${p_bot_z.y} Z`;
  const shadow = `M${p_left.x},${p_left.y} L${p_top.x},${p_top.y} L${p_right.x},${p_right.y} L${p_bot.x},${p_bot.y} Z`;

  return { topFace, rightFace, leftFace, shadow };
};

const drawPrism = (x: number, y: number, w: number, d: number, h: number, colorTop: string, colorSide: string) => {
  const vx_r = w;
  const vy_r = -w / 2;
  const vx_l = -d;
  const vy_l = -d / 2;

  const p0 = { x, y };
  const pR = { x: x + vx_r, y: y + vy_r };
  const pL = { x: x + vx_l, y: y + vy_l };
  const pT = { x: x + vx_r + vx_l, y: y + vy_r + vy_l };

  const p0_h = { x: p0.x, y: p0.y - h };
  const pR_h = { x: pR.x, y: pR.y - h };
  const pL_h = { x: pL.x, y: pL.y - h };
  const pT_h = { x: pT.x, y: pT.y - h };

  const pathRight = `M${p0.x},${p0.y} L${pR.x},${pR.y} L${pR_h.x},${pR_h.y} L${p0_h.x},${p0_h.y} Z`;
  const pathLeft = `M${p0.x},${p0.y} L${pL.x},${pL.y} L${pL_h.x},${pL_h.y} L${p0_h.x},${p0_h.y} Z`;
  const pathTop = `M${p0_h.x},${p0_h.y} L${pR_h.x},${pR_h.y} L${pT_h.x},${pT_h.y} L${pL_h.x},${pL_h.y} Z`;

  return (
    <g>
      <path d={pathLeft} fill={colorSide} stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
      <path d={pathRight} fill={colorSide} style={{ filter: 'brightness(0.9)' }} stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
      <path d={pathTop} fill={colorTop} stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
    </g>
  );
};

interface IsoLabelProps {
  x: number;
  y: number;
  text: string;
}

export const IsoLabel: React.FC<IsoLabelProps> = ({ x, y, text }) => {
  return (
    <g transform={`translate(${x}, ${y - 110})`} style={{ pointerEvents: 'none' }}>
      <rect x="-42" y="-10" width="84" height="24" rx="12" fill="rgba(0,0,0,0.1)" transform="translate(2, 2)" />
      <rect x="-42" y="-12" width="84" height="24" rx="12" fill="rgba(255,255,255,0.95)" stroke="#94a3b8" strokeWidth="1" />
      <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0f172a" style={{ letterSpacing: '0.02em' }}>
        {text.toUpperCase()}
      </text>
      <line x1="0" y1="12" x2="0" y2="55" stroke="rgba(255,255,255,0.6)" strokeWidth="1" strokeDasharray="3 3" />
    </g>
  );
};

interface IsoSpeechBubbleProps {
  x: number;
  y: number;
  type?: 'dots' | 'text';
  text?: string;
}

export const IsoSpeechBubble: React.FC<IsoSpeechBubbleProps> = ({ x, y, type = 'dots', text }) => {
  return (
    <g transform={`translate(${x}, ${y - 80})`} style={{ pointerEvents: 'none' }}>
      <g>
        <ellipse cx="2" cy="2" rx="22" ry="16" fill="rgba(0,0,0,0.15)" />
        <ellipse cx="0" cy="0" rx="22" ry="16" fill="white" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-10,12 Q-14,18 -16,16 Q-12,14 -8,10 Z" fill="white" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="-6" cy="-6" rx="8" ry="5" fill="white" opacity="0.6" />
        
        {type === 'dots' ? (
          <>
            <circle cx="-9" cy="0" r="2.5" fill="#1e293b">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" begin="0s" />
              <animate attributeName="r" values="2.5;3;2.5" dur="1.5s" repeatCount="indefinite" begin="0s" />
            </circle>
            <circle cx="0" cy="0" r="2.5" fill="#1e293b">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" begin="0.3s" />
              <animate attributeName="r" values="2.5;3;2.5" dur="1.5s" repeatCount="indefinite" begin="0.3s" />
            </circle>
            <circle cx="9" cy="0" r="2.5" fill="#1e293b">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" begin="0.6s" />
              <animate attributeName="r" values="2.5;3;2.5" dur="1.5s" repeatCount="indefinite" begin="0.6s" />
            </circle>
          </>
        ) : (
          <text x="0" y="4" textAnchor="middle" fontSize="10" fill="#1e293b" fontWeight="800" fontFamily="Arial, sans-serif">
            {text || '...'}
          </text>
        )}
      </g>
    </g>
  );
};

interface IsoWallProps {
  p1: {x:number, y:number};
  p2: {x:number, y:number};
  height: number;
  color: string;
  thickness?: number;
  hasDoor?: boolean;
}

export const IsoWall: React.FC<IsoWallProps> = ({ p1, p2, height, color, thickness = 8, hasDoor = false }) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const offY = -thickness;

  const bodyColorLeft = "#cbd5e1";
  const bodyColorRight = "#94a3b8";
  const topColor = "#0ea5e9";
  const strokeColor = "#64748b";

  const renderProps = {
    stroke: strokeColor,
    strokeWidth: "0.5",
    strokeLinejoin: "round" as const,
    shapeRendering: "geometricPrecision"
  };

  if (!hasDoor) {
    const v_bl = { x: p1.x, y: p1.y };
    const v_br = { x: p2.x, y: p2.y };
    const v_tl = { x: p1.x, y: p1.y - height };
    const v_tr = { x: p2.x, y: p2.y - height };
    
    const v_tl_back = { x: v_tl.x, y: v_tl.y + offY };
    const v_tr_back = { x: v_tr.x, y: v_tr.y + offY };

    const wallPath = `M${v_bl.x},${v_bl.y} L${v_br.x},${v_br.y} L${v_tr.x},${v_tr.y} L${v_tl.x},${v_tl.y} Z`;
    const topPath = `M${v_tl.x},${v_tl.y} L${v_tr.x},${v_tr.y} L${v_tr_back.x},${v_tr_back.y} L${v_tl_back.x},${v_tl_back.y} Z`;

    return (
      <g>
        <path d={wallPath} fill={bodyColorLeft} {...renderProps} />
        <path d={topPath} fill={topColor} stroke="none" />
      </g>
    );
  }

  const doorWidthRatio = 0.35;
  const doorHeightRatio = 0.65;
  const t1 = 0.5 - doorWidthRatio/2;
  const t2 = 0.5 + doorWidthRatio/2;

  const pDoorL = { x: p1.x + dx*t1, y: p1.y + dy*t1 };
  const pDoorR = { x: p1.x + dx*t2, y: p1.y + dy*t2 };

  const hFull = height;
  const hDoor = height * doorHeightRatio;

  const leftSegPath = `M${p1.x},${p1.y} L${pDoorL.x},${pDoorL.y} L${pDoorL.x},${pDoorL.y - hFull} L${p1.x},${p1.y - hFull} Z`;
  const rightSegPath = `M${pDoorR.x},${pDoorR.y} L${p2.x},${p2.y} L${p2.x},${p2.y - hFull} L${pDoorR.x},${pDoorR.y - hFull} Z`;
  const headerPath = `M${pDoorL.x},${pDoorL.y - hFull} L${pDoorR.x},${pDoorR.y - hFull} L${pDoorR.x},${pDoorR.y - hDoor} L${pDoorL.x},${pDoorL.y - hDoor} Z`;

  const topL = `M${p1.x},${p1.y-hFull} L${pDoorL.x},${pDoorL.y-hFull} L${pDoorL.x},${pDoorL.y-hFull+offY} L${p1.x},${p1.y-hFull+offY} Z`;
  const topR = `M${pDoorR.x},${pDoorR.y-hFull} L${p2.x},${p2.y-hFull} L${p2.x},${p2.y-hFull+offY} L${pDoorR.x},${pDoorR.y-hFull+offY} Z`;
  const topH = `M${pDoorL.x},${pDoorL.y-hFull} L${pDoorR.x},${pDoorR.y-hFull} L${pDoorR.x},${pDoorR.y-hFull+offY} L${pDoorL.x},${pDoorL.y-hFull+offY} Z`;

  const jambL = `M${pDoorL.x},${pDoorL.y} L${pDoorL.x},${pDoorL.y+offY} L${pDoorL.x},${pDoorL.y-hFull+offY} L${pDoorL.x},${pDoorL.y-hFull} Z`;
  const jambR = `M${pDoorR.x},${pDoorR.y} L${pDoorR.x},${pDoorR.y+offY} L${pDoorR.x},${pDoorR.y-hFull+offY} L${pDoorR.x},${pDoorR.y-hFull} Z`;
  const soffit = `M${pDoorL.x},${pDoorL.y-hDoor} L${pDoorR.x},${pDoorR.y-hDoor} L${pDoorR.x},${pDoorR.y-hDoor+offY} L${pDoorL.x},${pDoorL.y-hDoor+offY} Z`;

  return (
    <g>
      <path d={jambL} fill={bodyColorRight} {...renderProps} />
      <path d={jambR} fill={bodyColorRight} {...renderProps} />
      <path d={soffit} fill={bodyColorRight} stroke="none" />
      <path d={leftSegPath} fill={bodyColorLeft} {...renderProps} />
      <path d={rightSegPath} fill={bodyColorLeft} {...renderProps} />
      <path d={headerPath} fill={bodyColorLeft} {...renderProps} />
      <path d={topL} fill={topColor} stroke="none" />
      <path d={topR} fill={topColor} stroke="none" />
      <path d={topH} fill={topColor} stroke="none" />
    </g>
  );
};

interface IsoFloorProps {
  points: {x:number,y:number}[];
  color: string;
}

export const IsoFloor: React.FC<IsoFloorProps> = ({ points, color }) => {
  const path = `M${points[0].x},${points[0].y} L${points[1].x},${points[1].y} L${points[2].x},${points[2].y} L${points[3].x},${points[3].y} Z`;
  return (
    <g>
      <path d={path} fill={color} stroke="#f1f5f9" strokeWidth="0.5" strokeLinejoin="round" />
    </g>
  );
};

interface IsoCharacterProps {
  x: number;
  y: number;
  color: string;
  role: 'patient' | 'doctor' | 'nurse' | 'admin' | 'tech';
  facing?: 'left' | 'right';
  isWalking?: boolean;
  isSeated?: boolean;
}

export const IsoCharacter: React.FC<IsoCharacterProps> = ({ x, y, color, role, facing = 'right', isWalking = false, isSeated = false }) => {
  const s = 1.0;
  const bounce = isWalking ? Math.sin(Date.now() / 150) * 3 : 0;
  const legSwing = isWalking ? Math.sin(Date.now() / 150) * 5 : 0;
  
  const isDoc = role === 'doctor';
  const isNurse = role === 'nurse';
  const transform = `translate(${x}, ${y}) scale(${facing === 'left' ? -1 : 1}, 1)`;

  if (isSeated) {
    return (
      <g transform={transform}>
        <ellipse cx="0" cy="0" rx={12*s} ry={6*s} fill="rgba(0,0,0,0.1)" />
        {isDoc ? (
           <path d={`M-9,${-35} L9,${-35} L10,${-10} L-10,${-10} Z`} fill="#ffffff" stroke="#cbd5e1" strokeWidth="1"/>
        ) : isNurse ? (
           <path d={`M-8,${-35} L8,${-35} L8,${-10} L-8,${-10} Z`} fill="#0ea5e9" />
        ) : (
           <path d={`M-8,${-35} L8,${-35} L7,${-10} L-7,${-10} Z`} fill={color} />
        )}
        <circle cx="0" cy={-45} r={9*s} fill="#fec" />
        {role === 'nurse' && <path d={`M-10,${-48} L10,${-48} L8,${-55} L-8,${-55} Z`} fill="#0ea5e9" />}
        {role === 'admin' && <circle cx="0" cy={-50} r={9*s} fill="#475569" clipPath="inset(0 0 50% 0)" />}
        {role === 'doctor' && <circle cx="0" cy={-50} r={9*s} fill="#475569" clipPath="inset(0 0 50% 0)" />}
        {role === 'patient' && <circle cx="0" cy={-50} r={9*s} fill={color} style={{filter: 'brightness(0.8)'}} clipPath="inset(0 0 50% 0)" />}
        {role === 'tech' && <circle cx="0" cy={-50} r={9*s} fill="#1e293b" clipPath="inset(0 0 50% 0)" />}
        {isDoc && <path d="M-5,-35 Q0,-25 5,-35" fill="none" stroke="#94a3b8" strokeWidth="1" />}
      </g>
    );
  }

  return (
    <g transform={transform}>
      <ellipse cx="0" cy="0" rx={12*s} ry={6*s} fill="rgba(0,0,0,0.1)" />
      <line x1={-4*s} y1={-20*s} x2={-4*s - legSwing} y2={0} stroke="#334155" strokeWidth={4*s} strokeLinecap="round" />
      <line x1={4*s} y1={-20*s} x2={4*s + legSwing} y2={0} stroke="#334155" strokeWidth={4*s} strokeLinecap="round" />
      {isDoc ? (
         <path d={`M-9,${-45} L9,${-45} L10,${-15} L-10,${-15} Z`} fill="#ffffff" transform={`translate(0, ${bounce})`} stroke="#cbd5e1" strokeWidth="1"/>
      ) : isNurse ? (
         <path d={`M-8,${-45} L8,${-45} L8,${-15} L-8,${-15} Z`} fill="#0ea5e9" transform={`translate(0, ${bounce})`} />
      ) : (
         <path d={`M-8,${-45} L8,${-45} L7,${-20} L-7,${-20} Z`} fill={color} transform={`translate(0, ${bounce})`} />
      )}
      <circle cx="0" cy={-55 + bounce} r={9*s} fill="#fec" />
      {role === 'nurse' && <path d={`M-10,${-58+bounce} L10,${-58+bounce} L8,${-65+bounce} L-8,${-65+bounce} Z`} fill="#0ea5e9" />}
      {role === 'admin' && <circle cx="0" cy={-60+bounce} r={9*s} fill="#475569" clipPath="inset(0 0 50% 0)" />}
      {role === 'doctor' && <circle cx="0" cy={-60+bounce} r={9*s} fill="#475569" clipPath="inset(0 0 50% 0)" />}
      {role === 'patient' && <circle cx="0" cy={-60+bounce} r={9*s} fill={color} style={{filter: 'brightness(0.8)'}} clipPath="inset(0 0 50% 0)" />}
      {role === 'tech' && <circle cx="0" cy={-60+bounce} r={9*s} fill="#1e293b" clipPath="inset(0 0 50% 0)" />}
      {isDoc && <path d="M-5,-45 Q0,-35 5,-45" fill="none" stroke="#94a3b8" strokeWidth="1" transform={`translate(0, ${bounce})`} />}
    </g>
  );
};

interface IsoPropProps {
  type: PropType;
  x: number;
  y: number;
  rotation?: string;
}

export const IsoProp: React.FC<IsoPropProps> = ({ type, x, y, rotation = 'none' }) => {
  if (type === 'sofa') {
    const seatW = 20, seatD = 20, seatH = 8, backD = 4, backH = 22;
    const bx = x - seatD, by = y - seatD / 2;
    return (
      <g>
        {drawPrism(bx, by, seatW, backD, backH, "#64748b", "#475569")}
        {drawPrism(x, y, seatW, seatD, seatH, "#94a3b8", "#64748b")}
      </g>
    );
  }

  if (type === 'bed') {
    const mattressW = 22, mattressD = 45, mattressH = 10, headH = 24, headD = 3;
    const hx = x - mattressD, hy = y - mattressD / 2;
    const topY = y - mattressH;
    const p1 = { x: x, y: topY };
    const p2 = { x: x + mattressW, y: topY - mattressW/2 };
    const p4 = { x: x - mattressD, y: topY - mattressD/2 };
    const midL = { x: (p1.x + p4.x)/2 + 5, y: (p1.y + p4.y)/2 + 2.5 };
    const midR = { x: (p2.x + (x + mattressW - mattressD))/2 + 5, y: (p2.y + (topY - mattressW/2 - mattressD/2))/2 + 2.5 };
    const blanketPath = `M${p1.x},${p1.y} L${p2.x},${p2.y} L${midR.x},${midR.y} Q${(midL.x+midR.x)/2 - 5},${(midL.y+midR.y)/2 + 5} ${midL.x},${midL.y} Z`;
    const pillowX = hx + mattressW/2 + 2, pillowY = hy - mattressH - 2;

    return (
      <g>
        {drawPrism(hx, hy, mattressW, headD, headH, "#475569", "#334155")}
        {drawPrism(x, y, mattressW, mattressD, mattressH, "#f8fafc", "#e2e8f0")}
        <path d={blanketPath} fill="#60a5fa" fillOpacity="0.9" />
        <ellipse cx={pillowX} cy={pillowY} rx="6" ry="3" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" transform={`rotate(-25 ${pillowX} ${pillowY})`} />
      </g>
    );
  }

  let dim = { w: 30, h: 30, z: 20 };
  let color = "#e2e8f0";
  
  if (type === 'desk') { dim = { w: 50, h: 35, z: 28 }; color = "#f8fafc"; }
  if (type === 'reception_desk') { dim = { w: 70, h: 30, z: 30 }; color = "#f8fafc"; }
  if (type === 'server') { dim = { w: 20, h: 20, z: 60 }; color = "#0f172a"; }
  if (type === 'shelf') { dim = { w: 10, h: 40, z: 50 }; color = "#f8fafc"; }
  if (type === 'mri') { dim = { w: 60, h: 60, z: 50 }; color = "#e2e8f0"; }
  if (type === 'chair') { dim = { w: 16, h: 16, z: 20 }; color = "#334155"; }
  if (type === 'plant') { dim = { w: 10, h: 10, z: 15 }; color = "#166534"; }

  const { topFace, rightFace, leftFace } = getCubePath(x, y, dim.w, dim.h, dim.z);

  const screen = (type === 'desk' || type === 'reception_desk') ? (
    <g>
      <path d={`M${x},${y-28} L${x},${y-38}`} stroke="#64748b" strokeWidth="3" />
      <path d={`M${x-14},${y-38} L${x+14},${y-38} L${x+14},${y-58} L${x-14},${y-58} Z`} fill="#1e293b" stroke="#cbd5e1" strokeWidth="0.5" />
      <path d={`M${x-12},${y-40} L${x+12},${y-40} L${x+12},${y-56} L${x-12},${y-56} Z`} fill="#38bdf8" fillOpacity="0.8" />
      <ellipse cx={x} cy={y-24} rx="10" ry="4" fill="#475569" opacity="0.8" />
    </g>
  ) : null;

  const plantLeaves = type === 'plant' ? (
     <g transform={`translate(0,-15)`}>
        <path d={`M${x},${y} Q${x+5},${y-15} ${x+10},${y-5}`} fill="none" stroke="#166534" strokeWidth="2" />
        <path d={`M${x},${y} Q${x-5},${y-18} ${x-10},${y-8}`} fill="none" stroke="#166534" strokeWidth="2" />
        <path d={`M${x},${y} L${x},${y-20}`} fill="none" stroke="#166534" strokeWidth="2" />
     </g>
  ) : null;

  return (
    <g>
      <path d={leftFace} fill={color} style={{ filter: 'brightness(0.9)' }} stroke="#94a3b8" strokeWidth="0.5" strokeLinejoin="round" />
      <path d={rightFace} fill={color} style={{ filter: 'brightness(0.8)' }} stroke="#94a3b8" strokeWidth="0.5" strokeLinejoin="round" />
      <path d={topFace} fill={color} stroke="#94a3b8" strokeWidth="0.5" strokeLinejoin="round" />
      {screen}
      {plantLeaves}
      {type === 'server' && (
        <>
          <circle cx={x+5} cy={y-50} r="1" fill="#22c55e" className="animate-pulse" />
          <circle cx={x+5} cy={y-40} r="1" fill="#22c55e" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
        </>
      )}
    </g>
  );
};
