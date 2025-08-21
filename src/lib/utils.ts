import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Masks an email address for privacy during verification
 * Example: "john.doe@example.com" -> "j*******@******.com"
 */
export function maskEmail(email: string): string {
  if (!email || email.length < 3) return email;
  
  // Split email into local and domain parts
  const [localPart, domain] = email.split('@');
  
  if (!localPart || !domain) return email;
  
  // Mask local part: only first letter + asterisks (no last letter)
  const firstChar = localPart[0];
  const localAsterisks = '*'.repeat(Math.max(6, localPart.length - 1));
  const maskedLocal = `${firstChar}${localAsterisks}`;
  
  // Mask domain: only show TLD, mask everything before it
  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1]; // Get last part (.com, .org, etc.)
  const domainAsterisks = '*'.repeat(6);
  const maskedDomain = `${domainAsterisks}.${tld}`;
  
  return `${maskedLocal}@${maskedDomain}`;
}
