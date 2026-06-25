import { Colors, Fonts } from '@/constants/theme';
import { usePet } from '@/context/PetContext';
import { ANIMALS } from '@/data/animals';
import { router, useFocusEffect } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, Vibration, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import CautionIcon from '../../../assets/images/icons/caution.svg';
import LockIcon from '../../../assets/images/icons/lock-icon.svg';
import CheckIcon from '../../../assets/images/icons/check-icon.svg';
import CloseIcon from '../../../assets/images/icons/close-icon.svg';
import PenIcon from '../../../assets/images/icons/pen-icon.svg';
import PenWhiteIcon from '../../../assets/images/icons/pen-icon-white.svg';
import UnlockIcon from '../../../assets/images/icons/unlock.svg';
import DogSleeping from '../../../assets/images/pets/dog-sleeping.svg';

export default function AlarmScreen() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { activePetId, userName } = usePet();
  const activePet = ANIMALS.find(a => a.id === activePetId) ?? ANIMALS[0];
  const Pet = activePet.Pet;

  const [arrived, setArrived] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showStationInput, setShowStationInput] = useState(false);
  const [stationDraft, setStationDraft] = useState('');
  const [stationError, setStationError] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const vibrationRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const inputRef = useRef<TextInput>(null);

  const station = '新宿駅';

  const stopSound = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  }, []);

  const stopVibration = useCallback(() => {
    Vibration.cancel();
    if (vibrationRef.current) {
      clearInterval(vibrationRef.current);
      vibrationRef.current = null;
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setArrived(false);
      timerRef.current = setTimeout(() => setArrived(true), 5000);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        stopVibration();
      };
    }, [stopVibration])
  );

  useEffect(() => {
    if (arrived) {
      // Vibration
      if (Platform.OS === 'android') {
        Vibration.vibrate([0, 800, 400], true);
      } else {
        vibrationRef.current = setInterval(() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }, 600);
      }
      // Sound
      (async () => {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: true });
        const { sound } = await Audio.Sound.createAsync(
          require('../../../assets/sounds/alarm.mp3'),
          { isLooping: true, volume: 1.0 }
        );
        soundRef.current = sound;
        await sound.playAsync();
      })();
    } else {
      stopVibration();
      stopSound();
    }
    return () => {
      stopVibration();
      stopSound();
    };
  }, [arrived, stopVibration, stopSound]);

  const openStationInput = () => {
    setStationDraft('');
    setStationError(false);
    setShowStationInput(true);
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  const closeStationInput = () => {
    setShowStationInput(false);
    setStationDraft('');
    setStationError(false);
  };

  const confirmStation = () => {
    if (stationDraft.trim() === station) {
      stopVibration();
      stopSound();
      setShowStationInput(false);
      router.navigate('/(tabs)/result');
    } else {
      setStationError(true);
    }
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
          <Text style={styles.headerTitle}>アラーム作動中</Text>
        </View>

        {/* Content */}
        <View style={[styles.content, { paddingBottom: insets.bottom + 24 }]}>

          {arrived ? (
            <Text style={styles.movingText}>
              {station}についたよ！{'\n'}起きて！{userName}さん！
            </Text>
          ) : (
            <Text style={styles.movingText}>{station}まで移動中...</Text>
          )}

          <View style={styles.petCircle}>
            {arrived
              ? <Pet width={200} height={200} />
              : <DogSleeping width={200} height={200} />
            }
          </View>

          <View style={styles.stationBlock}>
            <Text style={styles.stationLabel}>降車駅</Text>
            <View style={styles.stationRow}>
              <Text style={styles.stationName}>{station}</Text>
              {arrived
                ? <UnlockIcon width={22} height={22} />
                : <LockIcon width={22} height={22} />
              }
            </View>
          </View>

          {arrived ? (
            <TouchableOpacity
              style={styles.inputButton}
              activeOpacity={0.82}
              onPress={openStationInput}
            >
              <PenWhiteIcon width={26} height={26} />
              <Text style={styles.inputButtonText}>降車駅を入力</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.exitButton}
              activeOpacity={0.82}
              onPress={() => setShowConfirm(true)}
            >
              <Text style={styles.exitButtonText}>途中で降りる</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>

      {/* Confirmation modal */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <CautionIcon width={56} height={56} />
            <Text style={styles.modalTitle}>ここで降りますか？</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                activeOpacity={0.8}
                onPress={() => setShowConfirm(false)}
              >
                <Text style={styles.cancelButtonText}>降りない</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                activeOpacity={0.8}
                onPress={() => { setShowConfirm(false); router.navigate('/(tabs)/home'); }}
              >
                <Text style={styles.confirmButtonText}>降りる</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Station input bottom sheet */}
      <Modal visible={showStationInput} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.sheetOuter}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity style={styles.sheetBackdrop} activeOpacity={1} onPress={closeStationInput} />
          <View style={[styles.sheetCard, { paddingBottom: insets.bottom + 24 }]}>
            {/* Header row */}
            <View style={styles.sheetHeaderRow}>
              <TouchableOpacity style={styles.sheetIconBtn} activeOpacity={0.7} onPress={closeStationInput}>
                <CloseIcon width={18} height={18} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.sheetConfirmBtn} activeOpacity={0.8} onPress={confirmStation}>
                <CheckIcon width={22} height={22} />
              </TouchableOpacity>
            </View>

            {/* Icon + title */}
            <View style={styles.sheetTitleBlock}>
              <PenIcon width={36} height={36} />
              <Text style={styles.sheetTitle}>降車駅を入力</Text>
            </View>

            {/* Input */}
            <TextInput
              ref={inputRef}
              style={[styles.sheetInput, stationError && styles.sheetInputError]}
              placeholder="降車駅を入力"
              placeholderTextColor="#bbb"
              value={stationDraft}
              onChangeText={(t) => { setStationDraft(t); setStationError(false); }}
              onSubmitEditing={confirmStation}
              returnKeyType="done"
            />
            {stationError && (
              <Text style={styles.errorText}>もう一度入力してください。</Text>
            )}
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
    paddingBottom: 16,
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
    paddingHorizontal: 28,
    gap: 28,
  },
  movingText: {
    fontSize: 20,
    fontFamily: Fonts.display,
    color: Colors.light.text,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 32,
  },
  petCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stationBlock: { alignSelf: 'stretch', gap: 6 },
  stationLabel: { fontSize: 13, fontFamily: Fonts.sans, color: '#888' },
  stationRow: {
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stationName: {
    fontSize: 20,
    fontFamily: Fonts.sans,
    color: Colors.light.text,
    fontWeight: '600',
  },
  exitButton: {
    alignSelf: 'stretch',
    backgroundColor: '#FFCC8D',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  exitButtonText: {
    fontSize: 18,
    fontFamily: Fonts.display,
    fontWeight: '700',
    color: '#fff',
  },
  inputButton: {
    alignSelf: 'stretch',
    backgroundColor: Colors.light.backgroundSelected,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  inputButtonText: {
    fontSize: 18,
    fontFamily: Fonts.display,
    fontWeight: '700',
    color: '#ffffff',
  },

  // Confirmation modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingVertical: 30,
    paddingHorizontal: 28,
    alignItems: 'center',
    gap: 20,
    width: '100%',
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: Fonts.display,
    fontWeight: '500',
    color: Colors.light.text,
    textAlign: 'center',
    marginTop: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#D9534F',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: Fonts.display,
    fontWeight: '500',
    color: '#D9534F',
  },
  confirmButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#D9534F',
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: Fonts.display,
    fontWeight: '700',
    color: '#ffffff',
  },

  // Station input bottom sheet
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
  sheetIconBtn: {
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
  sheetInputError: {
    borderColor: '#E57373',
  },
  errorText: {
    fontSize: 13,
    fontFamily: Fonts.sans,
    color: '#E57373',
    marginTop: -12,
  },
});
