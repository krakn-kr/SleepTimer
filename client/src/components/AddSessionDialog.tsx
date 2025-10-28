import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const formSchema = z.object({
  lockTime: z.string().min(1, "Lock time is required"),
  unlockTime: z.string().min(1, "Unlock time is required"),
}).refine((data) => {
  const lock = new Date(data.lockTime);
  const unlock = new Date(data.unlockTime);
  return unlock > lock;
}, {
  message: "Unlock time must be after lock time",
  path: ["unlockTime"],
});

type FormValues = z.infer<typeof formSchema>;

export function AddSessionDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lockTime: "",
      unlockTime: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      return apiRequest("POST", "/api/sessions", {
        lockTime: new Date(values.lockTime).toISOString(),
        unlockTime: new Date(values.unlockTime).toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
      toast({
        title: "Session added",
        description: "Screen lock session has been recorded successfully.",
      });
      form.reset();
      setOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add session. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    createMutation.mutate(values);
  };

  const setQuickTime = (type: "now" | "1h" | "2h" | "night") => {
    const now = new Date();
    const lockTime = new Date(now);

    let unlockTime = new Date(now);
    
    if (type === "1h") {
      lockTime.setHours(lockTime.getHours() - 1);
    } else if (type === "2h") {
      lockTime.setHours(lockTime.getHours() - 2);
    } else if (type === "night") {
      lockTime.setHours(0, 0, 0, 0);
      unlockTime.setHours(7, 0, 0, 0);
    }

    form.setValue("lockTime", format(lockTime, "yyyy-MM-dd'T'HH:mm"));
    form.setValue("unlockTime", format(unlockTime, "yyyy-MM-dd'T'HH:mm"));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-add-session">
          <Plus className="h-4 w-4 mr-2" />
          Add Session
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Screen Lock Session</DialogTitle>
          <DialogDescription>
            Manually log a screen lock/unlock event. Enter the times when your device was locked and unlocked.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <p className="text-sm text-muted-foreground w-full mb-1">Quick fill:</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setQuickTime("1h")}
                  data-testid="button-quick-1h"
                >
                  Last 1 hour
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setQuickTime("2h")}
                  data-testid="button-quick-2h"
                >
                  Last 2 hours
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setQuickTime("night")}
                  data-testid="button-quick-night"
                >
                  Night sleep
                </Button>
              </div>

              <FormField
                control={form.control}
                name="lockTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lock Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        data-testid="input-lock-time"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unlockTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unlock Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        data-testid="input-unlock-time"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                data-testid="button-submit-session"
              >
                {createMutation.isPending ? "Adding..." : "Add Session"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
