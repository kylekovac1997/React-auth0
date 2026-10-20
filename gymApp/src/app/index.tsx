import { ModeFeatures } from '@/components/mode-features';
import { Screen } from '@/components/screen';

const FEATURES = {
  simple: [
    { title: 'Your body', body: 'A 3D model of you, built from the stats you enter when you sign up.' },
    { title: "Today's workout", body: 'One card showing what to train today. Tap it to start.' },
    { title: 'Calories left', body: 'A single ring showing how much you can still eat today.' },
  ],
  advanced: [
    { title: 'Body and goal', body: 'Your 3D model with the goal body overlaid and a weekly muscle heatmap.' },
    { title: 'Training load', body: 'Sets per muscle group this week against your targets.' },
    { title: 'Macros', body: 'Protein, carbs and fat remaining, with a calorie trend.' },
  ],
};

export default function HomeScreen() {
  return (
    <Screen title="Home">
      <ModeFeatures features={FEATURES} />
    </Screen>
  );
}
