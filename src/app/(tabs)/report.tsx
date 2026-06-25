import { Colors, Fonts } from '@/constants/theme';
import { usePet } from '@/context/PetContext';
import { ANIMALS } from '@/data/animals';
import { REPORTS } from '@/data/reports';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import ArrowIcon from '../../../assets/images/icons/arrow-icon.svg';
import CloseIcon from '../../../assets/images/icons/close-icon.svg';
import MessageBoxSVG from '../../../assets/images/icons/mesage-box-icon.svg';
import ShareIcon from '../../../assets/images/icons/share-icon.svg';

const DUMMY_STATIONS = ['新宿駅', '渋谷駅'];

function SectionTitle({ label }: { label: string }) {
  return (
    <View style={styles.sectionTitleRow}>
      <View style={styles.sectionBar} />
      <Text style={styles.sectionLabel}>{label}</Text>
    </View>
  );
}

export default function ReportScreen() {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const { index: indexParam } = useLocalSearchParams<{ index: string }>();
  const [currentIndex, setCurrentIndex] = useState(Number(indexParam ?? 0));
  const report = REPORTS[currentIndex];
  const { activePetId, petNames } = usePet();
  const activePet = ANIMALS.find(a => a.id === activePetId) ?? ANIMALS[0];
  const Pet = activePet.Pet;
  const petName = petNames[activePetId] ?? activePet.name;
  const successCount = Math.round(report.uses * report.rate / 100);
  const displayMonth = report.month.replace('分', 'のレポート');
  const canGoPrev = currentIndex < REPORTS.length - 1;
  const canGoNext = currentIndex > 0;
  const bubbleW = screenWidth - 40;
  const bubbleH = Math.round(bubbleW * (145 / 354));
  const bodyH = Math.round(bubbleW * (128 / 354));

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
          <Text style={styles.headerTitle}>レポート</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.navigate('/(tabs)/profile')}
            hitSlop={8}
          >
            <CloseIcon width={18} height={18} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: Math.max(insets.bottom, 16) + 100 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Month navigation */}
          <View style={styles.monthRow}>
            <TouchableOpacity hitSlop={8} onPress={() => canGoPrev && setCurrentIndex(i => i + 1)} style={{ opacity: canGoPrev ? 1 : 0.25 }}>
              <ArrowIcon width={20} height={20} style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>{displayMonth}</Text>
            <TouchableOpacity hitSlop={8} onPress={() => canGoNext && setCurrentIndex(i => i - 1)} style={{ opacity: canGoNext ? 1 : 0.25 }}>
              <ArrowIcon width={20} height={20} />
            </TouchableOpacity>
          </View>
          <View style={styles.monthDivider} />

          {/* 今月の一言 */}
          <View style={{ width: bubbleW, height: bubbleH }}>
            <MessageBoxSVG width={bubbleW} height={bubbleH} preserveAspectRatio="none" />
            <View style={[StyleSheet.absoluteFill, { height: bodyH, alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 24,}]}>
              <Text style={styles.messageLabel}>今月の一言</Text>
              <Text style={styles.messageText}>
                今月もよくがんばったね！{'\n'}たくさん一緒に旅ができたよ
              </Text>
            </View>
          </View>

          {/* 一番長く一緒にいた相棒 */}
          <View style={styles.companionCard}>
            <Image
              source={require('../../../assets/images/icons/paw_bg.png')}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
            <SectionTitle label="一番長く一緒にいた相棒" />
            <View style={styles.companionRow}>
              <View style={styles.companionCircle}>
                <Pet width={70} height={70} />
              </View>
              <View style={styles.companionInfo}>
                <Text style={styles.companionName}>{petName}</Text>
                <Text style={styles.companionSub}>{report.uses}回一緒に乗車</Text>
              </View>
            </View>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>利用回数</Text>
              <View style={styles.statNumberRow}>
                <Text style={[styles.statNumber, { color: Colors.light.text }]}>{report.uses}</Text>
                <Text style={[styles.statUnit, { color: Colors.light.text }]}>回</Text>
              </View>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>成功回数</Text>
              <View style={styles.statNumberRow}>
                <Text style={styles.statNumber}>{successCount}</Text>
                <Text style={styles.statUnit}>回</Text>
              </View>
            </View>
          </View>

          {/* 最も使用した駅 */}
          <View style={styles.stationsCard}>
            <SectionTitle label="最も使用した駅" />
            {DUMMY_STATIONS.map((station, i) => (
              <View key={i} style={styles.stationRow}>
                <View style={styles.stationBadge}>
                  <Text style={styles.stationBadgeText}>{i + 1}</Text>
                </View>
                <Text style={styles.stationName}>{station}</Text>
              </View>
            ))}
          </View>

          {/* SNS share */}
          <TouchableOpacity style={styles.shareButton} activeOpacity={0.85} onPress={() => router.navigate({ pathname: '/(tabs)/share', params: { index: currentIndex } })}>
            <ShareIcon width={24} height={24} />
            <Text style={styles.shareText}>SNSにシェアする</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.light.backgroundSelected,
    paddingHorizontal: 20,
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
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    padding: 20,
    gap: 16,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  monthTitle: {
    fontSize: 23,
    fontFamily: Fonts.display,
    fontWeight: '700',
    color: Colors.light.text,
  },
  monthDivider: {
    borderTopWidth: 1.5,
    borderTopColor: Colors.light.backgroundSelected,
    borderStyle: 'dashed',
    marginTop: 4,
  },
  messageLabel: {
    fontSize: 12,
    fontFamily: Fonts.display,
    color: '#888',
  },
  messageText: {
    fontSize: 16,
    fontFamily: Fonts.display,
    color: Colors.light.text,
    lineHeight: 28,
    textAlign: 'center',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionBar: {
    width: 9,
    height: 18,
    backgroundColor: Colors.light.backgroundSelected,
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: Fonts.display,
    fontWeight: '700',
    color: Colors.light.text,
  },
  companionCard: {
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
    gap: 12,
  },
  companionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  companionCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  companionInfo: {
    gap: 4,
  },
  companionName: {
    fontSize: 36,
    fontFamily: Fonts.display,
    fontWeight: '700',
    color: Colors.light.backgroundSelected,
  },
  companionSub: {
    fontSize: 14,
    fontFamily: Fonts.display,
    color: '#666',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F5F4ED',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
  },
  statNumberRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: Fonts.display,
    color: '#3F3F3F',
  },
  statNumber: {
    fontSize: 30,
    fontFamily: Fonts.display,
    fontWeight: '700',
    color: Colors.light.backgroundSelected,
  },
  statUnit: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.light.text,
  },
  stationsCard: {
    backgroundColor: '#F5F4ED',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 14,
  },
  stationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stationBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F1DCC3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stationBadgeText: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: '700',
    fontFamily: Fonts.display,
  },
  stationName: {
    fontSize: 16,
    fontFamily: Fonts.display,
    fontWeight: '600',
    color: Colors.light.text,
  },
  shareButton: {
    backgroundColor: '#FFCC8D',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 4,
  },
  shareText: {
    fontSize: 16,
    fontFamily: Fonts.display,
    fontWeight: '700',
    color: Colors.light.text,
  },

});
