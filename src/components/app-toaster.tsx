import { Toaster } from "sonner"

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      expand={false}
      duration={4000}
      gap={10}
      toastOptions={{
        classNames: {
          toast: "rounded-none border shadow-md px-4 py-3",
          title: "text-sm font-semibold",
          description: "text-sm opacity-80",
          success: "border-green-200",
          error: "border-red-200",
          warning: "border-yellow-200",
          info: "border-blue-200",
          loading: "border-gray-200",
          closeButton: "rounded-none",
        },
      }}
    />
  )
}
