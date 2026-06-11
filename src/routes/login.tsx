import { createFileRoute, Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/components/auth-shell";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — TheFortFX" },
      { name: "description", content: "Sign in to TheFortFX." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AuthShell title="Welcome back" subtitle="Sign in to your TheFortFX account." footer={<>Don't have an account? <Link to="/register" className="text-primary hover:underline">Sign up</Link></>}>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <label className="block"><span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</span><Input type="email" placeholder="you@trader.com" required /></label>
        <label className="block"><span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Password</span><Input type="password" placeholder="••••••••" required /></label>
        <div className="flex items-center justify-between text-xs"><label className="flex items-center gap-2 text-muted-foreground"><input type="checkbox" className="rounded border-border" /> Remember me</label><Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link></div>
        <Button type="submit" className="w-full">Sign in</Button>
      </form>
    </AuthShell>
  ),
});
