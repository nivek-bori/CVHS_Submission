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

export function isAuthorized(userRole: Role | null | undefined, requiredRole: Role) {
  if (!userRole) {
    userRole = 'guest';
  }

  const userRoleLevel = roleHierarchy[userRole];
  const requiredRoleLevel = roleHierarchy[requiredRole];

  return userRoleLevel >= requiredRoleLevel;
}
