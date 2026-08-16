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

import { useRegisterMutation } from "@/features/auth/hooks/useAuthQuery"

export default function SignupPage() {
  const [first_name, setFirstName] = React.useState("")
  const [last_name, setLastName] = React.useState("")
  const [username, setUsername] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [phoneNumber, setPhoneNumber] = React.useState("")

  const registerMutation = useRegisterMutation()

  const handleSignup = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (password !== confirmPassword) {
      return
    }

    registerMutation.mutate({
      first_name,
      last_name,
      username,
      email,
      password,
      phone_number: phoneNumber,
    })
  }

  const passwordsDoNotMatch =
    confirmPassword.length > 0 && password !== confirmPassword

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create an account</CardTitle>

          <CardDescription>
            Enter your details to create your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignup} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="first_name">First Name</Label>

              <Input
                id="first_name"
                type="text"
                placeholder="John"
                value={first_name}
                onChange={(event) => setFirstName(event.target.value)}
                disabled={registerMutation.isPending}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="last_name">Last Name</Label>

              <Input
                id="last_name"
                type="text"
                placeholder="Doe"
                value={last_name}
                onChange={(event) => setLastName(event.target.value)}
                disabled={registerMutation.isPending}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="username">Username</Label>

              <Input
                id="username"
                type="text"
                placeholder="johndoe"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                disabled={registerMutation.isPending}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={registerMutation.isPending}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>

              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+1234567890"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                disabled={registerMutation.isPending}
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
                disabled={registerMutation.isPending}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>

              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                disabled={registerMutation.isPending}
                required
              />

              {passwordsDoNotMatch && (
                <p className="text-sm text-destructive">
                  Passwords do not match.
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending || passwordsDoNotMatch}
            >
              {registerMutation.isPending
                ? "Creating account..."
                : "Create Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
