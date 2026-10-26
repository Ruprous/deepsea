import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import ScrollReset from './components/ScrollReset'
import PageWipe from './components/PageWipe'

function App() {
  return (
    <BrowserRouter>
      <ScrollReset />
      <PageWipe />
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
