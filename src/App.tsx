import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import ScrollReset from './components/ScrollReset'

function App() {
  return (
    <BrowserRouter>
      <ScrollReset />
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
