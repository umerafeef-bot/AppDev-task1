import { Animated, StyleSheet, View } from "react-native";
import { useCallback, useState } from "react";
import { FormField } from "./FormField";
import { PrimaryButton } from "./PrimaryButton";
import { colors } from "../theme";
import { validateFlashcardField } from "../utils/validation";
import { error as errorHaptics } from "../utils/haptics";
import { useAnimatedValue } from "../utils/animatedCompat";

interface Props {
  initialQuestion?: string;
  initialAnswer?: string;
  submitLabel: string;
  onSubmit: (values: { question: string; answer: string }) => void;
  loading?: boolean;
}

export function FlashcardForm({
  initialQuestion = "",
  initialAnswer = "",
  submitLabel,
  onSubmit,
  loading = false,
}: Props) {
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState(initialAnswer);
  const [errors, setErrors] = useState<{ question?: string; answer?: string }>({});
  const shakeAnim = useAnimatedValue(0);

  const shake = useCallback(() => {
    shakeAnim.setValue(0);
    Animated.sequence([
      ...Array.from({ length: 4 }).flatMap(() => [
        Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      ]),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }, [shakeAnim]);

  const handleSave = () => {
    const qRes = validateFlashcardField(question, "question");
    const aRes = validateFlashcardField(answer, "answer");

    if (!qRes.valid || !aRes.valid) {
      setErrors({ question: qRes.message, answer: aRes.message });
      shake();
      errorHaptics();
      return;
    }

    setErrors({});
    onSubmit({ question: question.trim(), answer: answer.trim() });
  };

  return (
    <View style={styles.form}>
      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
        <FormField
          label="Question"
          placeholder="Enter the question"
          multiline
          numberOfLines={3}
          value={question}
          onChangeText={setQuestion}
          error={errors.question}
          textAlignVertical="top"
          style={styles.input}
        />
        <FormField
          label="Answer"
          placeholder="Enter the answer"
          multiline
          numberOfLines={5}
          value={answer}
          onChangeText={setAnswer}
          error={errors.answer}
          textAlignVertical="top"
          style={styles.input}
        />
      </Animated.View>
      <PrimaryButton label={submitLabel} onPress={handleSave} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { flex: 1, justifyContent: "space-between" },
  input: {
    minHeight: 0,
    paddingTop: 6,
    fontSize: 17,
    fontWeight: "400" as const,
    color: colors.textPrimary,
  },
});
