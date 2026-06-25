import { RocknRollOne_400Regular } from '@expo-google-fonts/rocknroll-one';
import {
  ZenMaruGothic_300Light,
  ZenMaruGothic_400Regular,
  ZenMaruGothic_500Medium,
  ZenMaruGothic_700Bold,
  ZenMaruGothic_900Black,
} from '@expo-google-fonts/zen-maru-gothic';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { PetProvider } from '../context/PetContext';
import '../global.css';

export default function RootLayout() {
  const [loaded] = useFonts({
    'RocknRoll One': RocknRollOne_400Regular,
    'ZenMaruGothic-Light': ZenMaruGothic_300Light,
    'Zen Maru Gothic': ZenMaruGothic_400Regular,
    'ZenMaruGothic-Regular': ZenMaruGothic_400Regular,
    'ZenMaruGothic-Medium': ZenMaruGothic_500Medium,
    'ZenMaruGothic-Bold': ZenMaruGothic_700Bold,
    'ZenMaruGothic-Black': ZenMaruGothic_900Black,
  });

  if (!loaded) return null;

  return (
    <PetProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'none' }} />
    </PetProvider>
  );
}
