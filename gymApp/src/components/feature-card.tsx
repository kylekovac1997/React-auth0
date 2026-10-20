import { StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type FeatureCardProps = {
  title: string;
  body: string;
  /** Position in the list, used to stagger the entrance animation. */
  index?: number;
};

export function FeatureCard({ title, body, index = 0 }: FeatureCardProps) {
  const theme = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).springify()}
      style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
      <ThemedText type="smallBold">{title}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {body}
      </ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.one,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
});
