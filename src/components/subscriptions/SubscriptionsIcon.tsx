'use client';

import { useState } from 'react';
import { 
  Tv, 
  Gamepad2, 
  Wrench, 
  GraduationCap, 
  Briefcase, 
  CreditCard 
} from 'lucide-react';

interface SubscriptionIconProps {
  name?: string;
  category?: string | null;
  className?: string;
}

const categoryIcons: Record<string, any> = {
  STREAMING: Tv,
  GAMING: Gamepad2,
  SOFTWARE: Wrench,
  UTILITIES: Wrench,
  EDUCATION: GraduationCap,
  WORK: Briefcase,
  OTHER: CreditCard,
};

const knownBrands: Record<string, string> = {
  spotify: 'spotify',
  netflix: 'netflix',
  youtube: 'youtube',
  'youtube premium': 'youtube',
  github: 'github',
  chatgpt: 'openai',
  openai: 'openai',
  prime: 'amazonprime',
  'amazon prime': 'amazonprime',
  disney: 'disneyplus',
  'disney+': 'disneyplus',
  hbo: 'max',
  max: 'max',
  twitch: 'twitch',
  playstation: 'playstation',
  xbox: 'xbox',
  nintendo: 'nintendo',
  figma: 'figma',
  notion: 'notion',
  slack: 'slack',
  claude: 'anthropic',
  vercel: 'vercel',
};

export function SubscriptionIcon({ name = '', category = 'OTHER', className = 'w-5 h-5' }: SubscriptionIconProps) {
  const [imgError, setImgError] = useState(false);

  const cleanName = (name || '').toLowerCase().trim();
  const cleanCategory = (category || 'OTHER').toUpperCase();
  const brandSlug = knownBrands[cleanName];

  if (brandSlug && !imgError) {
    return (
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/50 p-2 shrink-0">
        <img
          src={`https://cdn.simpleicons.org/${brandSlug}/ffffff`}
          alt={name}
          className={`${className} object-contain`}
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  const IconComponent = categoryIcons[cleanCategory] || CreditCard;

  return (
    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/50 text-zinc-200 shrink-0">
      <IconComponent className={className} />
    </div>
  );
}