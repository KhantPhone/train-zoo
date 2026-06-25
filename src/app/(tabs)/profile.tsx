import { Colors, Fonts } from '@/constants/theme';
import { usePet } from '@/context/PetContext';
import { ANIMALS } from '@/data/animals';
import React, { useRef, useState } from 'react';
import { router } from 'expo-router';
import { Animated, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { REPORTS } from '@/data/reports';

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import PenIcon from '../../../assets/images/icons/pen-icon.svg';
import RightArrow from '../../../assets/images/icons/arrow-icon.svg';
import DownArrowWhite from '../../../assets/images/icons/down-arrow-white.svg';

const STATS = [
  { label: '下車に成功した回数', number: '98',   unit: '回' },
  { label: '最高連続記録',       number: '123',  unit: '日' },
  { label: '総移動距離',         number: '1090', unit: 'km' },
];


function SectionTitle({ label }: { label: string }) {
  return (
    <View style={styles.sectionTitleRow}>
      <View style={styles.sectionBar} />
      <Text style={styles.sectionLabel}>{label}</Text>
    </View>
  );
}

const INITIAL_REPORT_COUNT = 3;

export default function ProfileScreen() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { activePetId, userName, setUserName } = usePet();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(userName);
  const [showAllReports, setShowAllReports] = useState(false);
  const extraFade = useRef(new Animated.Value(0)).current;
  const extraSlide = useRef(new Animated.Value(-12)).current;
  const inputRef = useRef<TextInput>(null);

  const toggleReports = () => {
    if (!showAllReports) {
      setShowAllReports(true);
      extraFade.setValue(0);
      extraSlide.setValue(-12);
      Animated.parallel([
        Animated.timing(extraFade, { toValue: 1, duration: 280, useNativeDriver: true }),
        Animated.timing(extraSlide, { toValue: 0, duration: 280, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(extraFade, { toValue: 0, duration: 220, useNativeDriver: true }),
        Animated.timing(extraSlide, { toValue: -12, duration: 220, useNativeDriver: true }),
      ]).start(() => setShowAllReports(false));
    }
  };
  const activePet = ANIMALS.find(a => a.id === activePetId) ?? ANIMALS[0];
  const Pet = activePet.Pet;

  return (
    <View style={styles.root}>
      <Image
        source={require('../../../assets/images/icons/paw_bg.png')}
        style={[StyleSheet.absoluteFill, { width, height }]}
        resizeMode="cover"
      />
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
          <Text style={styles.headerTitle}>プロフィール</Text>
        </View>

        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: Math.max(insets.bottom, 16) + 100 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* User info */}
          <SectionTitle label="ユーザー情報" />
          <View style={styles.userCard}>
            <View style={styles.petCircle}>
              <Pet width={64} height={64} />
            </View>
            <View style={styles.userNameRow}>
              {editing ? (
                <TextInput
                  ref={inputRef}
                  style={styles.userNameInput}
                  value={draft}
                  onChangeText={setDraft}
                  onSubmitEditing={() => { setUserName(draft); setEditing(false); }}
                  onBlur={() => { setUserName(draft); setEditing(false); }}
                  autoFocus
                  returnKeyType="done"
                />
              ) : (
                <Text style={styles.userName}>{userName}</Text>
              )}
              <TouchableOpacity hitSlop={8} onPress={() => { setDraft(userName); setEditing(true); }}>
                <PenIcon width={16} height={16} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats + Reports white container */}
          <View style={styles.whiteContainer}>
            <SectionTitle label="記録" />
            <View style={styles.statsCard}>
              {STATS.map((stat, i) => (
                <View key={i} style={styles.statRow}>
                  <View style={styles.statPill}>
                    <Text style={styles.statPillText}>{stat.label}</Text>
                  </View>
                  <View style={styles.statValueWrapper}>
                    <Text style={styles.statValue}>
                      {stat.number}<Text style={styles.statUnit}> {stat.unit}</Text>
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.divider} />

            <SectionTitle label="過去のレポート" />
            {REPORTS.slice(0, INITIAL_REPORT_COUNT).map((report, i) => (
              <TouchableOpacity key={i} style={[styles.reportCard, i === 0 && { marginTop: 10 }]} activeOpacity={0.8} onPress={() => router.push({ pathname: '/(tabs)/report', params: { index: i } })}>
                <View style={styles.reportInfo}>
                  <Text style={styles.reportMonth}>{report.month}</Text>
                  <Text style={styles.reportSub}>利用：{report.uses}回　成功率：{report.rate}%</Text>
                </View>
                <RightArrow width={16} height={16} />
              </TouchableOpacity>
            ))}
            {showAllReports && (
              <Animated.View style={{ opacity: extraFade, transform: [{ translateY: extraSlide }], gap: 12 }}>
                {REPORTS.slice(INITIAL_REPORT_COUNT).map((report, i) => (
                  <TouchableOpacity key={i} style={styles.reportCard} activeOpacity={0.8} onPress={() => router.push({ pathname: '/(tabs)/report', params: { index: INITIAL_REPORT_COUNT + i } })}>
                    <View style={styles.reportInfo}>
                      <Text style={styles.reportMonth}>{report.month}</Text>
                      <Text style={styles.reportSub}>利用：{report.uses}回　成功率：{report.rate}%</Text>
                    </View>
                    <RightArrow width={16} height={16} />
                  </TouchableOpacity>
                ))}
              </Animated.View>
            )}
            {REPORTS.length > INITIAL_REPORT_COUNT && (
              <TouchableOpacity style={styles.seeMoreBtn} activeOpacity={0.8} onPress={toggleReports}>
                <Text style={styles.seeMoreText}>{showAllReports ? '閉じる' : 'もっと見る'}</Text>
                <DownArrowWhite width={14} height={14} style={{ transform: [{ rotate: showAllReports ? '180deg' : '0deg' }] }} />
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
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
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: Fonts.display,
    color: '#fff',
    fontWeight: '700',
  },
  scroll: {
    padding: 20,
    paddingBottom: 32,
    gap: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 4,
  },
  sectionBar: {
    width: 9,
    height: 18,
    backgroundColor: Colors.light.backgroundSelected,
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: Fonts.display,
    fontWeight: '700',
    color: Colors.light.text,
  },
  petCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 16,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 18,
    fontFamily: Fonts.display,
    fontWeight: '700',
    color: Colors.light.text,
  },
  userNameInput: {
    fontSize: 18,
    fontFamily: Fonts.display,
    fontWeight: '700',
    color: Colors.light.text,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.light.backgroundSelected,
    minWidth: 120,
    paddingVertical: 2,
  },
  whiteContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
    gap: 12,
    marginHorizontal: -20,
  },
  statsCard: {
    paddingHorizontal: 4,
    paddingVertical: 4,
    gap: 11,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 35,
  },
  statPill: {
    backgroundColor: '#D4EDE6',
    borderRadius: 20,
    width: 188,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statPillText: { 
    fontSize: 15,
    fontFamily: Fonts.display,
    color: Colors.light.text,
    fontWeight: '400',
  },
  statValueWrapper: {
    width: 90,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 15,
    fontFamily: Fonts.display,
    fontWeight: '700',
    color: Colors.light.text,
  },
  statUnit: {
    fontSize: 12,
    fontFamily: Fonts.display,
    fontWeight: '400',
    color: Colors.light.text,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 20,
  },
  reportCard: {
    backgroundColor: '#D4EDE6',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reportInfo: {
    gap: 4,
  },
  reportMonth: {
    fontSize: 18,
    fontFamily: Fonts.display,
    fontWeight: '700',
    color: Colors.light.text,
  },
  reportSub: {
    fontSize: 15,
    fontFamily: Fonts.sans,
    color: '#888',
  },
  seeMoreBtn: {
    backgroundColor: Colors.light.backgroundSelected,
    borderRadius: 30,
    paddingVertical: 13,
    paddingHorizontal: 33,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'center',
    marginTop: 20,
    minWidth: 160,
  },
  seeMoreText: {
    fontSize: 15,
    fontFamily: Fonts.display,
    fontWeight: '700',
    color: '#ffffff',
  },
});
