"use client";

import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Gender, MembershipType, UserStatus } from "../types/users.enums";

import { User, Calendar, Shield } from "lucide-react";

import { userFormSchema, type UserFormValues } from "../schemas";

import type { SubmitHandler } from "react-hook-form";
import { FormWrapper } from "@/components/wrappers/FormWrapper";

interface UserFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<UserFormValues>;
  onSubmit: SubmitHandler<UserFormValues>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function UserForm({
  mode,
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
}: UserFormProps) {
  // const { register } = useFormContext<UserFormValues>();
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),

    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      

      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        ...form.getValues(),
        ...defaultValues,
      });
    }
  }, [defaultValues, form]);

  // const children = useFieldArray({
  //   control: form.control,
  //   name: 'children',
  // });

  return (
    <FormProvider {...form}>
      <FormWrapper
        form={form}
        title={mode === "create" ? "Create User" : "Edit User"}
        description="Manage user profile information."

        submitting={isSubmitting}

        submitLabel={mode === "create" ? "Create User" : "Save Changes"}

        onCancel={onCancel}
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* BASIC INFO */}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-5 md:grid-cols-2">
              <div>
                <label>First Name</label>

                <Input {...form.register("first_name")} />

                <p className="text-sm text-red-500">
                  {form.formState.errors.first_name?.message}
                </p>
              </div>

              <div>
                <label>Last Name</label>

                <Input {...form.register("last_name")} />

                <p className="text-sm text-red-500">
                  {form.formState.errors.last_name?.message}
                </p>
              </div>

              <div>
                <label>Mobile</label>

                <Input {...form.register("phone_number")} />

                <p className="text-sm text-red-500">
                  {form.formState.errors.phone_number?.message}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* PERSONAL */}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-5 md:grid-cols-2">
              <div>
                <label>Gender</label>

                <Select
                  value={form.watch("gender")}
                  onValueChange={(v) => form.setValue("gender", v as Gender)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value={Gender.MALE}>Male</SelectItem>

                    <SelectItem value={Gender.FEMALE}>Female</SelectItem>

                    <SelectItem value={Gender.OTHER}>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

       
     
        

     


          {/* FOOTER */}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {mode === "create" ? "Create User" : "Update User"}
            </Button>
          </div>
        </form>
      </FormWrapper>
    </FormProvider>
  );
}
