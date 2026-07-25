import { createBrowserRouter } from "react-router-dom"
import AppLayout from "./components/layouts/app-layout"
import ChatPage from "./features/chat/pages/ChatPage"
import GraphPage from "./features/graph/pages/GraphPage"
import AuthPage from "./features/auth/pages/login"

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
