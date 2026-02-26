"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Save } from "lucide-react";

export default function ProfileForm({
  initialName,
  initialEmail,
}: {
  initialName: string;
  initialEmail: string;
}) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-200">Email</Label>
            <Input
              id="email"
              type="email"
              value={initialEmail}
              disabled
              className="bg-zinc-800 border-zinc-700 text-zinc-500 cursor-not-allowed"
            />
            <p className="text-xs text-zinc-600">Email cannot be changed.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-200">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-zinc-200">Phone Number</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+962791234567"
              className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
            />
          </div>

          <Button type="submit" className="bg-amber-500 text-zinc-950 hover:bg-amber-400">
            <Save className="mr-2 h-4 w-4" />
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
