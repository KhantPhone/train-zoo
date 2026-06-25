import { Colors, Fonts } from '@/constants/theme';
import { usePet } from '@/context/PetContext';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgProps } from 'react-native-svg';
import CheckIcon from '../../../assets/images/icons/check-icon.svg';
import CloseIcon from '../../../assets/images/icons/close-icon.svg';
import LeftArrow from '../../../assets/images/icons/left-arrow-icon.svg';
import PenIcon from '../../../assets/images/icons/pen-icon.svg';
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

const PET_SVG_MAP: Record<string, React.FC<SvgProps>> = {
  '1':  ShibadogSvg,
  '2':  CatSvg,
  '3':  RabbitSvg,
  '4':  HamsterSvg,
  '5':  ParakeetSvg,
  '6':  PandaSvg,
  '7':  BearSvg,
  '8':  CoalaSvg,
  '9':  PenguinSvg,
  '10': LionSvg,
  '11': SecretPetSvg,
};

const PET_OVERLAP = 100;

export default function AnimalsDetailsScreen() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { id, name, type, personality } = useLocalSearchParams<{
    id: string;
    name: string;
    type: string;
    bgColor: string;
    personality: string;
  }>();

  const { setActivePetId, petNames, setPetName } = usePet();
  const currentName = petNames[Number(id)] ?? name;
  const [showNameSheet, setShowNameSheet] = useState(false);
  const [draftName, setDraftName] = useState('');
  const Pet = PET_SVG_MAP[id] ?? ShibadogSvg;
  const actionScale = useRef(new Animated.Value(1)).current;
  const nameInputRef = useRef<TextInput>(null);

  const openNameSheet = () => {
    setDraftName(currentName);
    setShowNameSheet(true);
    setTimeout(() => nameInputRef.current?.focus(), 200);
  };

  const closeNameSheet = () => {
    setShowNameSheet(false);
    setDraftName('');
  };

  const confirmName = () => {
    const trimmed = draftName.trim();
    if (trimmed) setPetName(Number(id), trimmed);
    setShowNameSheet(false);
  };

  const handleActionPress = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.sequence([
      Animated.spring(actionScale, { toValue: 0.93, useNativeDriver: true, friction: 8, tension: 120 }),
      Animated.spring(actionScale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }),
    ]).start(() => {
      setActivePetId(Number(id));
      router.navigate('/(tabs)/animals');
    });
  };

  return (
    <View style={styles.root}>
      <Image
        source={require('../../../assets/images/icons/paw_bg.png')}
        style={[StyleSheet.absoluteFill, { width, height }]}
        resizeMode="cover"
      />
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
          <Text style={styles.headerTitle}>相棒詳細</Text>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.navigate('/(tabs)/animals')}
            hitSlop={8}
          >
            <LeftArrow width={20} height={20} />
          </TouchableOpacity>

          <View style={styles.petWrapper}>
            <Pet width={236} height={236} />
          </View>

          <View style={styles.card}>
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
              {Array.from({ length: 18 }).map((_, row) => (
                <View key={row} style={styles.dotRow}>
                  {Array.from({ length: 12 }).map((_, col) => (
                    <View key={col} style={styles.dot} />
                  ))}
                </View>
              ))}
            </View>

            <View style={[styles.infoSection, { paddingTop: PET_OVERLAP + 16 }]}>
              <Text style={styles.typeText}>{type}</Text>

              <View style={styles.nameRow}>
                <Text style={styles.nameText}>{currentName}</Text>
                <TouchableOpacity hitSlop={8} onPress={openNameSheet}>
                  <PenIcon width={18} height={18} />
                </TouchableOpacity>
              </View>

              <Text style={styles.personalityText}>性格：{personality}</Text>

              <Animated.View style={{ transform: [{ scale: actionScale }] }}>
                <TouchableOpacity
                  style={styles.actionButton}
                  activeOpacity={0.9}
                  onPress={handleActionPress}
                >
                  <Text style={styles.actionButtonText}>相棒にする</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Name edit bottom sheet */}
      <Modal visible={showNameSheet} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.sheetOuter}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity style={styles.sheetBackdrop} activeOpacity={1} onPress={closeNameSheet} />
          <View style={[styles.sheetCard, { paddingBottom: insets.bottom + 24 }]}>
            <View style={styles.sheetHeaderRow}>
              <TouchableOpacity style={styles.sheetCloseBtn} activeOpacity={0.7} onPress={closeNameSheet}>
                <CloseIcon width={18} height={18} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.sheetConfirmBtn} activeOpacity={0.8} onPress={confirmName}>
                <CheckIcon width={22} height={22} />
              </TouchableOpacity>
            </View>

            <View style={styles.sheetTitleBlock}>
              <PenIcon width={36} height={36} />
              <Text style={styles.sheetTitle}>名前を変更</Text>
            </View>

            <TextInput
              ref={nameInputRef}
              style={styles.sheetInput}
              placeholder="名前を入力"
              placeholderTextColor="#bbb"
              value={draftName}
              onChangeText={setDraftName}
              onSubmitEditing={confirmName}
              returnKeyType="done"
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.light.background },
  container: { flex: 1 },
  header: {
    backgroundColor: Colors.light.backgroundSelected,
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: Fonts.display,
    color: '#fff',
    fontWeight: '700',
  },
  content: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 24,
    backgroundColor: Colors.light.backgroundSelected,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  petWrapper: {
    alignItems: 'center',
    zIndex: 2,
    marginBottom: -PET_OVERLAP,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    zIndex: 1,
  },
  dotRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#d8d8d8',
    opacity: 0.6,
  },
  infoSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 8,
  },
  typeText: {
    fontSize: 14,
    fontFamily: Fonts.display,
    color: Colors.light.backgroundSelected,
    fontWeight: '600',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nameText: {
    fontSize: 28,
    fontFamily: Fonts.display,
    color: Colors.light.text,
    fontWeight: '700',
  },
  personalityText: {
    fontSize: 14,
    fontFamily: Fonts.display,
    color: '#888',
  },
  actionButton: {
    marginTop: 16,
    backgroundColor: Colors.light.backgroundSelected,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: Fonts.display,
    color: '#fff',
    fontWeight: '700',
  },

  // Bottom sheet
  sheetOuter: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheetCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
    paddingHorizontal: 24,
    gap: 20,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sheetCloseBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetConfirmBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.backgroundSelected,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetTitleBlock: {
    alignItems: 'center',
    gap: 10,
  },
  sheetTitle: {
    fontSize: 20,
    fontFamily: Fonts.display,
    fontWeight: '700',
    color: Colors.light.text,
  },
  sheetInput: {
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: Fonts.sans,
    color: Colors.light.text,
  },
});
