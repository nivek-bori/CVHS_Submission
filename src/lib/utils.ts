import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Role } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const roleHierarchy: Record<Role, number> = {
  admin: 2,
  user: 1,
  guest: 0,
};

export function isAuthorized(userRole: string | null | undefined, requiredRole: string) {
  if (!userRole) {
    userRole = 'guest';
  }

  const userRoleLevel = roleHierarchy[userRole as Role];
  const requiredRoleLevel = roleHierarchy[requiredRole as Role];

  return userRoleLevel >= requiredRoleLevel;
}
