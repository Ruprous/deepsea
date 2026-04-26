import { Link } from 'react-router-dom'

export default function HeroLeft() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '0',
        paddingTop: '64px',
        paddingBottom: '64px',
        minHeight: '100svh',
      }}
    >
      {/* ── グループ1：タグライン〜ラプラス ── */}
      <div style={{ borderLeft: '1px solid rgba(0, 119, 255, 0.3)', paddingLeft: '12px', marginBottom: '24px' }}>

      {/* ── ① タグ + タグライン（横並び） ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '2px' }}>
        {/* + Digital Creator */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '32px',
            letterSpacing: '0.04em',
            color: 'var(--color-accent)',
            fontFamily: 'var(--font-avenir)',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ color: 'var(--color-accent)', fontSize: '18px' }}>+</span>
          Digital Creator
        </span>

        {/* タグライン 3行 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            fontFamily: 'var(--font-smart)',
            fontSize: '10.5px',
            letterSpacing: '0.12em',
            color: 'rgba(255,255,255,0.30)',
          }}
        >
          <span>// CREATE WITH INSIGHT</span>
          <span>// DESIGN WITH TECHNOLOGY</span>
          <span>// MOVE THE CULTURE</span>
        </div>
      </div>

      {/* ── ② メインネーム ── */}
      <div style={{ marginBottom: '0' }}>
        <h1
          style={{
            fontFamily: 'var(--font-avenir)',
            fontSize: 'clamp(72px, 8.5vw, 120px)',
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            color: '#fff',
            margin: 0,
          }}
        >
          Ruprous
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-noto-serif)',
            fontSize: 'clamp(30px, 4vw, 56px)',
            color: 'var(--color-accent)',
            marginTop: '6px',
            letterSpacing: '-0.05em',
          }}
        >
          ラプラス
        </p>
      </div>
      </div>{/* グループ1 end */}

      {/* ── 中間テキスト ── */}
      <p
        style={{
          fontFamily: 'var(--font-smart)',
          fontSize: '10.5px',
          lineHeight: 1.8,
          letterSpacing: '0.12em',
          color: 'rgba(255,255,255,0.45)',
          maxWidth: '420px',
          marginTop: '80px',
          marginBottom: '40px',
          borderLeft: '1px solid rgba(0, 119, 255, 0.3)',
          paddingLeft: '12px',
        }}
      >
        I prioritize listening closely to my clients' visions—their "I want to achieve this!"—to ensure their ideas are expressed in a way that perfectly aligns with their goals. Through design and video, I deliver creative solutions that are both communicative and captivating.
      </p>

      {/* ── グループ2：バッジ〜CTA ── */}
      <div style={{ borderLeft: '1px solid rgba(0, 119, 255, 0.3)', paddingLeft: '12px' }}>

      {/* ── ⑤ CTAボタン ── */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
        <Link
          to="/work"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 20px',
            background: 'var(--color-accent)',
            color: '#fff',
            fontFamily: 'var(--font-smart)',
            fontSize: '11px',
            letterSpacing: '0.15em',
            textDecoration: 'none',
            borderRadius: '0px',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          VIEW WORKS <span style={{ fontSize: '13px' }}>↗</span>
        </Link>
        <Link
          to="/about"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 20px',
            background: 'transparent',
            color: 'rgba(255,255,255,0.65)',
            fontFamily: 'var(--font-smart)',
            fontSize: '11px',
            letterSpacing: '0.15em',
            textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '0px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#fff'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
          }}
        >
          ABOUT <span style={{ fontSize: '13px' }}>↗</span>
        </Link>
        <Link
          to="/contact"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 20px',
            background: 'transparent',
            color: 'rgba(255,255,255,0.65)',
            fontFamily: 'var(--font-smart)',
            fontSize: '11px',
            letterSpacing: '0.15em',
            textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '0px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#fff'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
          }}
        >
          CONTACT <span style={{ fontSize: '13px' }}>↗</span>
        </Link>
      </div>

      {/* ── ④ プロフィールバッジ ── */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '14px',
          background: 'var(--color-ui-dim)',
          border: '1px solid rgba(0, 119, 255, 0.2)',
          borderRadius: '0px',
          padding: '12px 17px',
          width: 'fit-content',
        }}
      >
        <img
          src="/images/icon.png"
          alt="Ruprous"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '1px solid rgba(0,119,255,0.5)',
            flexShrink: 0,
          }}
        />
        <div>
          <p style={{ fontFamily: 'var(--font-smart)', fontSize: '12px', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.85)', marginBottom: '2px' }}>
            Freelance — Ruprous Studio
          </p>
          <p style={{ fontFamily: 'var(--font-smart)', fontSize: '11px', letterSpacing: '0.12em', color: 'var(--color-dim)' }}>
            KANAGAWA, JAPAN
          </p>
        </div>
      </div>
      </div>{/* グループ2 end */}
    </div>
  )
}
