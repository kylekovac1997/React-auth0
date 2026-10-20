import { ModeFeatures } from '@/components/mode-features';
import { Screen } from '@/components/screen';

const FEATURES = {
  simple: [
    { title: 'Weight trend', body: 'Your weight over time and whether you are on track.' },
    { title: 'Weigh-in reminders', body: 'A reminder on the schedule you choose.' },
    { title: 'Coach tip', body: 'One clear thing to do next to reach your goal.' },
  ],
  advanced: [
    { title: 'Weight and measurements', body: '7-day moving average with body measurements.' },
    { title: 'Volume and PRs', body: 'Training volume and personal records over time.' },
    { title: 'Coach', body: 'Advice with the numbers behind it: rate of change, adherence and volume.' },
  ],
};

export default function ProgressScreen() {
  return (
    <Screen title="Progress">
      <ModeFeatures features={FEATURES} />
    </Screen>
  );
}
