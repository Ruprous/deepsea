import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes'

function App() {
  return (
    <BrowserRouter basename="/summer-clouds">
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
