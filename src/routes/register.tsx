import { createFileRoute, Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/components/auth-shell";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [{ title: "Get Started — ForexPilot AI" }, { name: "description", content: "Create your ForexPilot AI account." }, { name: "robots", content: "noindex" }],
  }),
  component: () => (
    <AuthShell title="Create your account" subtitle="Start trading smarter in 30 seconds." footer={<>Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link></>}>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <label className="block"><span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Full name</span><Input placeholder="Alex Trader" required /></label>
        <label className="block"><span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</span><Input type="email" placeholder="you@trader.com" required /></label>
        <label className="block"><span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Password</span><Input type="password" placeholder="At least 8 characters" required /></label>
        <Button type="submit" className="w-full">Create account</Button>
        <p className="text-center text-[11px] text-muted-foreground">By signing up you agree to our Terms and Privacy Policy.</p>
      </form>
    </AuthShell>
  ),
});
