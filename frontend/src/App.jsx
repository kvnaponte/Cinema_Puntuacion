import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CatalogPage from './pages/CatalogPage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import { LightsProvider } from './LightsContext.jsx'

export default function App() {
  return (
    <LightsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"          element={<LandingPage />} />
          <Route path="/catalogo"  element={<CatalogPage />} />
          <Route path="/pendientes" element={<CatalogPage onlyPending />} />
        </Routes>
      </BrowserRouter>
    </LightsProvider>
  )
}
