
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default function LoginPage() {
  const [loginEmail, setLoginEmail] = React.useState("")
  const [loginPassword, setLoginPassword] = React.useState("")

  const [name, setName] = React.useState("")
  const [registerEmail, setRegisterEmail] = React.useState("")
  const [registerPassword, setRegisterPassword] =
    React.useState("")
  const [confirmPassword, setConfirmPassword] =
    React.useState("")

  function handleLogin(event: React.FormEvent) {
    event.preventDefault()

    // TODO: connect login API
    console.log({
      email: loginEmail,
      password: loginPassword,
    })
  }

  function handleRegister(event: React.FormEvent) {
    event.preventDefault()

    // TODO: connect register API
    console.log({
      name,
      email: registerEmail,
      password: registerPassword,
      confirmPassword,
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Welcome
          </CardTitle>

          <CardDescription>
            Login or create a new account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">
                Login
              </TabsTrigger>

              <TabsTrigger value="register">
                Register
              </TabsTrigger>
            </TabsList>

            {/* LOGIN */}
            <TabsContent value="login" className="mt-6">
              <form
                onSubmit={handleLogin}
                className="flex flex-col gap-5"
              >
                <div className="flex flex-col gap-2">
                  <Label htmlFor="login-email">
                    Email
                  </Label>

                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(event) =>
                      setLoginEmail(event.target.value)
                    }
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="login-password">
                    Password
                  </Label>

                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(event) =>
                      setLoginPassword(event.target.value)
                    }
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </TabsContent>

            {/* REGISTER */}
            <TabsContent
              value="register"
              className="mt-6"
            >
              <form
                onSubmit={handleRegister}
                className="flex flex-col gap-5"
              >
                <div className="flex flex-col gap-2">
                  <Label htmlFor="register-name">
                    Name
                  </Label>

                  <Input
                    id="register-name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="register-email">
                    Email
                  </Label>

                  <Input
                    id="register-email"
                    type="email"
                    placeholder="you@example.com"
                    value={registerEmail}
                    onChange={(event) =>
                      setRegisterEmail(event.target.value)
                    }
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="register-password">
                    Password
                  </Label>

                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={registerPassword}
                    onChange={(event) =>
                      setRegisterPassword(event.target.value)
                    }
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="confirm-password">
                    Confirm Password
                  </Label>

                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

