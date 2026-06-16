import { Colors, Fonts } from '@/constants/theme';
import { router } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AlarmIcon from '../../assets/images/icons/alarm-icon.svg';
import HomeIcon from '../../assets/images/icons/home-icon.svg';
import PawBg from '../../assets/images/icons/paw_bg.svg';
import ProfileIcon from '../../assets/images/icons/profile-icon.svg';
import SavedIcon from '../../assets/images/icons/saved-icon.svg';

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>ホーム</Text>
        </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Paw background - scoped to content area only */}
        <View style={[StyleSheet.absoluteFillObject, { opacity: 1 }]}>
          <PawBg width={width} height={height} />
        </View>
        {/* Greeting */}
        <View style={styles.greetingRow}>
          <Text style={styles.greetingText}>おはよう、</Text>
          <Text style={styles.greetingName}>ポン</Text>
          <Text style={styles.greetingText}>！</Text>
        </View>

        {/* Dog image */}
        <View style={styles.dogCircle}>
          <Image source={require('../../assets/images/pets/dog.png')} style={styles.dogImage} resizeMode="contain" />
        </View>

        {/* Station dropdown */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>降車駅</Text>
          <View style={styles.dropdown}>
            <Text style={styles.dropdownValue}>新宿駅</Text>
            <Image source={require('../../assets/images/icons/down-icon.png')} style={{ width: 16, height: 16 }} resizeMode="contain" />
          </View>
        </View>

        {/* Alarm button */}
        <TouchableOpacity style={styles.alarmButton}>
          <View style={styles.alarmContent}>
            <Text style={styles.alarmText}>アラームON</Text>
            <AlarmIcon width={20} height={20} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Bottom nav */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/home')}>
          <View style={styles.navIconActive}>
            <HomeIcon width={24} height={24} />
          </View>
          <Text style={styles.navLabelActive}>ホーム</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/animals')}>
          <View style={styles.navIconWrapper}>
            <SavedIcon width={24} height={24} />
          </View>
          <Text style={styles.navLabel}>図鑑</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/profile')}>
          <View style={styles.navIconWrapper}>
            <ProfileIcon width={24} height={24} />
          </View>
          <Text style={styles.navLabel}>プロフィール</Text>
        </TouchableOpacity>
      </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.light.backgroundSelected,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: Fonts.display,
    color: '#fff',
    fontWeight: '700',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 20,
    overflow: 'hidden',
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  greetingText: {
    fontSize: 22,
    fontFamily: Fonts.display,
    color: Colors.light.text,
  },
  greetingName: {
    fontSize: 32,
    fontFamily: Fonts.display,
    color: '#5DCAA5',
    fontWeight: '700',
  },
  dogCircle: {
    width: 230,
    height: 230,
    borderRadius: 130,
    backgroundColor: '#ffffff', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  dogImage: {
    width: 216,
    height: 216,
  },
  dropdownContainer: {
    alignSelf: 'stretch',
    gap: 6,
  },
  dropdownLabel: {
    fontSize: 13,
    color: Colors.light.text,
    fontFamily: Fonts.sans,
  },
  dropdown: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownValue: {
    fontSize: 16,
    fontFamily: Fonts.sans,
    color: Colors.light.text,
  },
  alarmButton: {
    backgroundColor: '#5DCAA5',
    borderRadius: 16,
    paddingVertical: 16,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  alarmContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alarmText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: Fonts.sans,
    fontWeight: '700',
  },
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 40,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
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
    fontSize: 11,
    color: '#aaaaaa',
    fontFamily: Fonts.sans,
  },
  navLabelActive: {
    fontSize: 11,
    color: '#5DCAA5',
    fontFamily: Fonts.sans,
  },
});