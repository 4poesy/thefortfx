import { createFileRoute, Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/components/auth-shell";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [{ title: "Forgot Password — ForexPilot AI" }, { name: "robots", content: "noindex" }],
  }),
  component: () => (
    <AuthShell title="Reset your password" subtitle="We'll email you a secure reset link." footer={<>Remembered it? <Link to="/login" className="text-primary hover:underline">Sign in</Link></>}>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <label className="block"><span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</span><Input type="email" placeholder="you@trader.com" required /></label>
        <Button type="submit" className="w-full">Send reset link</Button>
      </form>
    </AuthShell>
  ),
});
