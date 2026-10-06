import { Animated, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import { useCallback } from 'react';
import { useAnimatedValue } from '../utils/animatedCompat';

interface Props extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  scale?: number;
}

export function PressableScale({
  onPressIn,
  onPressOut,
  style,
  children,
  scale = 0.96,
  ...rest
}: Props) {
  const anim = useAnimatedValue(1);

  const handlePressIn = useCallback(
    (e: any) => {
      Animated.spring(anim, {
        toValue: scale,
        useNativeDriver: true,
        speed: 18,
        bounciness: 6,
      }).start();
      onPressIn?.(e);
    },
    [anim, scale, onPressIn]
  );

  const handlePressOut = useCallback(
    (e: any) => {
      Animated.spring(anim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 18,
        bounciness: 6,
      }).start();
      onPressOut?.(e);
    },
    [anim, onPressOut]
  );

  return (
    <Pressable
      {...rest}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, { transform: [{ scale: anim }] }]}
    >
      {children}
    </Pressable>
  );
}
