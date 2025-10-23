import {
  LucideIcon,
  Book,
  Brush,
  ShieldCheck,
  Star,
  Trophy,
  Zap,
} from 'lucide-react';

export type IconName = 'Book' | 'Brush' | 'ShieldCheck' | 'Star' | 'Trophy' | 'Zap';

const icons: { [key in IconName]: LucideIcon } = {
  Book,
  Brush,
  ShieldCheck,
  Star,
  Trophy,
  Zap,
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
