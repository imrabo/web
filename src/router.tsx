import { createBrowserRouter, Navigate } from "react-router-dom"

import AppLayout from "./components/layouts/app-layout"

import ChatPage from "./features/chat/pages/ChatPage"
import GraphPage from "./features/graph/pages/GraphPage"

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

import { useAuth } from "./features/auth/hooks/useAuth"
import PricingPage from "./features/payments/pages/PricingPage"

// =====================================================
// ROOT PAGE
// =====================================================

function RootPage() {
  const { isAuthenticated } = useAuth()

  // User is logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  // User is not logged in
  return <HomePage />
}

// =====================================================
// PROTECTED ROUTE
// =====================================================

function ProtectedRoute() {
  const { isAuthenticated } = useAuth()

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

export const router = createBrowserRouter([
  // ===================================================
  // HOME
  // ===================================================

  {
    path: "/",
    element: <RootPage />,
  },

  // ===================================================
  // AUTH
  // ===================================================

  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/signup",
    element: <SignupPage />,
  },

  // ===================================================
  // LEGAL PAGES
  // ===================================================

  {
    path: "/terms",
    element: <TermsPage />,
  },

  {
    path: "/privacy",
    element: <PrivacyPage />,
  },

  {
    path: "/refund-policy",
    element: <RefundPolicyPage />,
  },

  // ===================================================
  // DOCUMENTATION
  // ===================================================

  {
    path: "/docs",
    children: [
      {
        index: true,
        element: <DocsPage />,
      },

      {
        path: "connectors",
        element: <ConnectorsPage />,
      },

      {
        path: "http",
        element: <HttpPage />,
      },

      {
        path: "mcp",
        element: <McpPage />,
      },

      {
        path: "webhooks",
        element: <WebHookPage />,
      },
    ],
  },

  // ===================================================
  // PROTECTED DASHBOARD
  // ===================================================

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <ChatPage />,
      },

      {
        path: "/graph",
        element: <GraphPage />,
      },
    ],
  },
  {
    path: "/pricing",
    element: <PricingPage />,
  },
])
