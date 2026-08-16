import React from "react"
import type { FieldValues, UseFormReturn } from "react-hook-form"

import { cn } from "@/lib/utils"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import { Loader2 } from "lucide-react"

import { FormFooter } from "./FormFooter"

export interface FormWrapperProps<T extends FieldValues> {
  form: UseFormReturn<T>

  title: string
  description?: string

  children: React.ReactNode

  className?: string

  loading?: boolean
  submitting?: boolean

  showHeader?: boolean
  showFooter?: boolean

  submitLabel?: string
  cancelLabel?: string

  onCancel?: () => void

  submitDisabled?: boolean

  /**
   * Show React Hook Form debugging information.
   *
   * Only renders when NODE_ENV is development.
   */
  showDebug?: boolean
}

export function FormWrapper<T extends FieldValues>({
  form,

  title,
  description,

  children,

  className,

  loading = false,
  submitting = false,

  showHeader = true,
  showFooter = true,

  submitLabel = "Save",
  cancelLabel = "Cancel",

  onCancel,

  submitDisabled = false,

  showDebug = false,
}: FormWrapperProps<T>) {
  const isBusy = loading || submitting

  return (
    <div className={cn("relative", className)}>
      {isBusy && <LoadingOverlay />}

      <Card className="overflow-hidden">
        {showHeader && (
          <CardHeader className="border-b">
            <CardTitle>{title}</CardTitle>

            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}

        <CardContent className="space-y-6 p-6">
          {children}

          {showDebug &&
            import.meta.env.VITE_PUBLIC_ENVIRONMENT === "development" && (
              <FormDebugPanel form={form} />
            )}
        </CardContent>

        {showFooter && (
          <FormFooter
            form={form}
            submitting={submitting}
            submitLabel={submitLabel}
            cancelLabel={cancelLabel}
            submitDisabled={submitDisabled}
            onCancel={onCancel}
          />
        )}
      </Card>
    </div>
  )
}

interface FormDebugPanelProps<T extends FieldValues> {
  form: UseFormReturn<T>
}

function FormDebugPanel<T extends FieldValues>({
  form,
}: FormDebugPanelProps<T>) {
  const {
    errors,
    dirtyFields,
    touchedFields,
    isDirty,
    isValid,
    isSubmitting,
    isSubmitted,
    submitCount,
  } = form.formState

  const values = form.watch()

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="text-sm">React Hook Form Debug</CardTitle>

        <CardDescription>
          Development-only form state information.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 text-xs">
        <DebugSection title="Values" value={values} />

        <DebugSection title="Errors" value={errors} error />

        <DebugSection title="Dirty Fields" value={dirtyFields} />

        <DebugSection title="Touched Fields" value={touchedFields} />

        <DebugSection
          title="Form State"
          value={{
            isDirty,
            isValid,
            isSubmitting,
            isSubmitted,
            submitCount,
          }}
        />
      </CardContent>
    </Card>
  )
}

interface DebugSectionProps {
  title: string
  value: unknown
  error?: boolean
}

function DebugSection({ title, value, error = false }: DebugSectionProps) {
  return (
    <div>
      <h3 className="mb-2 font-semibold">{title}</h3>

      <pre
        className={cn(
          "overflow-auto rounded p-4",
          error ? "bg-red-50 text-red-700" : "bg-muted"
        )}
      >
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  )
}

function LoadingOverlay() {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center rounded-lg bg-background/70 backdrop-blur-sm">
      <div className="flex items-center gap-3 rounded-lg border bg-background px-6 py-4 shadow-lg">
        <Loader2 className="h-5 w-5 animate-spin" />

        <span className="text-sm font-medium">Please wait...</span>
      </div>
    </div>
  )
}
