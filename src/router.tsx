import { lazy, Suspense } from "react"
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom"

import AppLayout from "./components/layouts/app-layout"

import LoginPage from "./features/auth/pages/LoginPage"
import SignupPage from "./features/auth/pages/SignupPage"

import { useAuth } from "./features/auth/hooks/useAuth"

const ChatPage = lazy(() => import("./features/chat/pages/ChatPage"))

const GraphPage = lazy(() => import("./features/graph/pages/GraphPage"))

const PricingPage = lazy(() => import("./features/payments/pages/PricingPage"))

const ConnectorsPage = lazy(() =>
  import("./features/connectors").then((module) => ({
    default: module.ConnectorsPage,
  }))
)

function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      Loading...
    </div>
  )
}

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

function RootPage() {
  const { isAuthenticated } = useAuth()

  return <Navigate to={isAuthenticated ? "/chat" : "/login"} replace />
}

function GuestRoute() {
  const { isAuthenticated } = useAuth()

  return isAuthenticated ? <Navigate to="/chat" replace /> : <Outlet />
}

function ProtectedRoute() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <AppLayout />
}

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootPage />,
    },
    {
      element: <GuestRoute />,
      children: [
        { path: "login", element: <LoginPage /> },
        { path: "signup", element: <SignupPage /> },
      ],
    },
    {
      path: "pricing",
      element: (
        <LazyPage>
          <PricingPage />
        </LazyPage>
      ),
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: "chat",
          element: (
            <LazyPage>
              <ChatPage />
            </LazyPage>
          ),
        },
        {
          path: "graph",
          element: (
            <LazyPage>
              <GraphPage />
            </LazyPage>
          ),
        },
        {
          path: "connectors",
          element: (
            <LazyPage>
              <ConnectorsPage />
            </LazyPage>
          ),
        },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ],
  {
    basename: import.meta.env.BASE_URL.replace(/\/$/, "") || "/",
  }
)
