"use client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { IssueInput } from "../types";
import { createIssue } from "../action";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface NewIssueModalProps {
  repositoryId: string;
  onClose?: () => void;
  onIssueCreated?: () => void;
}

export default function NewIssueModal({
  repositoryId,
  onClose,
  onIssueCreated,
}: NewIssueModalProps) {
  const [input, setInput] = useState<IssueInput>({
    repositoryId,
  });
  const [open, setOpen] = useState<boolean>(false);
  const { mutate } = useMutation({
    mutationFn: () => createIssue(input),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      mutate();
      if (onIssueCreated) {
        onIssueCreated();
      }
      if (onClose) {
        onClose();
      }
      window.location.reload();
    } catch (err) {
      console.error("Error creating issue:", err);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button">New Issue</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Issue</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="title"
                name="title"
                value={input?.title}
                onChange={(e) => {
                  setInput({ ...input, title: e.target.value.toString() });
                }}
                placeholder="Title"
                className="col-span-4 mx-auto"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Textarea
                placeholder="Description"
                id="description"
                name="description"
                value={input?.body}
                onChange={(e) => {
                  setInput({ ...input, body: e.target.value.toString() });
                }}
                className="col-span-4 mx-auto"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
            <Button type="submit" onClick={handleSubmit}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
