"use client";

import deleteEvent from "@/actions/delete-event";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteEventDialogProps {
  eventId: string;
}

const DeleteEventDialog = ({ eventId }: DeleteEventDialogProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false); // State to control dialog open state

  const handleDeleteEvent = async () => {
    const deletedEvent = await deleteEvent(eventId);

    if (deletedEvent.error) {
      toast({
        title: "Failure",
        description: "Failed to delete event. Please try again",
      });
      setOpen(false);
    } else {
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
      setOpen(false);
      router.push("/events");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={buttonVariants({ variant: "destructive" })}
        onClick={() => setOpen(true)} // Open the dialog
      >
        <Trash2 /> Delete Event
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this event?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            Event and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDeleteEvent}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteEventDialog;
