"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

// import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { IWorkSpaceStatus, IWorkSpaceVisibility } from "../types"
import {
  useUpdateWorkSpaceMutation,
  useWorkSpaceQuery,
} from "../hooks/useWorkSpace"
import type { Workspace } from "../schemas"

export default function WorkSpaceEditPage() {
  const { id } = useParams()
  const router = useNavigate()

  const { data, isLoading } = useWorkSpaceQuery(id as string)

  const updateWorkSpace = useUpdateWorkSpaceMutation()

  const [form, setForm] = useState<WorkSpace>({
    name: "",
    description: "",
    category: "",
    status: IWorkSpaceStatus.Active,
  })

  useEffect(() => {
    if (!data) return

    setForm({
      name: data.data?.name,
      description: data.data?.description ?? "",
      category: data.data?.category ?? "",
      type: data.data?.type,
      accessType: data.data?.accessType,
      visibility: data.data?.visibility,
      status: data.status,
    })
  }, [data])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!data) {
    return <div>WorkSpace not found.</div>
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()

    updateWorkSpace.mutate(
      {
        id: data.data?.id,
        data: form,
      },
      {
        onSuccess() {
          router(`/workspaces/${data.data?.id}`)
        },
      }
    )
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit WorkSpace</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={submit} className="space-y-6">
            <div>
              <Label>Name</Label>

              <Input
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>Description</Label>

              <Input
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>Category</Label>

              <Input
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label>Type</Label>

                <select
                  className="h-10 w-full rounded-md border px-3"
                  value={form}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: e.target.value as IWorkSpaceType,
                    })
                  }
                >
                  {Object.values(IWorkSpaceType).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Access</Label>

                <select
                  className="h-10 w-full rounded-md border px-3"
                  value={form.accessType}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      accessType: e.target.value as IWorkSpaceAccessType,
                    })
                  }
                >
                  {Object.values(IWorkSpaceAccessType).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Visibility</Label>

                <select
                  className="h-10 w-full rounded-md border px-3"
                  value={form.visibility}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      visibility: e.target.value as IWorkSpaceVisibility,
                    })
                  }
                >
                  {Object.values(IWorkSpaceVisibility).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Status</Label>

                <select
                  className="h-10 w-full rounded-md border px-3"
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as IWorkSpaceStatus,
                    })
                  }
                >
                  {Object.values(IWorkSpaceStatus).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router(-1)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={updateWorkSpace.isPending}>
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
