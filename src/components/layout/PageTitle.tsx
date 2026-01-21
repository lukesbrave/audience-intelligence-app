import { ReactNode } from 'react';

interface PageTitleProps {
  children: ReactNode;
  description?: string;
  className?: string;
}

function PageTitle({ children, description, className = '' }: PageTitleProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <h1 className="text-2xl font-semibold text-gray-900">{children}</h1>
      {description && (
        <p className="mt-2 text-gray-600">{description}</p>
      )}
    </div>
  );
}

export { PageTitle };
export type { PageTitleProps };
