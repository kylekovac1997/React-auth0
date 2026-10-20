import { FeatureCard } from '@/components/feature-card';
import { type AppMode, useMode } from '@/store/mode-store';

type Feature = { title: string; body: string };

type ModeFeaturesProps = {
  features: Record<AppMode, Feature[]>;
};

/** Lists the cards for whichever mode is active, replaying the entrance animation on a mode change. */
export function ModeFeatures({ features }: ModeFeaturesProps) {
  const mode = useMode();

  return features[mode].map((feature, index) => (
    <FeatureCard key={`${mode}-${feature.title}`} index={index} {...feature} />
  ));
}
