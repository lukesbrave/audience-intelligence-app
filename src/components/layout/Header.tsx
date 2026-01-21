'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Container } from './Container';

function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/');
  };

  const isHistoryPage = pathname.startsWith('/research/history');

  return (
    <header className="bg-white border-b border-gray-200">
      <Container size="xl">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/research"
            className="flex items-center gap-2 text-[#16314C] hover:opacity-80 transition-opacity"
          >
            <svg
              className="w-8 h-8"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="32" height="32" rx="8" fill="#16314C" />
              <path
                d="M16 8C11.58 8 8 11.58 8 16s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"
                fill="#BBDCEF"
              />
              <circle cx="16" cy="16" r="3" fill="#BBDCEF" />
            </svg>
            <span className="font-semibold text-lg">Audience Intelligence</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              href="/research"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                pathname === '/research'
                  ? 'bg-[#BBDCEF]/30 text-[#16314C]'
                  : 'text-gray-600 hover:text-[#16314C] hover:bg-gray-100'
              }`}
            >
              New Research
            </Link>
            <Link
              href="/research/history"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isHistoryPage
                  ? 'bg-[#BBDCEF]/30 text-[#16314C]'
                  : 'text-gray-600 hover:text-[#16314C] hover:bg-gray-100'
              }`}
            >
              History
            </Link>
            <button
              onClick={handleLogout}
              className="ml-2 px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Logout
            </button>
          </nav>
        </div>
      </Container>
    </header>
  );
}

export { Header };
