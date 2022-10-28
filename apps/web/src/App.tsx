import { lazy, Suspense, useEffect, useState } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import LoadingPage from './pages/Loading'

import PublicLayout from './layouts/Public'
import HomePage from './pages/landing/Home'

const DashboardLayout = lazy(() => import('./layouts/Dashboard'))
const DashboardHomePage = lazy(() => import('./pages/dashboard/Home'))
const DashboardCalendarPage = lazy(() => import('./pages/dashboard/Calendar'))
const DashboardTasksPage = lazy(() => import('./pages/dashboard/Tasks'))
const DashboardNotesPage = lazy(() => import('./pages/dashboard/Notes'))
const DashboardNotesEditPage = lazy(() => import('./pages/dashboard/NotesEdit'))
const DashboardProfilePage = lazy(() => import('./pages/dashboard/Profile'))

import AuthLayout from './layouts/Auth'
import AuthLoginPage from './pages/auth/Login'
import AuthSignupPage from './pages/auth/Signup'

import NotFoundPage from './pages/NotFound'
import RequireAuth from './components/RequireAuth'
import ErrorPage from './pages/Error'

import { errorHandler, setAuth, trpc } from './utils'

const router = createBrowserRouter([
    {
        path: 'dashboard',
        element: (
            <RequireAuth>
                <DashboardLayout />
            </RequireAuth>
        ),
        errorElement: <ErrorPage />,
        children: [
            {
                path: '*',
                element: <NotFoundPage />
            },
            {
                path: '',
                element: <Navigate to="home" />
            },
            {
                path: 'home',
                element: <DashboardHomePage />
            },
            {
                path: 'calendar',
                element: <DashboardCalendarPage />
            },
            {
                path: 'tasks',
                element: <DashboardTasksPage />
            },
            {
                path: 'notes',
                element: <DashboardNotesPage />,
                children: [
                    {
                        path: ':note_id',
                        element: <DashboardNotesEditPage />
                    }
                ]
            },
            {
                path: 'profile',
                element: <DashboardProfilePage />
            }
        ]
    },
    {
        path: '/',
        element: <PublicLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '',
                element: <HomePage />
            }
        ]
    },
    {
        path: '/',
        element: <AuthLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'login',
                element: <AuthLoginPage />
            },
            {
                path: 'signup',
                element: <AuthSignupPage />
            }
        ]
    },
    {
        path: '*',
        element: <NotFoundPage />
    }
])

const App: React.FC = () => {
    const { mutate: authVerifyMutation } = trpc.auth.verify.useMutation()

    const [render, setRender] = useState(false)

    useEffect(() => {
        const token: string | undefined = localStorage.token

        if (token) {
            authVerifyMutation(null, {
                onError: (err) => {
                    errorHandler(err.message)
                    setAuth(null, null)
                    setRender(true)
                },
                onSuccess: (data) => {
                    const currentTime = Date.now() / 1000
                    if (data.exp < currentTime) {
                        setAuth(null, null)
                        setRender(true)
                        return
                    }
                    setAuth(token, data.user)
                    setRender(true)
                }
            })
        } else setRender(true)
    }, [])

    if (render)
        return (
            <Suspense fallback={<LoadingPage />}>
                <RouterProvider router={router} />
            </Suspense>
        )
    else return <LoadingPage />
}

export default App
