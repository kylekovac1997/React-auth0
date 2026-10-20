import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { type LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { type AppMode, useModeStore } from '@/store/mode-store';

const OPTIONS: { value: AppMode; label: string }[] = [
  { value: 'simple', label: 'Simple' },
  { value: 'advanced', label: 'Advanced' },
];

export function ModeSwitch() {
  const theme = useTheme();
  const mode = useModeStore((state) => state.mode);
  const setMode = useModeStore((state) => state.setMode);
  const [segmentWidth, setSegmentWidth] = useState(0);

  const selectedIndex = OPTIONS.findIndex((option) => option.value === mode);

  const indicatorStyle = useAnimatedStyle(() => ({
    width: segmentWidth,
    transform: [{ translateX: withSpring(selectedIndex * segmentWidth, { damping: 18 }) }],
  }));

  function onLayout(event: LayoutChangeEvent) {
    setSegmentWidth((event.nativeEvent.layout.width - Spacing.one * 2) / OPTIONS.length);
  }

  function select(value: AppMode) {
    if (value === mode) return;
    Haptics.selectionAsync();
    setMode(value);
  }

  return (
    <View
      accessibilityRole="radiogroup"
      onLayout={onLayout}
      style={[styles.track, { backgroundColor: theme.backgroundElement }]}>
      <Animated.View style={[styles.indicator, { backgroundColor: theme.accent }, indicatorStyle]} />
      {OPTIONS.map((option) => {
        const selected = option.value === mode;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => select(option.value)}
            style={styles.segment}>
            <ThemedText
              type="smallBold"
              style={selected ? { color: theme.accentText } : { color: theme.textSecondary }}>
              {option.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    padding: Spacing.one,
    borderRadius: Spacing.four,
  },
  indicator: {
    position: 'absolute',
    top: Spacing.one,
    bottom: Spacing.one,
    left: Spacing.one,
    borderRadius: Spacing.three,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
});
