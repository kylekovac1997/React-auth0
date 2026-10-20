import { ModeSwitch } from '@/components/mode-switch';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useMode } from '@/store/mode-store';

const MODE_DESCRIPTIONS = {
  simple: 'Information is spread over more screens with plain-English explanations. Great if you are new to the gym.',
  advanced: 'Denser screens with full macro breakdowns, training volume and strength numbers.',
};

export default function SettingsScreen() {
  const mode = useMode();

  return (
    <Screen title="Settings">
      <ThemedText type="smallBold">App mode</ThemedText>
      <ModeSwitch />
      <ThemedText type="small" themeColor="textSecondary">
        {MODE_DESCRIPTIONS[mode]}
      </ThemedText>
    </Screen>
  );
}
