/* ── Shared theater UI components ──────────────────────────── */
import { useLights } from '../LightsContext.jsx'

export function MarqueeLights({ count = 28, size = 9 }) {
  const { lightsOn } = useLights()
  return (
    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'nowrap', gap: 6, padding: '0 8px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            flexShrink: 0,
            width: size,
            height: size,
            borderRadius: '50%',
            background: lightsOn
              ? 'radial-gradient(circle, #fffde0 0%, #f8d040 40%, #c08010 100%)'
              : 'radial-gradient(circle, #2a1e08 0%, #1a1205 60%, #0f0902 100%)',
            boxShadow: lightsOn
              ? '0 0 4px 2px rgba(248,210,64,0.95), 0 0 10px 3px rgba(200,140,10,0.7)'
              : 'none',
            transition: 'background 0.6s ease, box-shadow 0.6s ease',
          }}
        />
      ))}
    </div>
  )
}

export function Column({ side }) {
  const flutes = 9
  return (
    <div style={{
      position: 'absolute', top: 0, bottom: 0, width: 108, [side]: 0, zIndex: 2,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{ height: 12, flexShrink: 0, background: 'linear-gradient(to bottom, #c49020, #8a6210 60%, #5a3e08)', boxShadow: '0 3px 10px rgba(0,0,0,0.8)' }} />
      <div style={{ height: 6, flexShrink: 0, background: 'linear-gradient(to bottom, #3a2606, #201404)' }} />
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #0c0802 0%, #1c1206 25%, #231608 50%, #1c1206 75%, #0c0802 100%)' }} />
        {Array.from({ length: flutes }).map((_, i) => {
          const pct = (i / (flutes - 1)) * 100
          return (
            <div key={i} style={{
              position: 'absolute', top: 0, bottom: 0,
              left: `calc(${pct}% - 4px)`, width: 8,
              background: 'radial-gradient(ellipse at 50% 40%, rgba(160,105,22,0.5) 0%, rgba(90,58,10,0.25) 50%, transparent 100%)',
              borderLeft: '1px solid rgba(140,88,16,0.18)',
              borderRight: '1px solid rgba(0,0,0,0.55)',
            }} />
          )
        })}
        <div style={{
          position: 'absolute', top: '8%', width: '110%', height: '40%',
          left: side === 'left' ? '20%' : '-30%',
          background: 'radial-gradient(ellipse, rgba(200,138,26,0.22) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
      </div>
      <div style={{ height: 6, flexShrink: 0, background: 'linear-gradient(to top, #3a2606, #201404)' }} />
      <div style={{ height: 12, flexShrink: 0, background: 'linear-gradient(to top, #c49020, #8a6210 60%, #5a3e08)', boxShadow: '0 -3px 10px rgba(0,0,0,0.8)' }} />
      <div style={{
        position: 'absolute', top: 0, bottom: 0, width: 4,
        [side === 'left' ? 'right' : 'left']: 0,
        background: 'linear-gradient(to bottom, #6a4a10, #d4aa28, #f0d050, #f0d050, #d4aa28, #6a4a10)',
        boxShadow: side === 'left' ? '3px 0 16px rgba(220,175,40,0.55)' : '-3px 0 16px rgba(220,175,40,0.55)',
      }} />
    </div>
  )
}

export function Lantern({ side }) {
  const { lightsOn } = useLights()
  const pos = side === 'left' ? { left: 22 } : { right: 22 }
  const glowStrong  = lightsOn ? '0 0 28px 12px rgba(245,190,35,0.7), 0 0 70px 32px rgba(220,145,10,0.38), 0 0 120px 60px rgba(185,105,8,0.22), inset 0 0 20px rgba(255,215,65,0.32)' : 'inset 0 0 8px rgba(0,0,0,0.6)'
  const flameStyle  = lightsOn
    ? { width: 18, height: 26, background: 'radial-gradient(ellipse at 50% 65%, #fffee0 0%, #f8d030 35%, #e07010 65%, transparent 100%)', boxShadow: '0 0 14px 6px rgba(248,200,40,0.85)', borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }
    : { width: 18, height: 26, background: 'radial-gradient(ellipse at 50% 65%, #2a1e08 0%, #1a1205 70%, transparent 100%)', borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }

  return (
    <div style={{ position: 'absolute', top: '22%', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'filter 0.6s ease', ...pos }}>
      <div style={{ width: 6, height: 22, background: 'linear-gradient(to bottom, #d4a820, #7a5010)', borderRadius: 3 }} />
      <div style={{ width: 46, height: 8, background: 'linear-gradient(to bottom, #e8c040, #a07020)', borderRadius: '3px 3px 0 0', boxShadow: '0 -2px 6px rgba(0,0,0,0.5)' }} />
      <div style={{
        width: 46, height: 66, position: 'relative',
        background: 'linear-gradient(160deg, #3c2c10 0%, #1c1205 60%, #2a1c08 100%)',
        border: '2px solid #a07828',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: glowStrong,
        transition: 'box-shadow 0.6s ease',
      }}>
        {[-11, 0, 11].map(x => (
          <div key={x} style={{
            position: 'absolute', top: 4, bottom: 4, width: 1, left: `calc(50% + ${x}px)`,
            background: 'linear-gradient(to bottom, transparent, rgba(160,120,40,0.45), transparent)',
          }} />
        ))}
        <div style={{ ...flameStyle, transition: 'background 0.6s ease, box-shadow 0.6s ease' }} />
      </div>
      <div style={{ width: 46, height: 8, background: 'linear-gradient(to top, #e8c040, #a07020)', borderRadius: '0 0 3px 3px', boxShadow: '0 3px 6px rgba(0,0,0,0.5)' }} />
      <div style={{ width: 6, height: 64, background: 'linear-gradient(to bottom, #a07020, #5a3810)', borderRadius: 3 }} />
      <div style={{ width: 30, height: 8, background: 'linear-gradient(to bottom, #c9a030, #7a5010)', borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.7)' }} />
    </div>
  )
}

/* ── Light switch lever (place below left lantern) ─────────── */
export function LightSwitch() {
  const { lightsOn, toggleLights } = useLights()

  // Lantern starts at top:22%, total height ≈ 196px  → place switch below with small gap
  return (
    <div
      onClick={toggleLights}
      title={lightsOn ? 'Apagar luces' : 'Encender luces'}
      style={{
        position: 'absolute',
        top: 'calc(22% + 212px)',
        left: 16,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {/* Wall plate */}
      <div style={{
        width: 52,
        height: 78,
        background: 'linear-gradient(160deg, #3c2a10 0%, #201408 60%, #2a1c0a 100%)',
        border: '2px solid #a07828',
        borderRadius: 5,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 4px 18px rgba(0,0,0,0.75), inset 0 0 16px rgba(0,0,0,0.5), ${lightsOn ? '0 0 14px 4px rgba(245,185,30,0.22)' : 'none'}`,
        transition: 'box-shadow 0.5s ease',
      }}>
        {/* Plate corner rivets */}
        {[[6,6],[6,'auto'],[,'auto'],[,6]].map(([t,b], idx) => {
          const corners = [
            { top: 5, left: 5 }, { top: 5, right: 5 },
            { bottom: 5, left: 5 }, { bottom: 5, right: 5 },
          ]
          return (
            <div key={idx} style={{
              position: 'absolute', width: 4, height: 4, borderRadius: '50%',
              background: '#7a5818', border: '1px solid #c09030',
              ...corners[idx],
            }} />
          )
        })}

        {/* Pivot housing */}
        <div style={{ position: 'relative', width: 14, height: 54 }}>
          {/* Lever arm */}
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            width: 10, height: 46,
            transformOrigin: '50% 50%',
            transform: `translate(-50%, -50%) rotate(${lightsOn ? -28 : 28}deg)`,
            background: 'linear-gradient(to right, #f0d060 0%, #c89828 40%, #a07820 70%, #d4a830 100%)',
            borderRadius: 5,
            transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
            boxShadow: lightsOn
              ? '0 0 10px 3px rgba(248,200,40,0.7), 2px 2px 6px rgba(0,0,0,0.5)'
              : '1px 2px 5px rgba(0,0,0,0.6)',
          }} />

          {/* Handle knob at top */}
          <div style={{
            position: 'absolute',
            top: lightsOn ? 2 : 'auto',
            bottom: lightsOn ? 'auto' : 2,
            left: '50%',
            transform: `translateX(-50%) rotate(${lightsOn ? -28 : 28}deg)`,
            transformOrigin: `50% ${lightsOn ? '100%' : '0%'}`,
            width: 14, height: 14, borderRadius: '50%',
            background: 'radial-gradient(circle at 38% 35%, #fffde0 0%, #f0c830 40%, #a07020 100%)',
            boxShadow: lightsOn ? '0 0 8px 3px rgba(248,210,64,0.8)' : '0 2px 4px rgba(0,0,0,0.5)',
            border: '1.5px solid #7a5810',
            transition: 'box-shadow 0.5s ease',
          }} />

          {/* Center pivot */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            width: 12, height: 12,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 35%, #e8c040, #7a5010)',
            border: '2px solid #5a3c08',
            zIndex: 1,
          }} />
        </div>
      </div>

      {/* Status label */}
      <span style={{
        fontFamily: 'Georgia, serif',
        fontSize: '0.58rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        marginTop: 5,
        color: lightsOn ? '#a07828' : '#4a3510',
        textShadow: lightsOn ? '0 0 8px rgba(160,120,40,0.6)' : 'none',
        transition: 'color 0.5s, text-shadow 0.5s',
      }}>
        {lightsOn ? 'ON' : 'OFF'}
      </span>
    </div>
  )
}

export function HeaderCorner({ rot }) {
  return (
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: 44, height: 44, transform: `rotate(${rot}deg)`, display: 'block' }}>
      <path d="M4 40 L4 4 L40 4" stroke="#a07828" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M4 22 L15 11" stroke="#a07828" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.7"/>
      <path d="M4 32 L9 27" stroke="#a07828" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.45"/>
      <path d="M14 4 L22 4" stroke="#a07828" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.45"/>
      <circle cx="4" cy="4" r="3.2" fill="#d4aa28"/>
      <circle cx="22" cy="4" r="1.7" fill="#a07828" opacity="0.7"/>
      <circle cx="4" cy="22" r="1.7" fill="#a07828" opacity="0.7"/>
    </svg>
  )
}

/* Outer page wrapper with dark theater background */
export function TheaterBackground({ children }) {
  const { lightsOn } = useLights()
  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      background: `
        radial-gradient(ellipse at 8%  45%, rgba(110,65,8,0.85)  0%, transparent 38%),
        radial-gradient(ellipse at 92% 45%, rgba(90,50,5,0.85)   0%, transparent 38%),
        radial-gradient(ellipse at 50% 8%,  rgba(110,68,8,0.65)  0%, transparent 42%),
        radial-gradient(ellipse at 50% 95%, rgba(15,8,0,0.95)    0%, transparent 32%),
        radial-gradient(ellipse at 50% 50%, rgba(55,30,4,0.4)    0%, transparent 65%),
        #0a0602
      `,
    }}>
      {/* Darkness overlay — fades in when lights are off */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: '#000',
        opacity: lightsOn ? 0 : 0.93,
        transition: 'opacity 0.85s ease',
        pointerEvents: 'none',
      }} />
      {/* Content wrapper above overlay */}
      <div style={{
        position: 'relative', zIndex: 2,
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        {children}
      </div>
    </div>
  )
}
