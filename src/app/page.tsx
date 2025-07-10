import { LoginForm } from './_components/login-form';
import { BrainCircuit } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <BrainCircuit className="h-12 w-12 text-primary" />
          <h1 className="mt-4 text-3xl font-bold tracking-tighter text-primary">AICademy</h1>
          <p className="mt-2 text-center text-muted-foreground">
            Welcome! Please sign in to continue.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
