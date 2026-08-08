import { createContext, useEffect, useMemo, type ReactNode } from "react"

import type { UserType } from "@/features/users"
import { authService } from "@/features/auth/services/authService"
import { useAuthStore } from "@/lib/store/authStore"

// =====================================================
// AUTH CONTEXT TYPE
// =====================================================

export interface AuthContextType {
  user: UserType | null
  isAuthenticated: boolean
  isLoading: boolean

  login: (email: string, password: string) => Promise<UserType>

  logout: () => Promise<void>

  refreshUser: () => Promise<void>
}

// =====================================================
// CONTEXT
// =====================================================

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// =====================================================
// PROVIDER PROPS
// =====================================================

interface AuthProviderProps {
  children: ReactNode
}

// =====================================================
// AUTH PROVIDER
// =====================================================

export function AuthProvider({ children }: AuthProviderProps) {
  const { user, isLoading, setUser, setLoading } = useAuthStore()

  // ---------------------------------------------------
  // Initialize authentication
  // ---------------------------------------------------

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      setLoading(true)

      try {
        const currentUser = await authService.getCurrentUser()

        if (mounted) {
          setUser(currentUser)
        }
      } catch {
        if (mounted) {
          setUser(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    return () => {
      mounted = false
    }
  }, [setLoading, setUser])

  // ---------------------------------------------------
  // Login
  // ---------------------------------------------------

  const login = async (email: string, password: string): Promise<UserType> => {
    setLoading(true)

    try {
      const loggedInUser = await authService.login({
        email,
        password,
      })

      setUser(loggedInUser.user)

      return loggedInUser.user
    } catch (error) {
      setUser(null)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // ---------------------------------------------------
  // Logout
  // ---------------------------------------------------

  const logout = async (): Promise<void> => {
    setLoading(true)

    try {
      await authService.logout()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // ---------------------------------------------------
  // Refresh current user
  // ---------------------------------------------------

  const refreshUser = async (): Promise<void> => {
    try {
      const currentUser = await authService.getCurrentUser()

      setUser(currentUser)
    } catch {
      setUser(null)
    }
  }

  // ---------------------------------------------------
  // Authentication state
  // ---------------------------------------------------

  const isAuthenticated = Boolean(user)

  // ---------------------------------------------------
  // Context value
  // ---------------------------------------------------

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
      refreshUser,
    }),
    [user, isAuthenticated, isLoading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
