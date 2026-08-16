"use client"

import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

import { UserForm } from "../components/UserForm"
import type { EditUserFormValues } from "../schemas"
import { useUpdateUserMutation, useUserQuery } from "../hooks/useUsers"
import { useNavigate, useParams } from "react-router-dom"

export default function EditUserPage() {
  const router = useNavigate()
  const params = useParams()

  const username = params.username

  const { data: user, isLoading } = useUserQuery(username || "")
  const updateUser = useUpdateUserMutation()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>User not found.</div>
  }

  const handleSubmit = (values: EditUserFormValues) => {
    updateUser.mutate(
      {
        id: user.id,
        data: values,
      },
      {
        onSuccess: () => {
          router("/users")
        },
      }
    )
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <Button variant="ghost" onClick={() => router(-1)} className="mb-3">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <h1 className="text-3xl font-bold">Edit User</h1>

        <p className="text-muted-foreground">{`${user.first_name} ${user.last_name}`}</p>
      </div>

      <UserForm
        mode="edit"
        defaultValues={{
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone_number: user.phone_number,
        }}
        onSubmit={handleSubmit}
        onCancel={() => router(-1)}
        isSubmitting={updateUser.isPending}
      />
    </div>
  )
}
