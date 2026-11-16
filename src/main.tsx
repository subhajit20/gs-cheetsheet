import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import '@fontsource-variable/inter'
import '@fontsource-variable/noto-sans-bengali'
import './styles.css'
import { Layout } from './components/Layout'
import { PrefsProvider } from './components/PrefsProvider'
import { HomePage } from './pages/HomePage'
import { NodePage } from './pages/NodePage'

const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: '*', element: <NodePage /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' },
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrefsProvider>
      <RouterProvider router={router} />
    </PrefsProvider>
  </StrictMode>,
)
