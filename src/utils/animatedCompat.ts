import { Platform, Animated } from 'react-native';
import { useRef } from 'react';

export function useAnimatedValue(initialValue: number) {
  const ref = useRef(new Animated.Value(initialValue));
  const value = ref.current;

  if (Platform.OS === 'web') {
    return value;
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { useAnimatedValue: useAnimatedValueNative } = require('react-native-reanimated');
  return useAnimatedValueNative(initialValue);
}
