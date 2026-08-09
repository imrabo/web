"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useLoginMutation } from "@/features/auth/hooks/useAuthQuery"

// Adjust this import path to your actual hook file.

export default function LoginPage() {
  // ============================================================
  // Login Form State
  // ============================================================

  const [loginEmail, setLoginEmail] = React.useState("")
  const [loginPassword, setLoginPassword] = React.useState("")

  const loginMutation = useLoginMutation()

  // ============================================================
  // Login
  // ============================================================

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    loginMutation.mutate({
      email: loginEmail,
      password: loginPassword,
    })
  }

  // ============================================================
  // Loading State
  // ============================================================

  const isLoginLoading = loginMutation.isPending

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>

          <CardDescription>Login or create a new account</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.target.value)}
                disabled={isLoginLoading}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>

              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                disabled={isLoginLoading}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoginLoading}>
              {isLoginLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
