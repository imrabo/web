"use client"

import { useEffect, useState } from "react"
import { CalendarDays, Mail, Pencil, Phone, User } from "lucide-react"
import { toast } from "sonner"

import { useUserQuery, useUpdateUserMutation } from "../hooks/useUsers"
import type { UserUpdateData } from "../types"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/features/auth/hooks/useAuth"

export default function ProfilePage() {
  const { user: currentUser } = useAuth()

  const { data: user, isLoading, isError } = useUserQuery(currentUser?.username || "")
  const updateUserMutation = useUpdateUserMutation()

  const [isEditing, setIsEditing] = useState(false)

  const [form, setForm] = useState<UserUpdateData>({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone_number: "",
  })

  useEffect(() => {
    if (!user) return

    setForm({
      first_name: user.data?.first_name,
      last_name: user.data?.last_name,
      username: user.data?.username,
      email: user.data?.email,
      phone_number: user.data?.phone_number ?? "",
    })
  }, [user])

  const handleChange = (field: keyof UserUpdateData, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCancel = () => {
    if (!user) return

    setForm({
      first_name: user.data?.first_name,
      last_name: user.data?.last_name,
      username: user.data?.username,
      email: user.data?.email,
      phone_number: user.data?.phone_number ?? "",
    })

    setIsEditing(false)
  }

  const handleSave = async () => {
    if (!user) return

    try {
      await updateUserMutation.mutateAsync({
        id: user.data?.id,
        data: form,
      })

      setIsEditing(false)
      toast.success("Profile updated successfully")
    } catch {
      // Error toast is already handled by the mutation hook.
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 rounded-lg bg-muted" />
          <div className="grid gap-6 md:grid-cols-[280px_1fr]">
            <div className="h-72 rounded-lg bg-muted" />
            <div className="h-96 rounded-lg bg-muted" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !user) {
    return (
      <div className="container mx-auto max-w-7xl p-6">
        <Card>
          <CardContent className="flex min-h-40 items-center justify-center">
            <p className="text-muted-foreground">
              Unable to load your profile.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const fullName = `${user.data?.first_name} ${user.data?.last_name}`

  const initials =
    `${user.data?.first_name?.[0] ?? ""}${user.data?.last_name?.[0] ?? ""}`.toUpperCase()

  const joinedDate = new Date(user.created_at).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-6">
      {/* Profile Header */}
      <Card className="overflow-hidden">
        <div className="h-32 bg-muted" />

        <CardContent className="relative px-6 pb-6">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarFallback className="text-2xl font-semibold">
                  {initials || <User className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>

              <div className="pb-1">
                <h1 className="text-2xl font-bold">{fullName}</h1>

                <p className="text-muted-foreground">@{user.username}</p>
              </div>
            </div>

            {!isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit profile
              </Button>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {user.email}
            </span>

            {user.phone_number && (
              <span className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {user.phone_number}
              </span>
            )}

            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Joined {joinedDate}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile overview</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Username</p>
                <p className="text-sm text-muted-foreground">
                  @{user.username}
                </p>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm break-all text-muted-foreground">
                  {user.email}
                </p>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">
                  {user.phone_number || "Not provided"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Account information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">User ID</span>
                <span className="font-medium">{user.id}</span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Updated</span>
                <span className="font-medium">
                  {new Date(user.updated_at).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Personal information</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage your profile information.
              </p>
            </div>
          </CardHeader>

          <CardContent>
            {isEditing ? (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First name</Label>

                    <Input
                      id="first_name"
                      value={form.first_name ?? ""}
                      onChange={(event) =>
                        handleChange("first_name", event.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last name</Label>

                    <Input
                      id="last_name"
                      value={form.last_name ?? ""}
                      onChange={(event) =>
                        handleChange("last_name", event.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>

                  <Input
                    id="username"
                    value={form.username ?? ""}
                    onChange={(event) =>
                      handleChange("username", event.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>

                  <Input
                    id="email"
                    type="email"
                    value={form.email ?? ""}
                    onChange={(event) =>
                      handleChange("email", event.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone_number">Phone number</Label>

                  <Input
                    id="phone_number"
                    value={form.phone_number ?? ""}
                    onChange={(event) =>
                      handleChange("phone_number", event.target.value)
                    }
                  />
                </div>

                <Separator />

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={updateUserMutation.isPending}
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={handleSave}
                    disabled={updateUserMutation.isPending}
                  >
                    {updateUserMutation.isPending
                      ? "Saving..."
                      : "Save changes"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">First name</p>
                    <p className="mt-1 font-medium">{user.first_name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Last name</p>
                    <p className="mt-1 font-medium">{user.last_name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Username</p>
                    <p className="mt-1 font-medium">@{user.username}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="mt-1 font-medium break-all">{user.email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Phone number
                    </p>
                    <p className="mt-1 font-medium">
                      {user.phone_number || "Not provided"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground">Member since</p>

                  <p className="mt-1 font-medium">
                    {new Date(user.created_at).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
