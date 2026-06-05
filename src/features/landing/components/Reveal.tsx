import { View, type ViewProps } from 'react-native';
import { useScrollReveal } from '@/features/landing/hooks/useScrollReveal';

export function Reveal({
  children,
  className = '',
  delayClass = '',
  ...rest
}: ViewProps & { delayClass?: string }) {
  const { ref, className: revealClass } = useScrollReveal(0.1, delayClass);
  return (
    <View ref={ref} className={`${revealClass} ${className}`.trim()} {...rest}>
      {children}
    </View>
  );
}
