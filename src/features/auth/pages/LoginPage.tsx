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

export default function LoginPage() {
  const [username, setUsername] = React.useState("")
  const [password, setPassword] = React.useState("")

  const loginMutation = useLoginMutation()

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    loginMutation.mutate({
      username,
      password,
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>

          <CardDescription>Login to your account</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="username">Username</Label>

              <Input
                id="username"
                type="text"
                placeholder="your username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                disabled={loginMutation.isPending}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>

              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={loginMutation.isPending}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
