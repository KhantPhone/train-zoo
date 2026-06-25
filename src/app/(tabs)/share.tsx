import { Colors, Fonts } from '@/constants/theme';
import { usePet } from '@/context/PetContext';
import { ANIMALS } from '@/data/animals';
import { REPORTS } from '@/data/reports';
import * as MediaLibrary from 'expo-media-library';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, Image, Linking, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import BarIcon from '../../../assets/images/icons/bar.svg';
import CloseIcon from '../../../assets/images/icons/close-black.svg';
import DownloadIcon from '../../../assets/images/icons/download.svg';
import FbIcon from '../../../assets/images/icons/fb.svg';
import InstaIcon from '../../../assets/images/icons/insta.svg';
import LineIcon from '../../../assets/images/icons/line.svg';
import MessageBoxSVG from '../../../assets/images/icons/mesage-box-icon.svg';
import ReportLogo from '../../../assets/images/icons/report-logo.svg';
import TwitterIcon from '../../../assets/images/icons/twitter.svg';

const DUMMY_STATIONS = ['新宿駅', '渋谷駅'];

export default function ShareScreen() {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  // cardWrapper(16) + cardOuter(10) + cardInner(16) each side = 84 total
  const bubbleW = screenWidth - 84;
  const bubbleH = Math.round(bubbleW * (145 / 354));
  const bodyH = Math.round(bubbleW * (128 / 354));
  const { index: indexParam } = useLocalSearchParams<{ index: string }>();
  const report = REPORTS[Number(indexParam ?? 0)];
  const { activePetId, petNames, userName } = usePet();
  const activePet = ANIMALS.find(a => a.id === activePetId) ?? ANIMALS[0];
  const Pet = activePet.Pet;
  const petName = petNames[activePetId] ?? activePet.name;
  const successCount = Math.round(report.uses * report.rate / 100);
  const displayMonth = report.month.replace('分', 'のレポート');

  const cardRef = useRef<View>(null);
  const [busy, setBusy] = useState(false);
  const [showSheet] = useState(true);

  const capture = (): Promise<string> =>
    new Promise((resolve, reject) =>
      setTimeout(async () => {
        try {
          const uri = await captureRef(cardRef, { format: 'png', quality: 1, result: 'tmpfile' });
          resolve(uri);
        } catch (e) { reject(e); }
      }, 150)
    );

  const requestLibraryPermission = async (): Promise<boolean> => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('権限が必要です', '写真ライブラリへのアクセスを許可してください。');
      return false;
    }
    return true;
  };

  const handleDownload = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const uri = await capture();
      if (!(await requestLibraryPermission())) return;
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('保存しました', 'カメラロールに保存しました。');
    } catch {
      Alert.alert('エラー', '保存に失敗しました。');
    } finally { setBusy(false); }
  };

  const handleShare = async (app: 'line' | 'instagram' | 'twitter' | 'facebook') => {
    if (busy) return;
    setBusy(true);
    try {
      const uri = await capture();
      if (!(await requestLibraryPermission())) return;
      const asset = await MediaLibrary.createAssetAsync(uri);
      const schemes: Record<string, string> = {
        line: `line://msg/image/${asset.id}`,
        instagram: `instagram://library?LocalIdentifier=${asset.id}`,
        twitter: `twitter://post`,
        facebook: `fb://`,
      };
      await Linking.openURL(schemes[app]);
    } catch {
      Alert.alert('エラー', 'シェアに失敗しました。');
    } finally { setBusy(false); }
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 160 }}
        showsVerticalScrollIndicator={false}
      >
      {/* Card — content height */}
      <View style={styles.cardWrapper}>
        <View ref={cardRef} collapsable={false} style={styles.cardOuter}>
          <View style={styles.cardInner}>

            <Text style={styles.cardTitle}>{displayMonth}</Text>
            <BarIcon width="100%" height={12} />

            <View style={{ width: bubbleW, height: bubbleH, alignSelf: 'center' }}>
              <MessageBoxSVG width={bubbleW} height={bubbleH} preserveAspectRatio="none" />
              <View style={[StyleSheet.absoluteFill, { height: bodyH, alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 16 }]}>
                <Text style={styles.messageBubbleLabel}>今月の一言</Text>
                <Text style={styles.messageBubbleText}>
                  今月もよくがんばったね！{'\n'}たくさん一緒に旅ができたよ
                </Text>
              </View>
            </View>

            <View style={styles.companionSection}>
              <Image source={require('../../../assets/images/icons/paw_bg.png')} style={StyleSheet.absoluteFill} resizeMode="cover" />
              <View style={styles.sectionTitleRow}>
                <View style={styles.sectionBar} />
                <Text style={styles.sectionLabel}>一番長く一緒にいた相棒</Text>
              </View>
              <View style={styles.companionRow}>
                <View style={styles.companionCircle}>
                  <Pet width={48} height={48} />
                </View>
                <View>
                  <Text style={styles.companionName}>{petName}</Text>
                  <Text style={styles.companionSub}>{report.uses}回一緒に乗車</Text>
                </View>
              </View>
            </View>

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

            <View style={styles.stationsSection}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.sectionBar} />
                <Text style={styles.sectionLabel}>最も使用した駅</Text>
              </View>
              {DUMMY_STATIONS.map((s, i) => (
                <View key={i} style={styles.stationRow}>
                  <View style={styles.stationBadge}>
                    <Text style={styles.stationBadgeText}>{i + 1}</Text>
                  </View>
                  <Text style={styles.stationName}>{s}</Text>
                </View>
              ))}
            </View>

            <View style={styles.footer}>
              <View>
                <Text style={styles.footerLabel}>ユーザーネーム</Text>
                <Text style={styles.footerUsername}>{userName}</Text>
              </View>
              <ReportLogo width={75} height={75} />
            </View>

          </View>
        </View>
      </View>
      </ScrollView>

      {/* Overlay — tap to go back to report */}
      {showSheet && (
        <Pressable style={styles.overlay} onPress={() => router.navigate('/(tabs)/report')} />
      )}

      {/* Bottom sheet — overlaps the card */}
      {showSheet && (
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => router.navigate('/(tabs)/report')} hitSlop={8}>
            <CloseIcon width={15} height={15} />
          </TouchableOpacity>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.iconsRow}>
            <TouchableOpacity style={styles.iconItem} activeOpacity={0.8} onPress={handleDownload} disabled={busy}>
              <View style={styles.downloadSquare}>
                <DownloadIcon width={28} height={28} />
              </View>
              <Text style={styles.iconLabel}>保存</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconItem} activeOpacity={0.8} onPress={() => handleShare('line')} disabled={busy}>
              <LineIcon width={64} height={64} />
              <Text style={styles.iconLabel}>LINE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconItem} activeOpacity={0.8} onPress={() => handleShare('instagram')} disabled={busy}>
              <InstaIcon width={64} height={64} />
              <Text style={styles.iconLabel}>Instagram</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconItem} activeOpacity={0.8} onPress={() => handleShare('twitter')} disabled={busy}>
              <TwitterIcon width={64} height={64} />
              <Text style={styles.iconLabel}>X</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconItem} activeOpacity={0.8} onPress={() => handleShare('facebook')} disabled={busy}>
              <FbIcon width={64} height={64} />
              <Text style={styles.iconLabel}>Facebook</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f5f5f0' },

  cardWrapper: {
    paddingHorizontal: 16,
  },
  cardOuter: {
    backgroundColor: Colors.light.backgroundSelected,
    borderRadius: 24,
    padding: 10,
  },
  cardInner: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },

  cardTitle: {
    fontSize: 24,
    fontFamily: Fonts.display,
    fontWeight: '700',
    color: Colors.light.text,
    textAlign: 'center',
    marginTop: 8,
  },
  messageBubbleLabel: {
    fontSize: 14,
    fontFamily: Fonts.display,
    color: '#3f3f3f',
    fontWeight: 100,
  },
  messageBubbleText: {
    fontSize: 18,
    fontFamily: Fonts.display,
    color: Colors.light.text,
    lineHeight: 24,
    textAlign: 'center',
    fontWeight:400,
    marginVertical: 10,
  },
  companionSection: {
    borderRadius: 12,
    padding: 12,
    overflow: 'hidden',
    gap: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionBar: {
    width: 7,
    height: 15,
    backgroundColor: Colors.light.backgroundSelected,
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: Fonts.display,
    fontWeight: '700',
    color: Colors.light.text,
  },
  companionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  companionCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  companionName: {
    fontSize: 30,
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
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F5F4ED',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 6,
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
    fontSize: 24,
    fontFamily: Fonts.display,
    fontWeight: '700',
    color: Colors.light.backgroundSelected,
  },
  statUnit: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.text,
  },
  stationsSection: {
    backgroundColor: '#F5F4ED',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 8,
  },
  stationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
    fontSize: 14,
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerLabel: {
    fontSize: 13,
    fontFamily: Fonts.display,
    color: '#3f3f3f',
    fontWeight : 700,
  },
  footerUsername: {
    fontSize: 24,
    fontFamily: Fonts.display,
    fontWeight: '700',
    color: Colors.light.text,
  },


  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconsRow: {
    gap: 20,
    alignItems: 'center',
    paddingBottom: 8,
  },
  iconItem: {
    alignItems: 'center',
    gap: 6,
  },
  downloadSquare: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: '#d0d0d0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLabel: {
    fontSize: 11,
    fontFamily: Fonts.sans,
    color: Colors.light.text,
  },
});
