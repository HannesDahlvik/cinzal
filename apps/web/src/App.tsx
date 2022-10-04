import { useEffect, useState } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import LoadingPage from './pages/Loading'

import Home from './pages/Home'

import DashboardLayout from './layouts/Dashboard'
import DashboardHomePage from './pages/dashboard/Home'

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
            }
        ]
    },
    {
        path: '/',
        element: <Home />,
        errorElement: <ErrorPage />
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

    if (render) return <RouterProvider router={router} />
    else return <LoadingPage />
}

export default App
