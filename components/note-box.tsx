"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function NotesBox() {
  const [notes, setNotes] = useState(
    "my name is rasel, i am a Electrical Engineer",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!notes.trim()) {
      toast({
        title: "Empty notes",
        description: "Please enter some text before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call or save operation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Here you would typically save to a database or API
    console.log("Saving notes:", notes);

    toast({
      title: "Notes saved!",
      description: "Your notes have been successfully saved.",
    });

    setIsSubmitting(false);
  };

  const handleClear = () => {
    setNotes("");
    toast({
      title: "Notes cleared",
      description: "Your notes have been cleared.",
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Text Notes
        </CardTitle>
        <CardDescription>
          Write and edit your notes, then submit to save them.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Your Notes</Label>
            <Textarea
              id="notes"
              placeholder="Start typing your notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[200px] resize-none"
            />
            <div className="text-sm text-muted-foreground">
              {notes.length} characters
            </div>
          </div>

          <div className="flex gap-2 justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              disabled={!notes.trim() || isSubmitting}
            >
              Clear
            </Button>

            <Button
              type="submit"
              disabled={!notes.trim() || isSubmitting}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Saving..." : "Save Notes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
