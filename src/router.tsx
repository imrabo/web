import { createBrowserRouter, Navigate, Outlet } from "react-router-dom"

import AppLayout from "./components/layouts/app-layout"

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
import ProfilePage from "./features/users/pages/ProfilePage"
import ChatPage from "./features/messages/pages/ChatPage"

// =====================================================
// ROOT PAGE
// =====================================================

function RootPage() {
  const { isAuthenticated, isLoading } = useAuth()

  // ---------------------------------------------------
  // Wait for authentication initialization
  // ---------------------------------------------------

  if (isLoading) {
    return null
  }

  // ---------------------------------------------------
  // Authenticated user
  // ---------------------------------------------------

  if (isAuthenticated) {
    return <Navigate to="/chat" replace />
  }

  // ---------------------------------------------------
  // Public user
  // ---------------------------------------------------

  return <HomePage />
}

// =====================================================
// PROTECTED ROUTE
// =====================================================

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  // ---------------------------------------------------
  // Authentication is still being initialized
  // ---------------------------------------------------

  if (isLoading) {
    return null
  }

  // ---------------------------------------------------
  // User is not authenticated
  // ---------------------------------------------------

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // ---------------------------------------------------
  // User is authenticated
  // ---------------------------------------------------

  return <Outlet />
}

// =====================================================
// AUTHENTICATED LAYOUT
// =====================================================

function DashboardLayout() {
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
  // PRICING
  // ===================================================

  {
    path: "/pricing",
    element: <PricingPage />,
  },

  // ===================================================
  // PROTECTED APPLICATION
  // ===================================================

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <DashboardLayout />,
        children: [
          // -------------------------------------------
          // /
          // -------------------------------------------

          {
            index: true,
            element: <ChatPage />,
          },
          // -------------------------------------------
          // /dashboard
          // -------------------------------------------

          {
            path: ":username",
            element: <ProfilePage />,
          },

          // -------------------------------------------
          // /graph
          // -------------------------------------------

          {
            path: "graph",
            element: <GraphPage />,
          },

          // -------------------------------------------
          // /connectors
          // -------------------------------------------

          {
            path: "connectors",
            element: <ConnectorsPage />,
          },
        ],
      },
    ],
  },
])
