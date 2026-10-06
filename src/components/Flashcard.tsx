import { Animated, Pressable, StyleSheet, Text, Easing, StyleProp, ViewStyle } from "react-native";
import { useCallback, useEffect } from "react";
import { colors, radius, shadows, typography } from "../theme";
import { impact } from "../utils/haptics";
import { useAnimatedValue } from "../utils/animatedCompat";

interface Props {
  question: string;
  answer: string;
  isFlipped: boolean;
  onFlipChange: (flipped: boolean) => void;
  style?: StyleProp<ViewStyle>;
}

const FLIP_DURATION = 520;

export function Flashcard({ question, answer, isFlipped, onFlipChange, style }: Props) {
  const animation = useAnimatedValue(0);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isFlipped ? 1 : 0,
      duration: FLIP_DURATION,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [animation, isFlipped]);

  const rotateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const flip = useCallback(() => {
    impact();
    onFlipChange(!isFlipped);
  }, [isFlipped, onFlipChange]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isFlipped }}
      accessibilityLabel="Flip card to show answer"
      onPress={flip}
      style={style}
    >
      <Animated.View
        style={[
          styles.card,
          { transform: [{ perspective: 1000 }, { rotateY }] },
        ]}
      >
        <Animated.View style={[styles.face, styles.front]}>
          <Text style={styles.content} numberOfLines={7}>
            {question}
          </Text>
        </Animated.View>

        <Animated.View style={[styles.face, styles.back]}>
          <Text style={[styles.content, styles.contentBack]} numberOfLines={7}>
            {answer}
          </Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    ...shadows.lg,
    backfaceVisibility: "hidden",
  },
  face: {
    ...StyleSheet.absoluteFill,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backfaceVisibility: "hidden",
  },
  front: { backgroundColor: colors.card },
  back: {
    backgroundColor: colors.card,
    transform: [{ rotateY: "180deg" }],
  },
  content: {
    ...typography.question,
    color: colors.textPrimary,
    textAlign: "center",
  },
  contentBack: {
    ...typography.answer,
    color: colors.textSecondary,
  },
});

Flashcard.displayName = "Flashcard";
export default Flashcard;
