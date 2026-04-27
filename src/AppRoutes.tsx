import { Routes, Route } from 'react-router-dom'
import HomePage       from './pages/HomePage'
import WorkPage       from './pages/WorkPage'
import WorkDetailPage from './pages/WorkDetailPage'
import LabPage        from './pages/LabPage'
import LabDetailPage  from './pages/LabDetailPage'
import AboutPage      from './pages/AboutPage'
import ContactPage    from './pages/ContactPage'
import NotFoundPage   from './pages/NotFoundPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/"          element={<HomePage />} />
      <Route path="/work"      element={<WorkPage />} />
      <Route path="/work/:id"  element={<WorkDetailPage />} />
      <Route path="/lab"       element={<LabPage />} />
      <Route path="/lab/:id"   element={<LabDetailPage />} />
      <Route path="/about"     element={<AboutPage />} />
      <Route path="/contact"   element={<ContactPage />} />
      <Route path="*"          element={<NotFoundPage />} />
    </Routes>
  )
}
