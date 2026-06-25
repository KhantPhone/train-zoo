import CustomTabBar from '@/components/CustomTabBar';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="animals" />
      <Tabs.Screen name="animalsDetails" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="report" />
      <Tabs.Screen name="alarm" />
      <Tabs.Screen name="result" />
      <Tabs.Screen name="share" />
      <Tabs.Screen name="alarmSound" />
    </Tabs>
  );
}
