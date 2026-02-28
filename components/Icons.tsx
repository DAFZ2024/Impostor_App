import React from "react";
import Svg, { Circle, Line, Path, Polyline, Rect } from "react-native-svg";

type IconProps = {
  size?: number;
  color?: string;
};

// ── Grid / Categorías ──
export function GridIcon({ size = 24, color = "#fff" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Rect x="3" y="3" width="7" height="7" rx="1" />
      <Rect x="14" y="3" width="7" height="7" rx="1" />
      <Rect x="3" y="14" width="7" height="7" rx="1" />
      <Rect x="14" y="14" width="7" height="7" rx="1" />
    </Svg>
  );
}

// ── Rayo / Zap ──
export function ZapIcon({ size = 24, color = "#fff" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Polyline points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" />
    </Svg>
  );
}

// ── Flecha atrás ──
export function ArrowLeftIcon({ size = 24, color = "#fff" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Line x1="19" y1="12" x2="5" y2="12" />
      <Polyline points="12,19 5,12 12,5" />
    </Svg>
  );
}

// ── Flecha derecha ──
export function ArrowRightIcon({ size = 24, color = "#fff" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Line x1="5" y1="12" x2="19" y2="12" />
      <Polyline points="12,5 19,12 12,19" />
    </Svg>
  );
}

// ── Rotar a la izquierda ──
export function RotateCcwIcon({ size = 24, color = "#fff" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Polyline points="1,4 1,10 7,10" />
      <Path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </Svg>
  );
}

// ── Rotar a la derecha ──
export function RotateCwIcon({ size = 24, color = "#fff" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Polyline points="23,4 23,10 17,10" />
      <Path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </Svg>
  );
}

// ── Plus / Agregar ──
export function PlusIcon({ size = 24, color = "#fff" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
    >
      <Line x1="12" y1="5" x2="12" y2="19" />
      <Line x1="5" y1="12" x2="19" y2="12" />
    </Svg>
  );
}

// ── X / Cerrar ──
export function CloseIcon({ size = 24, color = "#e74c3c" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
    >
      <Line x1="18" y1="6" x2="6" y2="18" />
      <Line x1="6" y1="6" x2="18" y2="18" />
    </Svg>
  );
}

// ── Usuarios / Grupo ──
export function UsersIcon({ size = 24, color = "#fff" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <Circle cx="9" cy="7" r="4" />
      <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
  );
}

// ── Usuario individual ──
export function UserIcon({ size = 24, color = "#fff" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </Svg>
  );
}

// ── Carpeta / Categoría ──
export function FolderIcon({ size = 24, color = "#fff" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </Svg>
  );
}

// ── Reloj / Timer ──
export function ClockIcon({ size = 24, color = "#fff" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Circle cx="12" cy="12" r="10" />
      <Polyline points="12,6 12,12 16,14" />
    </Svg>
  );
}

// ── Cohete / Iniciar ──
export function RocketIcon({ size = 24, color = "#fff" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <Path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <Path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <Path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </Svg>
  );
}

// ── Gamepad ──
export function GamepadIcon({ size = 24, color = "#fff" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Line x1="6" y1="12" x2="10" y2="12" />
      <Line x1="8" y1="10" x2="8" y2="14" />
      <Line x1="15" y1="13" x2="15.01" y2="13" />
      <Line x1="18" y1="11" x2="18.01" y2="11" />
      <Rect x="2" y="6" width="20" height="12" rx="2" />
    </Svg>
  );
}

// ── Libro / Reglas ──
export function BookIcon({ size = 24, color = "#fff" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </Svg>
  );
}

// ── Ajustes / Engranaje ──
export function SettingsIcon({ size = 24, color = "#fff" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Circle cx="12" cy="12" r="3" />
      <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </Svg>
  );
}

// ── Marciano / Impostor ──
export function AlienIcon({ size = 24, color = "#e74c3c" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Antenas */}
      <Line
        x1="22"
        y1="10"
        x2="18"
        y2="2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Circle cx="18" cy="2" r="2" fill={color} />
      <Line
        x1="42"
        y1="10"
        x2="46"
        y2="2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Circle cx="46" cy="2" r="2" fill={color} />
      {/* Cabeza grande */}
      <Path
        d="M12 32 C12 16 22 8 32 8 C42 8 52 16 52 32 C52 44 44 54 38 58 L26 58 C20 54 12 44 12 32Z"
        fill={color}
        opacity={0.15}
        stroke={color}
        strokeWidth={2.2}
      />
      {/* Ojo izquierdo */}
      <Path
        d="M19 30 C19 24 24 20 28 22 C30 23 30 28 28 32 C26 35 19 35 19 30Z"
        fill={color}
        opacity={0.9}
      />
      {/* Pupila izquierda */}
      <Circle cx="25" cy="28" r="2.5" fill="#050610" />
      {/* Ojo derecho */}
      <Path
        d="M45 30 C45 24 40 20 36 22 C34 23 34 28 36 32 C38 35 45 35 45 30Z"
        fill={color}
        opacity={0.9}
      />
      {/* Pupila derecha */}
      <Circle cx="39" cy="28" r="2.5" fill="#050610" />
      {/* Boca */}
      <Path
        d="M28 44 Q32 48 36 44"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

// ── Escudo / Tripulante ──
export function ShieldIcon({ size = 24, color = "#2ecc71" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <Polyline points="9,12 11,14 15,10" />
    </Svg>
  );
}

// ── Cuchillo / Impostor reveal ──
export function KnifeIcon({ size = 24, color = "#e74c3c" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M6 18L18 6" />
      <Path d="M18 6c-2 2-6 2-8 0" />
      <Path d="M18 6c0 2-2 6 0 8" />
      <Line x1="2" y1="22" x2="6" y2="18" />
    </Svg>
  );
}

// ── Chat / Discusión ──
export function ChatIcon({ size = 24, color = "#fff" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </Svg>
  );
}

// ── Voto / Votación ──
export function VoteIcon({ size = 24, color = "#fff" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Rect x="1" y="14" width="22" height="8" rx="2" />
      <Path d="M3 14V6a2 2 0 0 1 2-2h6l2 2h6a2 2 0 0 1 2 2v6" />
      <Path d="M8 14l4-6 4 6" />
    </Svg>
  );
}

// ── Trofeo / Resultados ──
export function TrophyIcon({ size = 24, color = "#f1c40f" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <Path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <Path d="M4 22h16" />
      <Path d="M10 22V18a2 2 0 0 1 4 0v4" />
      <Rect x="6" y="2" width="12" height="12" rx="2" />
    </Svg>
  );
}

// ── Ojo oculto ──
export function EyeOffIcon({ size = 24, color = "#555" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <Path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <Line x1="1" y1="1" x2="23" y2="23" />
      <Path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    </Svg>
  );
}

// ── Ojo visible ──
export function EyeIcon({ size = 24, color = "#fff" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <Circle cx="12" cy="12" r="3" />
    </Svg>
  );
}

// ── Bombilla / Tip ──
export function LightbulbIcon({ size = 24, color = "#f1c40f" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M9 18h6" />
      <Path d="M10 22h4" />
      <Path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
    </Svg>
  );
}

// ── Refrescar / Jugar de nuevo ──
export function RefreshIcon({ size = 24, color = "#fff" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Polyline points="23,4 23,10 17,10" />
      <Path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </Svg>
  );
}

// ── Check / Confirmar ──
export function CheckIcon({ size = 24, color = "#2ecc71" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Polyline points="20,6 9,17 4,12" />
    </Svg>
  );
}

// ── Guardar / Save ──
export function SaveIcon({ size = 24, color = "#fff" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <Polyline points="17,21 17,13 7,13 7,21" />
      <Polyline points="7,3 7,8 15,8" />
    </Svg>
  );
}

// ── Basurero / Trash ──
export function TrashIcon({ size = 24, color = "#e74c3c" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Polyline points="3,6 5,6 21,6" />
      <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </Svg>
  );
}

// ── Descargar / Download ──
export function DownloadIcon({ size = 24, color = "#fff" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <Polyline points="7,10 12,15 17,10" />
      <Line x1="12" y1="15" x2="12" y2="3" />
    </Svg>
  );
}

// ── Chart / Estadísticas ──
export function ChartIcon({ size = 24, color = "#fff" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Line x1="18" y1="20" x2="18" y2="10" />
      <Line x1="12" y1="20" x2="12" y2="4" />
      <Line x1="6" y1="20" x2="6" y2="14" />
    </Svg>
  );
}

// ══════════════════════════════════════════
// ── Iconos de Categorías ──
// ══════════════════════════════════════════

// ── Pata / Animales ──
export function PawIcon({ size = 24, color = "#fff" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 22c-1.5 0-3-.5-4-1.5C6 18.8 5.5 16.5 7 14.5c1-1.3 2.5-2 4-2.5.5-.2 1-.2 1.5 0 1.5.5 3 1.2 4 2.5 1.5 2 1 4.3-1 6C14.5 21.5 13.5 22 12 22z" />
      <Circle cx="7" cy="8" r="2.5" />
      <Circle cx="17" cy="8" r="2.5" />
      <Circle cx="4" cy="13" r="2" />
      <Circle cx="20" cy="13" r="2" />
    </Svg>
  );
}

// ── Globo / Países ──
export function GlobeIcon({ size = 24, color = "#fff" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Circle cx="12" cy="12" r="10" />
      <Line x1="2" y1="12" x2="22" y2="12" />
      <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
    </Svg>
  );
}

// ── Cubiertos / Comidas ──
export function UtensilsIcon({ size = 24, color = "#fff" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <Line x1="7" y1="2" x2="7" y2="22" />
      <Path d="M17 2c0 0-2 1-2 5s2 5 2 5v10" />
      <Path d="M17 2c0 0 2 1 2 5s-2 5-2 5" />
    </Svg>
  );
}

// ── Balón / Deportes ──
export function SoccerIcon({ size = 24, color = "#fff" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Circle cx="12" cy="12" r="10" />
      <Path d="M12 2l3 7h-6l3-7z" />
      <Path d="M2.5 9.5l6.5 2-4 5.5" />
      <Path d="M21.5 9.5l-6.5 2 4 5.5" />
      <Path d="M7 20l2-6h6l2 6" />
    </Svg>
  );
}

// ── Maletín / Profesiones ──
export function BriefcaseIcon({ size = 24, color = "#fff" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <Path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </Svg>
  );
}

// ── Claqueta / Películas ──
export function FilmIcon({ size = 24, color = "#fff" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
      <Line x1="7" y1="2" x2="7" y2="22" />
      <Line x1="17" y1="2" x2="17" y2="22" />
      <Line x1="2" y1="12" x2="22" y2="12" />
      <Line x1="2" y1="7" x2="7" y2="7" />
      <Line x1="2" y1="17" x2="7" y2="17" />
      <Line x1="17" y1="7" x2="22" y2="7" />
      <Line x1="17" y1="17" x2="22" y2="17" />
    </Svg>
  );
}

// ── Pin / Lugares ──
export function MapPinIcon({ size = 24, color = "#fff" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <Circle cx="12" cy="10" r="3" />
    </Svg>
  );
}

// ── Llave inglesa / Objetos ──
export function WrenchIcon({ size = 24, color = "#fff" }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </Svg>
  );
}
