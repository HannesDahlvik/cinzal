import { lazy, Suspense, useEffect, useState } from 'react'

import Providers from './Providers'

import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import LoadingPage from './pages/Loading'

import Home from './pages/Home'

const DashboardLayout = lazy(() => import('./layouts/Dashboard'))
const DashboardHomePage = lazy(() => import('./pages/dashboard/Home'))
const DashboardProfilePage = lazy(() => import('./pages/dashboard/Profile'))

const AuthLayout = lazy(() => import('./layouts/Auth'))
const AuthLoginPage = lazy(() => import('./pages/auth/Login'))
const AuthSignupPage = lazy(() => import('./pages/auth/Signup'))

const NotFoundPage = lazy(() => import('./pages/NotFound'))
const RequireAuth = lazy(() => import('./components/RequireAuth'))
const ErrorPage = lazy(() => import('./pages/Error'))

import { errorHandler, setAuth, trpc } from './utils'

import dayjs from 'dayjs'
import localeData from 'dayjs/plugin/localeData'
import en from 'dayjs/locale/en'

dayjs.locale({
    ...en
})
dayjs.extend(localeData)

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
                path: 'profile',
                element: <DashboardProfilePage />
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

    if (render)
        return (
            <Suspense fallback={<LoadingPage />}>
                <RouterProvider router={router} />
            </Suspense>
        )
    else return <LoadingPage />
}

const Interface: React.FC = () => {
    return (
        <Providers>
            <App />
        </Providers>
    )
}

export default Interface
