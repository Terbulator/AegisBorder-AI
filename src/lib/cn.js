import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cx(...parts) {
  return twMerge(clsx(parts));
}
