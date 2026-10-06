import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Flashcard } from "../src/components/Flashcard";
import { PrimaryButton } from "../src/components/PrimaryButton";
import { IconButton } from "../src/components/IconButton";
import { ProgressBar } from "../src/components/ProgressBar";
import { CardCounter } from "../src/components/CardCounter";
import { EmptyState } from "../src/components/EmptyState";
import { useFlashcards } from "../src/context/FlashcardContext";
import { colors, spacing, radius, typography, shadows } from "../src/theme";
import { Ionicons } from "@expo/vector-icons";
import { impact, warning } from "../src/utils/haptics";
import { useAnimatedValue } from "../src/utils/animatedCompat";

export default function HomeScreen() {
  const { cards, isLoading } = useFlashcards();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const toastAnim = useAnimatedValue(0);
  const spinAnim = useAnimatedValue(0);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [spinAnim]);

  useFocusEffect(
    useCallback(() => {
      setShowAnswer(false);
    }, [])
  );

  const total = cards.length;
  const safeIndex = total === 0 ? 0 : Math.min(currentIndex, total - 1);
  const canPrev = safeIndex > 0;
  const canNext = safeIndex < total - 1;

  const showToast = useCallback(() => {
    toastAnim.setValue(0);
    Animated.sequence([
      Animated.timing(toastAnim, {
        toValue: 1,
        duration: 150,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.delay(1200),
      Animated.timing(toastAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [toastAnim]);

  const handlePrev = () => {
    if (!canPrev) {
      warning();
      return;
    }
    setCurrentIndex((i) => i - 1);
    setShowAnswer(false);
    impact();
  };

  const handleNext = () => {
    if (canNext) {
      setCurrentIndex((i) => i + 1);
      setShowAnswer(false);
      impact();
    } else {
      showToast();
      warning();
    }
  };

  const handleManage = () => {
    impact();
    router.push("/manage");
  };

  const handleAdd = () => {
    impact();
    router.push("/add");
  };

  const progress = total === 0 ? 0 : (safeIndex + 1) / total;
  const toastTranslate = toastAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] });
  const spinRotate = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]}>
        <Animated.View style={[styles.spinner, { transform: [{ rotate: spinRotate }] }]} />
      </SafeAreaView>
    );
  }

  if (total === 0) {
    return (
      <SafeAreaView style={[styles.safe, styles.centerBg]}>
        <EmptyState onAddPress={handleAdd} />
      </SafeAreaView>
    );
  }

  const card = cards[safeIndex];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Flashcards</Text>
            <Text style={styles.subtitle}>Test your knowledge</Text>
          </View>
          <IconButton
            icon={<Ionicons name="list-outline" size={26} color={colors.textSecondary} />}
            onPress={handleManage}
            accessibilityLabel="Manage flashcards"
          />
        </View>

        <View style={styles.meta}>
          <CardCounter current={safeIndex + 1} total={total} />
          <ProgressBar progress={progress} style={styles.progress} />
        </View>

        <View style={styles.cardWrapper}>
          <Flashcard
            question={card.question}
            answer={card.answer}
            isFlipped={showAnswer}
            onFlipChange={setShowAnswer}
          />
        </View>

        <View style={styles.answerRow}>
          <PrimaryButton
            label={showAnswer ? "Hide Answer" : "Show Answer"}
            onPress={() => {
              impact();
              setShowAnswer((v) => !v);
            }}
            variant={showAnswer ? "secondary" : "primary"}
          />
        </View>

        <View style={styles.nav}>
          <PrimaryButton label="Previous" onPress={handlePrev} disabled={!canPrev} />
          <PrimaryButton label="Next" onPress={handleNext} variant={canNext ? "primary" : "secondary"} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label="Add Flashcard" onPress={handleAdd} />
      </View>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.toast,
          { opacity: toastAnim, transform: [{ translateY: toastTranslate }] },
        ]}
      >
        <Text style={styles.toastText}>You&apos;ve reached the last flashcard</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { alignItems: "center", justifyContent: "center" },
  centerBg: { backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  spinner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: colors.textTertiary,
    borderTopColor: colors.primary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  title: {
    ...typography.display,
    color: colors.textPrimary,
    fontSize: 26,
  },
  subtitle: { fontSize: 15, color: colors.textSecondary, marginTop: 2 },
  meta: { marginBottom: spacing.md, gap: spacing.sm },
  progress: { marginTop: 6 },
  cardWrapper: { marginVertical: spacing.md, flex: 1, minHeight: 220 },
  answerRow: { marginVertical: spacing.md },
  nav: { flexDirection: "row", gap: spacing.md, marginTop: spacing.md },
  footer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  toast: {
    position: "absolute",
    bottom: 90,
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: colors.textPrimary,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignSelf: "center",
    ...shadows.md,
  },
  toastText: { color: "#FFFFFF", fontSize: 13, fontWeight: "600" },
});

HomeScreen.displayName = "Home";
