"use client"

import * as React from "react"
import {
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  KeyRound,
  Save,
  Eye,
  EyeOff,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useAuth } from "@/features/auth/hooks/useAuth"

export interface UserType {
  id: number
  first_name: string
  last_name: string
  username: string
  email: string
  phone_number?: string | null
  password_hash?: string
  created_by?: string | null
  updated_by?: string | null
  created_at: string
  updated_at: string
}

export interface UserUpdateData {
  first_name?: string
  last_name?: string
  username?: string
  email?: string
  phone_number?: string | null
  password?: string
}

type SettingsSection = "profile" | "security" | "account"

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeSection, setActiveSection] =
    React.useState<SettingsSection>("profile")

  const [firstName, setFirstName] = React.useState(user?.first_name ?? "")
  const [lastName, setLastName] = React.useState(user?.last_name ?? "")
  const [username, setUsername] = React.useState(user?.username ?? "")
  const [email, setEmail] = React.useState(user?.email ?? "")
  const [phone, setPhone] = React.useState(user?.phone_number ?? "")

  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")

  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false)
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

  const [saving, setSaving] = React.useState(false)
  const [saved, setSaved] = React.useState(false)

  const handleProfileSave = async () => {
    setSaving(true)
    setSaved(false)

    try {
      //   await onSave?.({
      //     first_name: firstName,
      //     last_name: lastName,
      //     username,
      //     email,
      //     phone_number: phone || null,
      //   })

      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSave = async () => {
    if (!newPassword) return

    if (newPassword !== confirmPassword) {
      return
    }

    setSaving(true)
    setSaved(false)

    try {
      await onSave?.({
        password: newPassword,
      })

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  const sections = [
    {
      id: "profile" as const,
      label: "Profile",
      description: "Your personal information",
      icon: User,
    },
    {
      id: "security" as const,
      label: "Security",
      description: "Password and security",
      icon: Shield,
    },
    {
      id: "account" as const,
      label: "Account",
      description: "Account information",
      icon: KeyRound,
    },
  ]

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Page Header */}
      <div className="shrink-0 border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your account and personal preferences.
            </p>
          </div>

          {saved && <div className="text-sm text-green-600">Changes saved</div>}
        </div>
      </div>

      {/* Settings Content */}
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="mx-auto flex max-w-6xl gap-8 px-6 py-8">
          {/* Settings Navigation */}
          <aside className="w-56 shrink-0 border-r">
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon
                const active = activeSection === section.id

                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                      active
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    <Icon className="mt-0.5 h-4 w-4 shrink-0" />

                    <div className="min-w-0">
                      <div className="text-sm font-medium">{section.label}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {section.description}
                      </div>
                    </div>
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* Settings Panel */}
          <div className="max-w-2xl min-w-0 flex-1">
            {activeSection === "profile" && (
              <ProfileSettings
                firstName={firstName}
                lastName={lastName}
                username={username}
                email={email}
                phone={phone}
                setFirstName={setFirstName}
                setLastName={setLastName}
                setUsername={setUsername}
                setEmail={setEmail}
                setPhone={setPhone}
                saving={saving}
                onSave={handleProfileSave}
              />
            )}

            {activeSection === "security" && (
              <SecuritySettings
                currentPassword={currentPassword}
                newPassword={newPassword}
                confirmPassword={confirmPassword}
                setCurrentPassword={setCurrentPassword}
                setNewPassword={setNewPassword}
                setConfirmPassword={setConfirmPassword}
                showCurrentPassword={showCurrentPassword}
                showNewPassword={showNewPassword}
                showConfirmPassword={showConfirmPassword}
                setShowCurrentPassword={setShowCurrentPassword}
                setShowNewPassword={setShowNewPassword}
                setShowConfirmPassword={setShowConfirmPassword}
                saving={saving}
                onSave={handlePasswordSave}
              />
            )}

            {activeSection === "account" && <AccountSettings user={user} />}
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Profile                                                                    */
/* -------------------------------------------------------------------------- */

interface ProfileSettingsProps {
  firstName: string
  lastName: string
  username: string
  email: string
  phone: string

  setFirstName: (value: string) => void
  setLastName: (value: string) => void
  setUsername: (value: string) => void
  setEmail: (value: string) => void
  setPhone: (value: string) => void

  saving: boolean
  onSave: () => void
}

function ProfileSettings({
  firstName,
  lastName,
  username,
  email,
  phone,
  setFirstName,
  setLastName,
  setUsername,
  setEmail,
  setPhone,
  saving,
  onSave,
}: ProfileSettingsProps) {
  return (
    <section>
      <div>
        <h2 className="text-lg font-semibold">Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Update your personal information and contact details.
        </p>
      </div>

      <Separator className="my-6" />

      {/* Avatar */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-lg font-semibold">
          {firstName?.[0]}
          {lastName?.[0]}
        </div>

        <div>
          <div className="font-medium">
            {firstName} {lastName}
          </div>
          <div className="text-sm text-muted-foreground">@{username}</div>
        </div>
      </div>

      {/* Name */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="first_name">First name</Label>

          <div className="relative">
            <User className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />

            <Input
              id="first_name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="pl-9"
              placeholder="John"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">Last name</Label>

          <Input
            id="last_name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
          />
        </div>
      </div>

      {/* Username */}
      <div className="mt-5 space-y-2">
        <Label htmlFor="username">Username</Label>

        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="johndoe"
        />

        <p className="text-xs text-muted-foreground">
          Your username is used to identify your account.
        </p>
      </div>

      {/* Email */}
      <div className="mt-5 space-y-2">
        <Label htmlFor="email">Email address</Label>

        <div className="relative">
          <Mail className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />

          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-9"
            placeholder="john@example.com"
          />
        </div>
      </div>

      {/* Phone */}
      <div className="mt-5 space-y-2">
        <Label htmlFor="phone">Phone number</Label>

        <div className="relative">
          <Phone className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />

          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="pl-9"
            placeholder="+1 555 123 4567"
          />
        </div>
      </div>

      {/* Save */}
      <div className="mt-8 flex justify-end">
        <Button onClick={onSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Security                                                                   */
/* -------------------------------------------------------------------------- */

interface SecuritySettingsProps {
  currentPassword: string
  newPassword: string
  confirmPassword: string

  setCurrentPassword: (value: string) => void
  setNewPassword: (value: string) => void
  setConfirmPassword: (value: string) => void

  showCurrentPassword: boolean
  showNewPassword: boolean
  showConfirmPassword: boolean

  setShowCurrentPassword: (value: boolean) => void
  setShowNewPassword: (value: boolean) => void
  setShowConfirmPassword: (value: boolean) => void

  saving: boolean
  onSave: () => void
}

function SecuritySettings({
  currentPassword,
  newPassword,
  confirmPassword,
  setCurrentPassword,
  setNewPassword,
  setConfirmPassword,
  showCurrentPassword,
  showNewPassword,
  showConfirmPassword,
  setShowCurrentPassword,
  setShowNewPassword,
  setShowConfirmPassword,
  saving,
  onSave,
}: SecuritySettingsProps) {
  const passwordMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword

  return (
    <section>
      <div>
        <h2 className="text-lg font-semibold">Security</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Keep your account secure by using a strong password.
        </p>
      </div>

      <Separator className="my-6" />

      <div className="rounded-lg border p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-muted p-2">
            <Lock className="h-4 w-4" />
          </div>

          <div>
            <h3 className="text-sm font-medium">Change password</h3>

            <p className="mt-1 text-xs text-muted-foreground">
              Choose a strong password that you don't use elsewhere.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          <PasswordInput
            id="current_password"
            label="Current password"
            value={currentPassword}
            visible={showCurrentPassword}
            onChange={setCurrentPassword}
            onToggle={() => setShowCurrentPassword(!showCurrentPassword)}
          />

          <PasswordInput
            id="new_password"
            label="New password"
            value={newPassword}
            visible={showNewPassword}
            onChange={setNewPassword}
            onToggle={() => setShowNewPassword(!showNewPassword)}
          />

          <div className="space-y-2">
            <PasswordInput
              id="confirm_password"
              label="Confirm new password"
              value={confirmPassword}
              visible={showConfirmPassword}
              onChange={setConfirmPassword}
              onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            />

            {passwordMismatch && (
              <p className="text-xs text-destructive">
                Passwords do not match.
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={onSave}
            disabled={
              saving ||
              !currentPassword ||
              !newPassword ||
              !confirmPassword ||
              passwordMismatch
            }
          >
            <Lock className="mr-2 h-4 w-4" />
            {saving ? "Updating..." : "Update password"}
          </Button>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Password Input                                                             */
/* -------------------------------------------------------------------------- */

interface PasswordInputProps {
  id: string
  label: string
  value: string
  visible: boolean
  onChange: (value: string) => void
  onToggle: () => void
}

function PasswordInput({
  id,
  label,
  value,
  visible,
  onChange,
  onToggle,
}: PasswordInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pr-10"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute top-0 right-0 flex h-10 w-10 items-center justify-center text-muted-foreground hover:text-foreground"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Account                                                                    */
/* -------------------------------------------------------------------------- */

function AccountSettings({ user }: { user: UserType }) {
  const createdAt = new Date(user.created_at).toLocaleDateString()
  const updatedAt = new Date(user.updated_at).toLocaleDateString()

  return (
    <section>
      <div>
        <h2 className="text-lg font-semibold">Account</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Information about your account.
        </p>
      </div>

      <Separator className="my-6" />

      <div className="rounded-lg border">
        <AccountRow label="User ID" value={String(user.id)} />

        <AccountRow label="Username" value={`@${user.username}`} />

        <AccountRow label="Account created" value={createdAt} />

        <AccountRow label="Last updated" value={updatedAt} />

        {user.created_by && (
          <AccountRow label="Created by" value={user.created_by} />
        )}

        {user.updated_by && (
          <AccountRow label="Updated by" value={user.updated_by} />
        )}
      </div>

      {/* Password hash deliberately not displayed */}
      <div className="mt-6 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
        <h3 className="text-sm font-medium">Password security</h3>

        <p className="mt-1 text-xs text-muted-foreground">
          Your password is securely stored as a hash and is never displayed in
          account settings.
        </p>
      </div>
    </section>
  )
}

function AccountRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b px-4 py-3 last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>

      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}
