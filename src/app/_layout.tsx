import { Stack } from 'expo-router';
import { RocknRollOne_400Regular } from '@expo-google-fonts/rocknroll-one';
import {
  ZenMaruGothic_300Light,
  ZenMaruGothic_400Regular,
  ZenMaruGothic_500Medium,
  ZenMaruGothic_700Bold,
  ZenMaruGothic_900Black,
} from '@expo-google-fonts/zen-maru-gothic';
import { useFonts } from 'expo-font';
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

  return <Stack screenOptions={{ headerShown: false }} />;
}