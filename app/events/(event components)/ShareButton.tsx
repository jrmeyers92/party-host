"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Clipboard } from "lucide-react";
const ShareButton = () => {
  const { toast } = useToast();

  const shareEvent = () => {
    // copy current url to users clipboard
    const link = window.location.href + "/sign-up";
    navigator.clipboard.writeText(link);
    toast({
      title: "Copied to clipboard",
      description: "Event link copied to clipboard",
    });
  };
  return (
    <Button onClick={shareEvent}>
      <Clipboard />
      Share Event
    </Button>
  );
};

export default ShareButton;
