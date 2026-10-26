import { type ReactNode } from 'react';
import { useReveal } from '@/hooks/useReveal';

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  light?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  light = false,
  className = '',
}: SectionHeadingProps) {
  const { ref, inView } = useReveal();
  const alignClass = align === 'center' ? 'mx-auto text-center items-center' : 'text-left items-start';

  return (
    <div
      ref={ref}
      className={`flex max-w-3xl flex-col gap-4 ${alignClass} ${className} ${
        inView ? 'animate-fade-up' : 'opacity-0'
      }`}
    >
      {eyebrow && (
        <span className={`eyebrow ${light ? 'text-accent-400' : ''}`}>{eyebrow}</span>
      )}
      <h2
        className={`text-3xl font-bold leading-[1.15] sm:text-4xl lg:text-[2.75rem] ${
          light ? 'text-white' : 'text-navy-900'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`text-base leading-relaxed sm:text-lg ${light ? 'text-white/75' : 'text-ink/65'}`}>
          {description}
        </p>
      )}
    </div>
  );
}
