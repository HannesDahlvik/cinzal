import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import Home from './pages/Home'

import DashboardLayout from './layouts/Dashboard'
import DashboardHomePage from './pages/dashboard/Home'
import NotFoundPage from './pages/NotFound'

const router = createBrowserRouter([
    {
        path: 'dashboard',
        element: <DashboardLayout />,
        errorElement: <NotFoundPage />,
        children: [
            {
                path: '',
                element: <Navigate to="home" />
            },
            {
                path: 'home',
                element: <DashboardHomePage />
            }
        ]
    },
    {
        path: '/',
        element: <Home />,
        errorElement: <NotFoundPage />
    }
])

const App: React.FC = () => {
    return <RouterProvider router={router} />
}

export default App
