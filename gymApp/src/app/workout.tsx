import { ModeFeatures } from '@/components/mode-features';
import { Screen } from '@/components/screen';

const FEATURES = {
  simple: [
    { title: 'Start workout', body: "Begin today's plan, or start an empty session." },
    { title: 'One exercise at a time', body: 'Pictures and step-by-step instructions for each move.' },
    { title: 'Rest timer', body: 'Counts down between sets and vibrates when it is time to go again.' },
  ],
  advanced: [
    { title: 'Set table', body: 'Sets, reps, weight and RPE, pre-filled from your last session.' },
    { title: 'Estimated 1RM and PRs', body: 'Strength estimates and personal records per lift.' },
    { title: 'Custom rest times', body: 'Rest timer set by goal, adjustable in 15 second steps.' },
  ],
};

export default function WorkoutScreen() {
  return (
    <Screen title="Workout">
      <ModeFeatures features={FEATURES} />
    </Screen>
  );
}
