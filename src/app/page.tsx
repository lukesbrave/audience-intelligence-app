'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card } from '@/components/ui';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        router.push('/research');
      } else {
        setError('Incorrect password. Please try again.');
        setPassword('');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      id="main"
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#16314C] rounded-xl mb-4">
            <svg
              className="w-8 h-8"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 4C9.37 4 4 9.37 4 16s5.37 12 12 12 12-5.37 12-12S22.63 4 16 4zm0 21c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9z"
                fill="#BBDCEF"
              />
              <circle cx="16" cy="16" r="4.5" fill="#BBDCEF" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Audience Intelligence
          </h1>
          <p className="mt-2 text-gray-600">
            Enter your password to continue
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              loading={loading}
              disabled={!password.trim()}
            >
              Continue
            </Button>
          </form>
        </Card>

        <p className="mt-6 text-center text-sm text-gray-500">
          Need access?{' '}
          <a
            href="mailto:support@example.com"
            className="text-[#16314C] hover:underline"
          >
            Contact us
          </a>
        </p>
      </div>
    </main>
  );
}
