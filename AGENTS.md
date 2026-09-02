# Project Design & Engineering Guidelines

## Apple Human Interface Guidelines (HIG) & Visual Language
1. **Materials & Vibrancy**:
   - Use multi-layered translucent surfaces with backdrop blur (`backdrop-blur-2xl`, `bg-black/45` or `bg-[#1C1F1B]/75` with subtle gradient sheen).
   - High-precision borders: Specular inner highlight using subtle white/gold borders (`border border-white/12` or `border-[#C5A46D]/35` with inset shadow highlights).
   - Apple Squircles & Nested Corner Radii: Outer containers `rounded-[28px]` or `rounded-[32px]`, inner items `rounded-2xl` calculated using `Inner Radius = Outer Radius - Padding`.

2. **Typography & Optical Balance**:
   - Strict optical hierarchy, pairing luxury display calligraphy (Amiri / Aref Ruqaa / Nastaliq accents) with ultra-clean, legible Persian UI fonts (Vazirmatn / SF-grade clean Persian glyphs).
   - Monospace & SF-style numeric tabular formatting for countdowns, dates, and stats (`tabular-nums font-mono`).

3. **Floating Controls & Dynamic Island Aesthetics**:
   - Floating control capsules (Music dock, navigation pills, action triggers) with pill shapes (`rounded-full`), smooth depth drop shadows, and subtle glass sheen.
   - Clean iconography from `lucide-react` with precise 1.5–2px stroke weights.

## Emil Kowalski Micro-Interactions & Motion Principles
1. **Spring Physics over Linear Timing**:
   - Never use `ease-in` for entering UI.
   - Use high-quality spring physics with `motion/react` (`type: "spring", stiffness: 380, damping: 28` for clicks/popovers, `stiffness: 260, damping: 24` for sheets/cards).
   - Active tactile feedback on all interactive elements (`whileTap={{ scale: 0.96 }}`, `whileHover={{ scale: 1.02 }}`).

2. **Layout Morphing & Seamless Continuity**:
   - Use `layoutId` for moving indicators (e.g. tabs, active selections, pills).
   - Shared layout transitions for modal openings, sheet expansions, and music dock toggles.

3. **Tactile Haptic & Micro-Feedback**:
   - Subtle pulse animations, waveform equalizer bars that respond to audio playback, wax seal break & envelope flip with physical 3D perspective (`preserve-3d`, perspective projection).
   - Clean Sonner-grade notifications and toasts with dismiss gestures and fluid stacking.
