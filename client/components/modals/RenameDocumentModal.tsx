"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  renameDocumentSchema,
  type RenameDocumentFormValues,
} from "@/lib/validations/documents";

type RenameDocumentModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTitle?: string;
  onSubmit?: (values: RenameDocumentFormValues) => void;
};

export function RenameDocumentModal({
  open,
  onOpenChange,
  initialTitle = "",
  onSubmit,
}: RenameDocumentModalProps) {
  const form = useForm<RenameDocumentFormValues>({
    resolver: zodResolver(renameDocumentSchema),
    defaultValues: { title: initialTitle },
  });

  useEffect(() => {
    if (open) {
      form.reset({ title: initialTitle });
    }
  }, [open, initialTitle, form]);

  const handleSubmit = (values: RenameDocumentFormValues) => {
    onSubmit?.(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Rename document</DialogTitle>
          <DialogDescription>Update the title of your document.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2" noValidate>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Title</FormLabel>
                  <FormControl>
                    <Input {...field} className="h-10 rounded-xl" autoFocus />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 pt-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl" disabled={form.formState.isSubmitting}>
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
