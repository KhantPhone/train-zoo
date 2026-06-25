import { Colors, Fonts } from '@/constants/theme';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgProps } from 'react-native-svg';
import NatureIcon from '../../../assets/images/icons/nature.svg';
import BellIcon from '../../../assets/images/icons/bell.svg';
import ChimeIcon from '../../../assets/images/icons/chime.svg';
import DigitalAlarmIcon from '../../../assets/images/icons/digitalalarm.svg';
import LeftArrow from '../../../assets/images/icons/left-arrow-icon.svg';
import SoundGreenIcon from '../../../assets/images/icons/sound-green.svg';
import VibrationIcon from '../../../assets/images/icons/vibration.svg';

type SoundOption = {
  id: string;
  name: string;
  subtitle: string;
  Icon: React.FC<SvgProps>;
  file: number | null;
};

const SOUND_OPTIONS: SoundOption[] = [
  { id: 'chime',   name: 'チャイム',        subtitle: 'やさしい音階',      Icon: ChimeIcon,        file: require('../../../assets/sounds/alarm.mp3') },
  { id: 'bell',    name: 'ベル',            subtitle: '昔ながらの目覚まし', Icon: BellIcon,         file: require('../../../assets/sounds/bell.mp3') },
  { id: 'digital', name: 'デジタルアラーム', subtitle: '定番の目覚まし',    Icon: DigitalAlarmIcon, file: require('../../../assets/sounds/digital.mp3') },
  { id: 'nature',  name: '自然の音',        subtitle: '小鳥のさえずり',     Icon: NatureIcon,       file: require('../../../assets/sounds/nature.mp3') },
  { id: 'none',    name: 'なし',            subtitle: '振動のみ',           Icon: VibrationIcon,    file: null },
];


export default function AlarmSoundScreen() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState('chime');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.75);
  const soundRef = useRef<Audio.Sound | null>(null);

  const stopCurrent = async () => {
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch {}
      soundRef.current = null;
    }
    setPlayingId(null);
  };

  const handlePlay = async (option: SoundOption) => {
    if (!option.file) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (playingId === option.id) { await stopCurrent(); return; }
    await stopCurrent();
    try {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      const { sound } = await Audio.Sound.createAsync(option.file, { volume, isLooping: true });
      soundRef.current = sound;
      setPlayingId(option.id);
      await sound.playAsync();
    } catch {}
  };

  const handleVolumeChange = async (v: number) => {
    setVolume(v);
    if (soundRef.current) {
      try { await soundRef.current.setVolumeAsync(v); } catch {}
    }
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        stopCurrent();
      };
    }, [])
  );

  return (
    <View style={styles.root}>
      <Image source={require('../../../assets/images/icons/paw_bg.png')} style={[StyleSheet.absoluteFill, { width, height }]} resizeMode="cover" />
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.navigate('/(tabs)/home')} hitSlop={8} style={styles.backBtn}>
              <LeftArrow width={16} height={16} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>アラーム音編集</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: Math.max(insets.bottom, 16) + 80 }]} showsVerticalScrollIndicator={false}>

          {/* Sound list */}
          <Text style={styles.sectionLabel}>アラーム音を選ぶ</Text>
          <View style={styles.card}>
            {SOUND_OPTIONS.map((option, i) => {
              const isSelected = selectedId === option.id;
              const isPlaying = playingId === option.id;
              return (
                <View key={option.id}>
                  {i > 0 && <View style={styles.divider} />}
                  <TouchableOpacity
                    style={[styles.row, isSelected && styles.rowSelected]}
                    activeOpacity={0.8}
                    onPress={() => { setSelectedId(option.id); if (option.id === 'none') stopCurrent(); }}
                  >
                    <View style={styles.iconBox}>
                      <option.Icon width={35} height={35} />
                    </View>
                    <View style={styles.rowText}>
                      <Text style={styles.rowName}>{option.name}</Text>
                      <Text style={styles.rowSub}>{option.subtitle}</Text>
                    </View>
                    <View style={styles.rowActions}>
                      {option.file !== null && (
                        <TouchableOpacity
                          style={[styles.playBtn, isSelected && styles.playBtnFilled]}
                          onPress={() => handlePlay(option)}
                          hitSlop={6}
                        >
                          <Text style={[styles.playTriangle, isSelected && styles.playTriangleFilled]}>
                            {isPlaying ? '■' : '▶'}
                          </Text>
                        </TouchableOpacity>
                      )}
                      <View style={[styles.radio, isSelected && styles.radioFilled]}>
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          {/* Volume */}
          <Text style={[styles.sectionLabel, { marginTop: 20, fontSize: 14 }]}>音量</Text>
          <View style={styles.card}>
            <View style={styles.volumeInner}>
              <View style={styles.volumeLabelRow}>
                <SoundGreenIcon width={28} height={28} />
                <Text style={styles.volumeLabel}>音量</Text>
              </View>
              <Slider
                style={{ flex: 1 }}
                minimumValue={0}
                maximumValue={1}
                value={volume}
                onValueChange={handleVolumeChange}
                minimumTrackTintColor={Colors.light.backgroundSelected}
                maximumTrackTintColor="#E0E0E0"
                thumbTintColor={Colors.light.backgroundSelected}
              />
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.light.background },
  container: { flex: 1 },

  header: {
    backgroundColor: Colors.light.backgroundSelected,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  headerTitle: { fontSize: 20, fontFamily: Fonts.display, color: '#fff', fontWeight: '700' },

  scroll: { padding: 20, gap: 8 },

  sectionLabel: {
    fontSize: 14,
    fontFamily: Fonts.sans,
    color: '#888',
    marginTop : 14,
    marginBottom: 6,
    marginLeft: 4,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
  },

  divider: { height: 1, backgroundColor: '#F0F0F0', marginHorizontal: 12 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
  },
  rowSelected: {
    backgroundColor: '#DFF4ED',
  },
  iconBox: {
    width: 57,
    height: 57,
    borderRadius: 50,
    backgroundColor: '#FFF9EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1, gap: 2 },
  rowName: { fontSize: 19, fontFamily: Fonts.display, fontWeight: '700', color: Colors.light.text },
  rowSub: { fontSize: 14, fontFamily: Fonts.sans, color: '#999' },

  rowActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },

  playBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.light.backgroundSelected,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnFilled: {
    backgroundColor: Colors.light.backgroundSelected,
    borderColor: Colors.light.backgroundSelected,
  },
  playTriangle: { fontSize: 11, color: Colors.light.backgroundSelected, marginLeft: 2 },
  playTriangleFilled: { color: '#ffffff' },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioFilled: { backgroundColor: Colors.light.backgroundSelected, borderColor: Colors.light.backgroundSelected },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },

  // Volume
  volumeInner: {
    paddingHorizontal: 24,
    paddingVertical: 28,
    gap: 10,
  },
  volumeLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  volumeLabel: {
    fontSize: 18,
    marginLeft: 5,
    fontFamily: Fonts.display,
    fontWeight: '700',
    color: Colors.light.text,
  },
});
