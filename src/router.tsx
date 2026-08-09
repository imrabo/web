import { createBrowserRouter } from "react-router-dom"
import AppLayout from "./components/layouts/app-layout"
import ChatPage from "./features/chat/pages/ChatPage"
import GraphPage from "./features/graph/pages/GraphPage"
<<<<<<< Updated upstream
import AuthPage from "./features/auth/pages/login"
=======

import DocsPage from "./pages/DocsPage"

import LoginPage from "./features/auth/pages/LoginPage"
import SignupPage from "./features/auth/pages/SignupPage"

import HomePage from "./pages/home"

import TermsPage from "./pages/TermsPage"
import PrivacyPage from "./pages/PrivacyPage"
import RefundPolicyPage from "./pages/RefundPolicyPage"

import { ConnectorsPage } from "./features/connectors"
import HttpPage from "./pages/docs/HttpPage"
import WebHookPage from "./pages/docs/WebHookPage"
import McpPage from "./pages/docs/McpPage"

import PricingPage from "./features/payments/pages/PricingPage"
import { useAuth } from "./features/auth/hooks/useAuth"

// =====================================================
// ROOT PAGE
// =====================================================

function RootPage() {
  const { user: currentUser } = useAuth()
  const isAuthenticated = !!currentUser

  // User is logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  // User is not logged in
  return <HomePage /> // Make sure to import HomePage at the top
}

// =====================================================
// PROTECTED ROUTE
// =====================================================

function ProtectedRoute() {
  const { user: currentUser } = useAuth()
  const isAuthenticated = !!currentUser

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Logged in
  return <AppLayout />
}

// =====================================================
// ROUTER
// =====================================================
>>>>>>> Stashed changes

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <ChatPage />,
      },
      {
        path: "graph",
        element: <GraphPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <AuthPage />,
  },
])
