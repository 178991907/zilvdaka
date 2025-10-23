import {
  LucideIcon,
  Book,
  Brush,
  ShieldCheck,
  Star,
  Trophy,
  Zap,
  Swords,
  Mountain,
  Flower,
  Gem,
  Bug,
} from 'lucide-react';

export type IconName = 'Book' | 'Brush' | 'ShieldCheck' | 'Star' | 'Trophy' | 'Zap' | 'Ant' | 'Swords' | 'Mountain' | 'Flower' | 'Gem';

const icons: { [key in IconName | 'Bug']: LucideIcon } = {
  Book,
  Brush,
  ShieldCheck,
  Star,
  Trophy,
  Zap,
  Ant: Bug, // Use Bug icon as a replacement for Ant
  Swords,
  Mountain,
  Flower,
  Gem,
  Bug,
};

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
}

export const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = icons[name as IconName];
  if (!LucideIcon) {
    return null;
  }
  return <LucideIcon {...props} />;
};
