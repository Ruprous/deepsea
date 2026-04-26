import Header        from '../components/layout/Header'
import HeroSection   from '../components/Hero/HeroSection'
import DesignTicker  from '../components/layout/DesignTicker'
import Footer        from '../components/layout/Footer'

export default function HomePage() {
  return (
    <main className="bg-bg">
      <Header />
      <div style={{ position: 'relative' }}>
        <HeroSection />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20 }}>
          <DesignTicker />
          <Footer />
        </div>
      </div>
    </main>
  )
}
