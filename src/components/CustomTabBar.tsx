import { Fonts } from '@/constants/theme';
import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';
import { ComponentProps } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeIcon from '../../assets/images/icons/home-icon.svg';
import ProfileIcon from '../../assets/images/icons/profile-icon.svg';
import SavedIcon from '../../assets/images/icons/saved-icon.svg';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

const TAB_ICONS = {
  home: HomeIcon,
  animals: SavedIcon,
  profile: ProfileIcon,
};

const TAB_LABELS: Record<string, string> = {
  home: 'ホーム',
  animals: '図鑑',
  profile: 'プロフィール',
};

const ROUTE_PARENT: Record<string, string> = {
  animalsDetails: 'animals',
  report: 'profile',
  alarm: 'home',
  result: 'home',
  share: 'profile',
  alarmSound: 'home',
};

export default function CustomTabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const focusedName = state.routes[state.index]?.name;
  const activeTab = ROUTE_PARENT[focusedName] ?? focusedName;

  if (focusedName === 'alarm' || focusedName === 'result' || focusedName === 'share' || focusedName === 'alarmSound') return null;

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      <View style={[styles.navbar, { marginBottom: Math.max(insets.bottom, 16) }]} pointerEvents="box-none">
        {state.routes.filter(route => route.name in TAB_ICONS).map((route) => {
          const isFocused = route.name === activeTab;
          const Icon = TAB_ICONS[route.name as keyof typeof TAB_ICONS];

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity key={route.key} style={styles.navItem} onPress={onPress} activeOpacity={0.7}>
              <View style={isFocused ? styles.navIconActive : styles.navIconWrapper}>
                {Icon && <Icon width={24} height={24} />}
              </View>
              <Text style={isFocused ? styles.navLabelActive : styles.navLabel}>
                {TAB_LABELS[route.name]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom:-10,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 40,
    marginHorizontal: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  navIconWrapper: {
    borderRadius: 30,
    padding: 10,
  },
  navIconActive: {
    backgroundColor: '#DFF4ED',
    borderRadius: 30,
    padding: 10,
  },
  navLabel: {
    fontSize: 12,
    color: '#aaaaaa',
    fontFamily: Fonts.sans,
  },
  navLabelActive: {
    fontSize: 12,
    color: '#5DCAA5',
    fontFamily: Fonts.sans,
  },
});
