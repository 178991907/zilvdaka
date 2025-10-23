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

export type IconName = 'Book' | 'Brush' | 'ShieldCheck' | 'Star' | 'Trophy' | 'Zap' | 'Swords' | 'Mountain' | 'Flower' | 'Gem' | 'Bug';

const icons: { [key in IconName]: LucideIcon } = {
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
};

export const iconNames = Object.keys(icons) as IconName[];


interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
}

export const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = icons[name as IconName];
  if (!LucideIcon) {
    return <icons.Star {...props} />; // Fallback to a default icon
  }
  return <LucideIcon {...props} />;
};
