
import { Colors, Fonts } from '@/constants/theme';
import { usePet } from '@/context/PetContext';
import { ANIMALS } from '@/data/animals';
import * as Haptics from 'expo-haptics';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { Animated, Image, KeyboardAvoidingView, Modal, PanResponder, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AlarmSvg from '../../../assets/images/icons/alarm.svg';
import AlarmIcon from '../../../assets/images/icons/alarm-icon.svg';
import CheckIcon from '../../../assets/images/icons/check-icon.svg';
import CloseIcon from '../../../assets/images/icons/close-icon.svg';
import DownIcon from '../../../assets/images/icons/down-icon.svg';
import PenGreenIcon from '../../../assets/images/icons/pen-icon-green.svg';
import PenIcon from '../../../assets/images/icons/pen-icon.svg';

const PET_MESSAGE = '今日も頑張りましょう！';

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { activePetId, userName } = usePet();
  const activePet = ANIMALS.find(a => a.id === activePetId) ?? ANIMALS[0];
  const Pet = activePet.Pet;

  const [showNotif, setShowNotif] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showStationSheet, setShowStationSheet] = useState(false);
  const [station, setStation] = useState('新宿駅');
  const [stationDraft, setStationDraft] = useState('');
  const stationInputRef = useRef<TextInput>(null);

  const slideY = useRef(new Animated.Value(-140)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    Animated.parallel([
      Animated.timing(slideY, { toValue: -140, duration: 300, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => {
      setShowNotif(false);
      panY.setValue(0);
      slideY.setValue(-140);
      opacity.setValue(0);
    });
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5 && g.dy < 0,
      onPanResponderMove: (_, g) => { if (g.dy < 0) panY.setValue(g.dy); },
      onPanResponderRelease: (_, g) => {
        if (g.dy < -40 || g.vy < -0.5) {
          dismiss();
        } else {
          Animated.spring(panY, { toValue: 0, useNativeDriver: true, friction: 6 }).start();
        }
      },
    })
  ).current;

  useFocusEffect(
    useCallback(() => {
      slideY.setValue(-140);
      opacity.setValue(0);
      panY.setValue(0);
      setShowNotif(true);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Animated.parallel([
        Animated.spring(slideY, { toValue: 0, useNativeDriver: true, friction: 8, tension: 70 }),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start(() => {
        dismissTimer.current = setTimeout(() => dismiss(), 30000);
      });

      return () => {
        if (dismissTimer.current) clearTimeout(dismissTimer.current);
        setDropdownOpen(false);
      };
    }, [userName, activePetId])
  );

  const openDropdown = () => setDropdownOpen(true);
  const closeDropdown = () => setDropdownOpen(false);

  const openStationSheet = () => {
    setStationDraft('');
    setShowStationSheet(true);
    setTimeout(() => stationInputRef.current?.focus(), 200);
  };

  const closeStationSheet = () => {
    setShowStationSheet(false);
    setStationDraft('');
  };

  const confirmStation = () => {
    const trimmed = stationDraft.trim();
    if (trimmed) setStation(trimmed);
    closeStationSheet();
    closeDropdown();
  };

  return (
    <View style={styles.root}>
      <Image source={require('../../../assets/images/icons/paw_bg.png')} style={[StyleSheet.absoluteFill, { width, height }]} resizeMode="cover" />
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
          <Text style={styles.headerTitle}>ホーム</Text>
          <TouchableOpacity onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.navigate('/(tabs)/alarmSound'); }} hitSlop={8}>
            <AlarmSvg width={24} height={26} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={[styles.content, { paddingBottom: insets.bottom + 70 }]}>
          <View style={styles.greetingRow}>
            <Text style={styles.greetingText}>おはよう、</Text>
            <Text style={styles.greetingName}>{userName}</Text>
            <Text style={[styles.greetingName, { color: Colors.light.text }]}> !</Text>
          </View>

          <View style={styles.dogCircle}>
            <Pet width={200} height={200} />
          </View>

          {/* Station dropdown */}
          <View style={styles.stationContainer}>
            <Text style={styles.stationLabel}>降車駅</Text>
            <TouchableOpacity
              style={[styles.stationRow, dropdownOpen && styles.stationRowOpen]}
              activeOpacity={0.9}
              onPress={dropdownOpen ? closeDropdown : openDropdown}
            >
              <Text style={styles.stationValue}>{station}</Text>
              <View style={{ transform: [{ rotate: dropdownOpen ? '180deg' : '0deg' }] }}>
                <DownIcon width={20} height={20} color={dropdownOpen ? Colors.light.backgroundSelected : '#aaa'} />
              </View>
            </TouchableOpacity>

            {dropdownOpen && (
              <TouchableOpacity style={styles.searchRow} activeOpacity={0.8} onPress={openStationSheet}>
                <Text style={styles.searchPlaceholder}>駅名を入力</Text>
                <PenIcon width={18} height={18} />
              </TouchableOpacity>
            )}
          </View>
          {/* Invisible overlay to close dropdown when tapping outside */}
          {dropdownOpen && (
            <TouchableOpacity style={styles.dropdownBackdrop} activeOpacity={1} onPress={closeDropdown} />
          )}

          <TouchableOpacity
            style={styles.alarmButton}
            activeOpacity={0.82}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.navigate('/(tabs)/alarm'); }}
          >
            <View style={styles.alarmContent}>
              <Text style={styles.alarmText}>アラームON</Text>
              <AlarmIcon width={20} height={20} />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Station input bottom sheet */}
      <Modal visible={showStationSheet} transparent animationType="slide">
        <KeyboardAvoidingView style={styles.sheetOuter} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TouchableOpacity style={styles.sheetBackdrop} activeOpacity={1} onPress={closeStationSheet} />
          <View style={[styles.sheetCard, { paddingBottom: insets.bottom + 24 }]}>
            <View style={styles.sheetHeaderRow}>
              <TouchableOpacity style={styles.sheetCloseBtn} activeOpacity={0.7} onPress={closeStationSheet}>
                <CloseIcon width={18} height={18} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.sheetConfirmBtn} activeOpacity={0.8} onPress={confirmStation}>
                <CheckIcon width={22} height={22} />
              </TouchableOpacity>
            </View>
            <View style={styles.sheetTitleBlock}>
              <PenGreenIcon width={36} height={36} />
              <Text style={styles.sheetTitle}>降車駅を入力</Text>
            </View>
            <TextInput
              ref={stationInputRef}
              style={styles.sheetInput}
              placeholder="降車駅を入力"
              placeholderTextColor="#bbb"
              value={stationDraft}
              onChangeText={setStationDraft}
              onSubmitEditing={confirmStation}
              returnKeyType="done"
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Notification banner */}
      {showNotif && (
        <Animated.View
          style={[
            styles.notifWrapper,
            {
              top: insets.top + 64,
              transform: [{ translateY: Animated.add(slideY, panY) }],
              opacity,
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.notifBody}>
            <View style={styles.notifPetCircle}>
              <Pet width={38} height={38} />
            </View>
            <View style={styles.notifTextBlock}>
              <Text style={styles.notifTitle}>
                おかえり、<Text style={styles.notifTitleName}>{userName}</Text>
              </Text>
              <Text style={styles.notifSub}>{PET_MESSAGE}</Text>
            </View>
          </View>
          <View style={styles.swipeBar} />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.light.background },
  container: { flex: 1 },
  header: {
    backgroundColor: Colors.light.backgroundSelected,
    paddingLeft: 20,
    paddingRight: 35,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    paddingHorizontal: 24,
    justifyContent: 'center',
    gap: 20,
    overflow: 'hidden',
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  greetingText: {
    fontSize: 24,
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
    marginTop: 20,
  },
  stationContainer: { alignSelf: 'stretch' },
  stationLabel: { fontSize: 16, color: Colors.light.text, fontFamily: Fonts.sans, marginBottom: 6 },
  stationRow: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#DFF4ED',
    paddingHorizontal: 16,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stationRowOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  stationValue: { fontSize: 20, fontFamily: Fonts.sans, color: Colors.light.text },
  searchRow: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: Colors.light.backgroundElement,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  dropdownBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 17,
    fontWeight: '500',
    fontFamily: Fonts.sans,
    color: '#3f3f3f',
  },
  sheetOuter: { flex: 1, justifyContent: 'flex-end' },
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheetCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
    paddingHorizontal: 24,
    gap: 20,
  },
  sheetHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sheetCloseBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center',
  },
  sheetConfirmBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.light.backgroundSelected, alignItems: 'center', justifyContent: 'center',
  },
  sheetTitleBlock: { alignItems: 'center', gap: 10 },
  sheetTitle: { fontSize: 20, fontFamily: Fonts.display, fontWeight: '700', color: Colors.light.text },
  sheetInput: {
    borderWidth: 1.5, borderColor: '#ddd', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 16, fontFamily: Fonts.sans, color: Colors.light.text,
  },
  alarmButton: {
    backgroundColor: '#5DCAA5',
    borderRadius: 20,
    paddingVertical: 20,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  alarmContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  alarmText: { color: '#ffffff', fontSize: 20, fontFamily: Fonts.sans, fontWeight: '700' },

  // Notification
  notifWrapper: {
    position: 'absolute',
    left: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  notifBody: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  notifPetCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.light.backgroundElement,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifTextBlock: { flex: 1, gap: 3 },
  notifTitle: {
    fontSize: 16,
    fontFamily: Fonts.display,
    fontWeight: '700',
    color: Colors.light.text,
  },
  notifTitleName: {
    fontSize: 20,
    fontFamily: Fonts.display,
    fontWeight: '700',
    color: '#5DCAA5',
  },
  notifSub: { fontSize: 12, fontFamily: Fonts.sans, color: '#666' },
  swipeBar: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ddd',
  },
});
