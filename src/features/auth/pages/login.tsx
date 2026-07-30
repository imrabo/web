"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react"

// ---------------------------------------------------------------------------
// Backend integration points — replace these with real API calls.
// ---------------------------------------------------------------------------
async function requestOtp(
  _email: string
): Promise<{ ok: boolean; message?: string }> {
  // TODO: POST /auth/otp/request { email }
  await new Promise((r) => setTimeout(r, 900))
  return { ok: true }
}

// ---------------------------------------------------------------------------

type Step = "identity" | "otp" | "success"

const RESEND_COOLDOWN = 30 // seconds

function useResendTimer(active: boolean) {
  const [secondsLeft, setSecondsLeft] = React.useState(0)

  React.useEffect(() => {
    if (!active) return
    setSecondsLeft(RESEND_COOLDOWN)
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [active])

  return secondsLeft
}

function OtpStep({
  email,
  onBack,
  resendKey,
}: {
  email: string
  onBack: () => void
  onVerified: () => void
  resendKey: number
}) {
  const [otp, setOtp] = React.useState("")
  const [loading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [resending, setResending] = React.useState(false)
  const secondsLeft = useResendTimer(true)

  // reset OTP field whenever a fresh code is requested
  React.useEffect(() => {
    setOtp("")
    setError(null)
  }, [resendKey])

  async function handleResend() {
    setResending(true)
    await requestOtp(email)
    setResending(false)
  }

  return (
    <div className="flex flex-col gap-5">
      <button
        onClick={onBack}
        className="flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Change email
      </button>

      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">
          We sent a 6-digit code to
        </p>
        <p className="text-sm font-medium">{email}</p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <Button
        onClick={() => {}}
        disabled={otp.length !== 6 || loading}
        className="w-full"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Verify
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        Didn't get the code?{" "}
        {secondsLeft > 0 ? (
          <span>Resend in {secondsLeft}s</span>
        ) : (
          <button
            onClick={handleResend}
            disabled={resending}
            className="font-medium text-foreground underline underline-offset-4 disabled:opacity-50"
          >
            {resending ? "Sending..." : "Resend code"}
          </button>
        )}
      </div>
    </div>
  )
}

function SuccessStep({ mode }: { mode: "login" | "signup" }) {
  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <CheckCircle2 className="h-10 w-10 text-green-500" />
      <p className="font-medium">
        {mode === "login" ? "You're logged in" : "Account created"}
      </p>
      <p className="text-sm text-muted-foreground">Redirecting you now...</p>
    </div>
  )
}

function LoginTab() {
  const [step, setStep] = React.useState<Step>("identity")
  const [email, setEmail] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [resendKey, setResendKey] = React.useState(0)

  async function handleSendOtp() {
    setError(null)
    if (!email.includes("@")) {
      setError("Enter a valid email address.")
      return
    }
    setLoading(true)
    const res = await requestOtp(email)
    setLoading(false)
    if (res.ok) {
      setResendKey((k) => k + 1)
      setStep("otp")
    } else {
      setError(res.message ?? "Couldn't send code. Try again.")
    }
  }

  if (step === "success") return <SuccessStep mode="login" />

  if (step === "otp") {
    return (
      <OtpStep
        email={email}
        onBack={() => setStep("identity")}
        onVerified={() => setStep("success")}
        resendKey={resendKey}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <Button onClick={handleSendOtp} disabled={loading} className="w-full">
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Mail className="mr-2 h-4 w-4" />
        )}
        Send code
      </Button>
    </div>
  )
}

function SignupTab() {
  const [step, setStep] = React.useState<Step>("identity")
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [resendKey, setResendKey] = React.useState(0)

  async function handleSendOtp() {
    setError(null)
    if (!name.trim()) {
      setError("Enter your name.")
      return
    }
    if (!email.includes("@")) {
      setError("Enter a valid email address.")
      return
    }
    setLoading(true)
    const res = await requestOtp(email)
    setLoading(false)
    if (res.ok) {
      setResendKey((k) => k + 1)
      setStep("otp")
    } else {
      setError(res.message ?? "Couldn't send code. Try again.")
    }
  }

  async function handleVerified() {
    setStep("success")
  }

  if (step === "success") return <SuccessStep mode="signup" />

  if (step === "otp") {
    return (
      <OtpStep
        email={email}
        onBack={() => setStep("identity")}
        onVerified={handleVerified}
        resendKey={resendKey}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="signup-name">Name</Label>
        <Input
          id="signup-name"
          placeholder="Jane Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <Button onClick={handleSendOtp} disabled={loading} className="w-full">
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Mail className="mr-2 h-4 w-4" />
        )}
        Send code
      </Button>
    </div>
  )
}

export default function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm border-border/60">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-xl">Welcome</CardTitle>
          <CardDescription>
            Sign in or create an account with a one-time code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger value="login">Log in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <LoginTab />
            </TabsContent>
            <TabsContent value="signup">
              <SignupTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
