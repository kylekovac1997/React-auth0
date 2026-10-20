import { ModeFeatures } from '@/components/mode-features';
import { Screen } from '@/components/screen';

const FEATURES = {
  simple: [
    { title: 'Scan food', body: 'Scan a barcode to add calories and nutrients from the label.' },
    { title: 'Calories', body: 'What a calorie is and how many you need each day.' },
    { title: 'Protein, carbs and fats', body: 'Each macro on its own tab, with an explanation of what it does.' },
  ],
  advanced: [
    { title: 'Scan food', body: 'Barcode lookup with serving size or exact grams.' },
    { title: 'Full breakdown', body: 'Macros, fibre, sugar and sodium per meal against your targets.' },
    { title: 'Quick add', body: 'Recent foods, favourites and copying meals from yesterday.' },
  ],
};

export default function NutritionScreen() {
  return (
    <Screen title="Nutrition">
      <ModeFeatures features={FEATURES} />
    </Screen>
  );
}
