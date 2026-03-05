"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ShineBorder } from "@/components/ui/shine-border";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xyzndpdo";

type Status = "idle" | "ok" | "error";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  const [botField, setBotField] = useState("");

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");

    if (botField) return;

    if (!validateEmail(email)) {
      setStatus("error");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          company,
          message,
          _gotcha: botField,
          _subject: "New waitlist signup · Acta",
          page: typeof window !== "undefined" ? window.location.href : "",
        }),
      });

      if (!res.ok) throw new Error("Submission failed");

      setEmail("");
      setCompany("");
      setMessage("");
      setStatus("ok");
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <ShineBorder
        borderWidth={2}
        duration={12}
        shineColor={["#F0E7CC", "#E9F8D8", "#FFFFFF"]}
        className="rounded-3xl"
      />
      <Card className="bg-[rgba(255,255,255,0.03)] border border-white/10 rounded-3xl relative shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_40px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_24px_60px_rgba(0,0,0,0.45)] hover:ring-1 hover:ring-white/10 after:pointer-events-none after:absolute after:inset-0 after:rounded-3xl after:border after:border-white/5">
        <CardHeader className="px-8 pt-8 pb-6">
          <CardTitle className="text-3xl text-center mb-3 font-extrabold uppercase tracking-[0.18em] text-transparent bg-clip-text bg-[linear-gradient(180deg,#F0E7CC_0%,#E9F8D8_55%,#FFFFFF_100%)] drop-shadow-[0_0_10px_rgba(255,255,255,0.08)]">
            Join the waitlist
          </CardTitle>
          <CardDescription className="text-center text-lg text-white/85">
            Get early access to Acta API and credits for early partners.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <input
              type="text"
              name="_gotcha"
              value={botField}
              onChange={e => setBotField(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              aria-label="Email address"
              className="bg-[rgba(255,255,255,0.03)] border border-white/10 rounded-2xl h-12 text-base text-white/85 placeholder:text-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-300 hover:bg-[rgba(255,255,255,0.05)] focus:bg-[rgba(255,255,255,0.05)] focus:ring-1 focus:ring-white/20"
            />

            <Input
              type="text"
              placeholder="Company name (optional)"
              value={company}
              onChange={e => setCompany(e.target.value)}
              aria-label="Company name"
              className="bg-[rgba(255,255,255,0.03)] border border-white/10 rounded-2xl h-12 text-base text-white/85 placeholder:text-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-300 hover:bg-[rgba(255,255,255,0.05)] focus:bg-[rgba(255,255,255,0.05)] focus:ring-1 focus:ring-white/20"
            />

            <Textarea
              placeholder="Tell us about your use case..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              aria-label="Message"
              className="bg-[rgba(255,255,255,0.03)] border border-white/10 rounded-2xl min-h-[140px] text-base p-4 text-white/85 placeholder:text-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-300 hover:bg-[rgba(255,255,255,0.05)] focus:bg-[rgba(255,255,255,0.05)] focus:ring-1 focus:ring-white/20"
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[rgba(255,255,255,0.03)] border border-white/10 text-transparent bg-clip-text bg-[linear-gradient(180deg,#F0E7CC_0%,#E9F8D8_55%,#FFFFFF_100%)] hover:bg-[rgba(255,255,255,0.05)] rounded-3xl h-14 font-extrabold text-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_40px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_24px_60px_rgba(0,0,0,0.45)] hover:ring-1 hover:ring-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20 uppercase tracking-[0.18em] drop-shadow-[0_0_10px_rgba(255,255,255,0.08)]"
            >
              {isSubmitting ? "Submitting..." : "Join Waitlist"}
            </Button>

            {status === "ok" && (
              <p className="text-sm text-green-500 text-center">
                Thank you! We will contact you soon.
              </p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-500 text-center">
                Something went wrong. Please check your email and try again.
              </p>
            )}
          </form>
        </CardContent>
        <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_0_60px_rgba(255,255,255,0.03)]" />
      </Card>
    </div>
  );
}
