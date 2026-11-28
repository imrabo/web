import { lazy, Suspense } from "react"
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom"

import AppLayout from "./components/layouts/app-layout"
import LoginPage from "./features/auth/pages/LoginPage"
import SignupPage from "./features/auth/pages/SignupPage"
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage"
import { useAuth } from "./features/auth/hooks/useAuth"

const ChatPage = lazy(() => import("./features/chat/pages/ChatPage"))
const GraphPage = lazy(() => import("./features/graph/pages/GraphPage"))
const PricingPage = lazy(() => import("./features/payments/pages/PricingPage"))
const ConnectorsPage = lazy(() =>
  import("./features/connectors").then((module) => ({ default: module.ConnectorsPage }))
)

function PageLoader() {
  return <div className="flex min-h-[50vh] items-center justify-center text-sm text-white/50">Loading workspace…</div>
}

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

function RootPage() {
  return <Navigate to="/chat" replace />
}

function GuestOnlyRoute() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/chat" replace /> : <Outlet />
}

function AccountRoute() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Outlet /> : <Navigate to="/chat" replace />
}

export const router = createBrowserRouter(
  [
    { path: "/", element: <RootPage /> },
    {
      element: <GuestOnlyRoute />,
      children: [
        { path: "login", element: <LoginPage /> },
        { path: "signup", element: <SignupPage /> },
        { path: "forgot-password", element: <ForgotPasswordPage /> },
      ],
    },
    {
      element: <AppLayout />,
      children: [
        { path: "chat", element: <LazyPage><ChatPage /></LazyPage> },
        { path: "workspace", element: <Navigate to="/chat" replace /> },
        { path: "graph", element: <LazyPage><GraphPage /></LazyPage> },
        { path: "pricing", element: <LazyPage><PricingPage /></LazyPage> },
      ],
    },
    {
      element: <AccountRoute />,
      children: [
        {
          element: <AppLayout />,
          children: [
            { path: "connectors", element: <LazyPage><ConnectorsPage /></LazyPage> },
          ],
        },
      ],
    },
    { path: "*", element: <Navigate to="/" replace /> },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, "") || "/" }
)
