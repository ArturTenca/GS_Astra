import { Ionicons } from '@expo/vector-icons';

type IconName =
  | 'chevron-down'
  | 'chevron-back'
  | 'chevron-forward'
  | 'arrow-forward'
  | 'menu'
  | 'close'
  | 'location'
  | 'call'
  | 'mail'
  | 'star'
  | 'checkmark'
  | 'shield-checkmark'
  | 'time'
  | 'swap-horizontal'
  | 'planet'
  | 'sparkles'
  | 'logo-instagram'
  | 'logo-facebook'
  | 'logo-twitter';

const MAP: Record<IconName, keyof typeof Ionicons.glyphMap> = {
  'chevron-down': 'chevron-down',
  'chevron-back': 'chevron-back',
  'chevron-forward': 'chevron-forward',
  'arrow-forward': 'arrow-forward',
  menu: 'menu',
  close: 'close',
  location: 'location',
  call: 'call',
  mail: 'mail',
  star: 'star',
  checkmark: 'checkmark',
  'shield-checkmark': 'shield-checkmark',
  time: 'time',
  'swap-horizontal': 'swap-horizontal',
  planet: 'planet',
  sparkles: 'sparkles',
  'logo-instagram': 'logo-instagram',
  'logo-facebook': 'logo-facebook',
  'logo-twitter': 'logo-twitter',
};

export function LandingIcon({
  name,
  size = 20,
  color = 'currentColor',
  className,
}: {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
}) {
  return <Ionicons name={MAP[name]} size={size} color={color} className={className} />;
}
