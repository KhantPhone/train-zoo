import { Colors, Fonts } from '@/constants/theme';
import { usePet } from '@/context/PetContext';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgProps } from 'react-native-svg';
import ActivePaw from '../../../assets/images/icons/active-paw.svg';
import Stars from '../../../assets/images/icons/Stars.svg';
import BearSvg from '../../../assets/images/pets/bear.svg';
import CatSvg from '../../../assets/images/pets/cat.svg';
import CoalaSvg from '../../../assets/images/pets/coala.svg';
import HamsterSvg from '../../../assets/images/pets/hamster.svg';
import LionSvg from '../../../assets/images/pets/lion.svg';
import PandaSvg from '../../../assets/images/pets/panda.svg';
import ParakeetSvg from '../../../assets/images/pets/parakeet.svg';
import PenguinSvg from '../../../assets/images/pets/penguin.svg';
import RabbitSvg from '../../../assets/images/pets/rabbit.svg';
import SecretPetSvg from '../../../assets/images/pets/secret.svg';
import ShibadogSvg from '../../../assets/images/pets/shibadog.svg';

type Animal = {
  id: number;
  type: string;
  name: string;
  bgColor: string;
  Pet: React.FC<SvgProps>;
  personality: string;
  message: string;
  active?: boolean;
};

const ANIMALS_LOCAL: Animal[] = [
  { id: 1,  type: '柴犬',       name: 'ぽち',        bgColor: '#EDE0FF', Pet: ShibadogSvg,  personality: 'やんちゃ',   message: '今日も全力で一緒に走ろう！', active: true },
  { id: 2,  type: '猫',         name: 'みけ',        bgColor: '#FFE0EE', Pet: CatSvg,       personality: 'マイペース', message: 'まあ、のんびり行こうよ〜' },
  { id: 3,  type: 'うさぎ',     name: 'ぴょん吉',    bgColor: '#E0F5E8', Pet: RabbitSvg,    personality: 'おっとり',   message: 'ぴょんぴょん！今日も元気だよ！' },
  { id: 4,  type: 'ハムスター', name: 'ひまわり',    bgColor: '#FFF5D5', Pet: HamsterSvg,   personality: 'のんびり',   message: 'ゆっくり、でも確実にね！' },
  { id: 5,  type: 'インコ',     name: 'ぴよ子',      bgColor: '#FFF3E0', Pet: ParakeetSvg,  personality: 'おしゃべり', message: 'ぴよぴよ〜！今日も頑張ろう！' },
  { id: 6,  type: 'パンダ',     name: 'シャンシャン', bgColor: '#DEEEFF', Pet: PandaSvg,    personality: 'ゆったり',   message: '一歩一歩、丁寧に行こうね。' },
  { id: 7,  type: 'くま',       name: '淳吉',        bgColor: '#E8E0F0', Pet: BearSvg,      personality: 'おおらか',   message: '俺に任せろ！一緒に乗り切ろう！' },
  { id: 8,  type: 'コアラ',     name: 'コー太郎',    bgColor: '#F0E5FF', Pet: CoalaSvg,     personality: 'ねぼすけ',   message: 'zzz…あ、おはよ。行こっか〜' },
  { id: 9,  type: 'ペンギン',   name: 'ペン太',      bgColor: '#D8F5FF', Pet: PenguinSvg,   personality: 'まじめ',     message: 'スケジュール通りに行きましょう！' },
  { id: 10, type: 'ライオン',   name: 'キング',      bgColor: '#FFE8D5', Pet: LionSvg,      personality: 'たのもしい', message: '今日も王者の風格で行くぞ！' },
  { id: 11, type: '???',        name: '〇〇駅で解放', bgColor: '#DCDCDC', Pet: SecretPetSvg, personality: '???',        message: '???' },
];


function AnimalCard({ animal, cardWidth, isActive, displayName, index }: { animal: Animal; cardWidth: number; isActive: boolean; displayName: string; index: number }) {
  const Pet = animal.Pet;
  const imgSize = cardWidth - 24;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, delay: index * 50, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={{ width: cardWidth, opacity: fadeAnim }}>
      <TouchableOpacity style={styles.cardWrapper} activeOpacity={animal.id === 11 ? 1 : 0.9} disabled={animal.id === 11} onPress={() => router.push({ pathname: '/(tabs)/animalsDetails', params: { id: animal.id, name: displayName, type: animal.type, bgColor: animal.bgColor, personality: animal.personality } })}>
        <View style={[styles.card, { backgroundColor: animal.bgColor }]}>
          <Stars width={cardWidth} height={cardWidth * 1.5} style={[StyleSheet.absoluteFill, { opacity: 0.5 }]} preserveAspectRatio="xMidYMid slice" />
          <View style={styles.imageWrapper}>
            <Pet width={140} height={140} />
          </View>
          <View style={styles.bottomSection}>
            <ActivePaw width={28} height={28} style={[styles.activePaw, { opacity: isActive ? 1 : 0 }]} />
            <Text style={styles.animalName} numberOfLines={1}>{displayName}</Text>
            <TouchableOpacity style={styles.penButton} hitSlop={8} />
          </View>
        </View>
        <View style={styles.typeLabelWrapper}>
          <View style={styles.typeLabel}>
            <Text style={styles.typeLabelText}>{animal.type}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function AnimalsScreen() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { activePetId: activeId, petNames } = usePet();

  const PADDING = 12;
  const GAP = 10;
  const cardWidth = (width - PADDING * 2 - GAP) / 2;


  const rows: Animal[][] = [];
  for (let i = 0; i < ANIMALS_LOCAL.length; i += 2) {
    rows.push(ANIMALS_LOCAL.slice(i, i + 2));
  }

  return (
    <View style={styles.root}>
      <Image source={require('../../../assets/images/icons/paw_bg.png')} style={[StyleSheet.absoluteFill, { width, height }]} resizeMode="cover" />
      <SafeAreaView style={styles.container} edges={['left', 'right']}>

        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
          <View>
            <Text style={styles.headerTitle}>図鑑</Text>
          </View>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{ANIMALS_LOCAL.filter(a => a.id !== 11).length}/11</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 16) + 100 }]} showsVerticalScrollIndicator={false}>

          {/* Grid */}
          <View style={[styles.grid, { padding: PADDING, gap: GAP }]}>
            {rows.map((pair, rowIndex) => (
              <View key={rowIndex} style={[styles.row, { gap: GAP }]}>
                <AnimalCard animal={pair[0]} cardWidth={cardWidth} isActive={activeId === pair[0].id} displayName={petNames[pair[0].id] ?? pair[0].name} index={rowIndex * 2} />
                {pair[1] && <AnimalCard animal={pair[1]} cardWidth={cardWidth} isActive={activeId === pair[1].id} displayName={petNames[pair[1].id] ?? pair[1].name} index={rowIndex * 2 + 1} />}
              </View>
            ))}
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
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 20, fontFamily: Fonts.display, color: '#fff', fontWeight: '700' },
  headerSub: { fontSize: 12, fontFamily: Fonts.sans, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  headerBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  headerBadgeText: { fontSize: 14, fontFamily: Fonts.display, color: '#fff', fontWeight: '700' },

  scrollContent: { gap: 4 },

  // Grid
  grid: { paddingBottom: 8 },
  row: { flexDirection: 'row' },
  cardWrapper: { paddingTop: 22 },
  card: { borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' },
  typeLabelWrapper: {
    position: 'absolute', top: 9, right: 10,
    alignSelf: 'center', zIndex: 10, alignItems: 'center', justifyContent: 'center',
  },
  typeLabel: {
    backgroundColor: '#D4EDE6', borderRadius: 30,
    paddingHorizontal: 20, paddingVertical: 3,
    borderWidth: 1, borderColor: '#ffffff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  typeLabelText: { fontSize: 14, fontFamily: Fonts.display, color: Colors.light.text, fontWeight: '700' },
  imageWrapper: { alignItems: 'center', paddingTop: 33, paddingBottom: 17 },
  bottomSection: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#ffffff', paddingHorizontal: 12, paddingVertical: 10, gap: 4,
  },
  activePaw: { flexShrink: 0 },
  animalName: { flex: 1, fontSize: 15, fontFamily: Fonts.display, color: Colors.light.text, textAlign: 'center' },
  penButton: { width: 28, padding: 2 },

});
