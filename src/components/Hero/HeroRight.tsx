const borderStyle = '1px solid rgba(0, 119, 255, 0.3)'
const groupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  paddingRight: '12px',
  borderRight: borderStyle,
  fontFamily: 'var(--font-smart)',
  gap: '8px',
}

export default function HeroRight() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
        minHeight: '100svh',
        paddingTop: '80px',
        paddingBottom: '64px',
        gap: '36px',
      }}
    >
      {/* ── グループ1：ACTIVE SINCE + TIMEZONE ── */}
      <div style={groupStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <span style={{ fontSize: '9px', letterSpacing: '0.2em', color: 'var(--color-dim)' }}>ACTIVE SINCE</span>
          <span style={{ fontSize: '12px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)' }}>2018</span>
        </div>
        <div style={{ width: '40px', height: '1px', background: 'rgba(0, 119, 255, 0.25)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <span style={{ fontSize: '9px', letterSpacing: '0.2em', color: 'var(--color-dim)' }}>TIMEZONE</span>
          <span style={{ fontSize: '12px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)' }}>JST UTC+9</span>
        </div>
      </div>

      {/* ── グループ2：プロフィールテキスト ── */}
      <div style={{ ...groupStyle, textAlign: 'right', maxWidth: '220px' }}>
        <p style={{ fontSize: '10px', letterSpacing: '0.03em', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8 }}>
          I began my journey as a self-taught graphic designer in October 2018. Since then, I have been involved in a wide range of creative productions.
        </p>
        <p style={{ fontSize: '10px', letterSpacing: '0.03em', color: 'rgba(255,255,255,0.55)', lineHeight: 1.8 }}>
          I am [ləplάːs]. Can't read it? Well, you're going to.
        </p>
      </div>

      {/* ── グループ3：座標 + DEPTH + PRESSURE ── */}
      <div style={groupStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <span style={{ fontSize: '12px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.7)' }}>48°52′5″S</span>
          <span style={{ fontSize: '12px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.7)' }}>123°23′6″W</span>
        </div>
        <div style={{ width: '40px', height: '1px', background: 'rgba(0, 119, 255, 0.25)' }} />
        {[
          { label: 'DEPTH',    value: '> 10,000m' },
          { label: 'PRESSURE', value: '> 1,000atm' },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '9px', letterSpacing: '0.2em', color: 'var(--color-dim)' }}>{label}</span>
            <span style={{ fontSize: '12px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)' }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
