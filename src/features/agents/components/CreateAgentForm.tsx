/* eslint-disable react-hooks/incompatible-library */
import React from "react"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { CreateAgentFormValues } from "../schemas"
import { createAgentSchema } from "../schemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import LeafletMap from "@/components/maps/LeafletMap";

interface CreateAgentFormProps {
  onSubmit: (values: CreateAgentFormValues) => void
  onCancel: () => void
  isSubmitting?: boolean
  defaultValues?: Partial<CreateAgentFormValues>
  categories: { id: string; name: string }[]
}

export const CreateAgentForm: React.FC<CreateAgentFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
  defaultValues,
  categories = [],
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAgentFormValues>({
    resolver: zodResolver(createAgentSchema) as any,
    defaultValues: {
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      organizerName: defaultValues?.organizerName || "",
      category: defaultValues?.category || "",
      date: defaultValues?.date || "",
      time: defaultValues?.time || "",
      locationName: defaultValues?.locationName || "",
      latitude: defaultValues?.latitude ?? 45.5152, // Default Portland
      longitude: defaultValues?.longitude ?? -122.6784,
      maxRegistrations: defaultValues?.maxRegistrations ?? 10,
    },
  })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-h-[75vh] scrollbar-thin space-y-4 overflow-y-auto pr-2 text-left font-sans"
    >
      <div className="space-y-1">
        <Label
          htmlFor="title"
          className="text-xs font-bold tracking-wider text-muted-foreground uppercase"
        >
          Agent Title
        </Label>
        <Input
          id="title"
          placeholder="Sunday Park Picnic & Games"
          className="h-10 focus-visible:ring-indigo-500/30"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-xs font-semibold text-destructive">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label
          htmlFor="description"
          className="text-xs font-bold tracking-wider text-muted-foreground uppercase"
        >
          Description
        </Label>
        <Input
          id="description"
          placeholder="Bring sandwiches and toys for the kids..."
          className="h-10 focus-visible:ring-indigo-500/30"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs font-semibold text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label
            htmlFor="organizerName"
            className="text-xs font-bold tracking-wider text-muted-foreground uppercase"
          >
            Organizer Name
          </Label>
          <Input
            id="organizerName"
            placeholder="Sarah Connor"
            className="h-10 focus-visible:ring-indigo-500/30"
            {...register("organizerName")}
          />
          {errors.organizerName && (
            <p className="text-xs font-semibold text-destructive">
              {errors.organizerName.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label
            htmlFor="category"
            className="text-xs font-bold tracking-wider text-muted-foreground uppercase"
          >
            Category
          </Label>
          <select
            id="category"
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
            {...register("category")}
          >
            <option value="">-- Choose Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-xs font-semibold text-destructive">
              {errors.category.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label
            htmlFor="date"
            className="text-xs font-bold tracking-wider text-muted-foreground uppercase"
          >
            Date
          </Label>
          <Input
            id="date"
            type="date"
            className="h-10 focus-visible:ring-indigo-500/30"
            {...register("date")}
          />
          {errors.date && (
            <p className="text-xs font-semibold text-destructive">
              {errors.date.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label
            htmlFor="time"
            className="text-xs font-bold tracking-wider text-muted-foreground uppercase"
          >
            Time
          </Label>
          <Input
            id="time"
            placeholder="10:00 AM"
            className="h-10 focus-visible:ring-indigo-500/30"
            {...register("time")}
          />
          {errors.time && (
            <p className="text-xs font-semibold text-destructive">
              {errors.time.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label
            htmlFor="maxRegistrations"
            className="text-xs font-bold tracking-wider text-muted-foreground uppercase"
          >
            Capacity
          </Label>
          <Input
            id="maxRegistrations"
            type="number"
            placeholder="15"
            className="h-10 focus-visible:ring-indigo-500/30"
            {...register("maxRegistrations")}
          />
          {errors.maxRegistrations && (
            <p className="text-xs font-semibold text-destructive">
              {errors.maxRegistrations.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <Label
          htmlFor="locationName"
          className="text-xs font-bold tracking-wider text-muted-foreground uppercase"
        >
          Location Name / Address
        </Label>
        <Input
          id="locationName"
          placeholder="Westmoreland Park, SE McLoughlin Blvd, Portland"
          className="h-10 focus-visible:ring-indigo-500/30"
          {...register("locationName")}
        />
        {errors.locationName && (
          <p className="text-xs font-semibold text-destructive">
            {errors.locationName.message}
          </p>
        )}
      </div>

      {/* Coordinate Picker and Map Integration */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label
            htmlFor="latitude"
            className="text-xs font-bold tracking-wider text-muted-foreground uppercase"
          >
            Latitude
          </Label>
          <Input
            id="latitude"
            type="number"
            step="0.000001"
            className="h-10 focus-visible:ring-indigo-500/30"
            {...register("latitude")}
          />
        </div>
        <div className="space-y-1">
          <Label
            htmlFor="longitude"
            className="text-xs font-bold tracking-wider text-muted-foreground uppercase"
          >
            Longitude
          </Label>
          <Input
            id="longitude"
            type="number"
            step="0.000001"
            className="h-10 focus-visible:ring-indigo-500/30"
            {...register("longitude")}
          />
        </div>
      </div>

      <div className="space-y-1">
        <span className="mb-1 block text-xs font-bold tracking-wider text-muted-foreground uppercase">
          Select Coordinates on Map
        </span>
        {/* <div className="h-[200px] overflow-hidden rounded-xl border border-border">
          <LeafletMap
            lat={Number(latVal) || 45.5152}
            lng={Number(lngVal) || -122.6784}
            interactive={true}
            onLocationSelect={handleLocationSelect}
            popupText="Agent Location Pin"
          />
        </div> */}
      </div>

      <div className="flex justify-end gap-2 border-t border-border/50 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-indigo-600 font-medium text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-700"
        >
          {isSubmitting ? "Scheduling Agent..." : "Schedule Event"}
        </Button>
      </div>
    </form>
  )
}
export default CreateAgentForm
