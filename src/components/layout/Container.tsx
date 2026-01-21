import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const maxWidths = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
};

function Container({ children, className = '', size = 'lg' }: ContainerProps) {
  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${maxWidths[size]} ${className}`}>
      {children}
    </div>
  );
}

export { Container };
export type { ContainerProps };
