import { Colors, Fonts } from '@/constants/theme';
import { usePet } from '@/context/PetContext';
import { ANIMALS } from '@/data/animals';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import FlameIcon from '../../../assets/images/icons/flame-icon.svg';

const STREAK = 120;

export default function ResultScreen() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { activePetId } = usePet();
  const activePet = ANIMALS.find(a => a.id === activePetId) ?? ANIMALS[0];
  const Pet = activePet.Pet;

  const plusOpacity = useRef(new Animated.Value(0)).current;
  const plusTranslateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(plusOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(plusTranslateY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.root}>
      <Image
        source={require('../../../assets/images/icons/paw_bg.png')}
        style={[StyleSheet.absoluteFill, { width, height }]}
        resizeMode="cover"
      />
      <SafeAreaView style={styles.container} edges={['left', 'right']}>
        <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
          <Text style={styles.headerTitle}>リザルト</Text>
        </View>

        <View style={[styles.content, { paddingBottom: insets.bottom + 32 }]}>
          <Text style={styles.message}>{activePet.message}</Text>

          <View style={styles.petCircle}>
            <Pet width={200} height={200} />
          </View>

          <View style={styles.streakRow}>
            <FlameIcon width={32} height={32} color="#DA5B5B" />
            <Text style={styles.streakCount}>{STREAK}</Text>
            <Animated.View
              style={{
                opacity: plusOpacity,
                transform: [{ translateY: plusTranslateY }],
              }}
            >
              <Text style={styles.streakPlus}>+1</Text>
            </Animated.View>
          </View>

          <TouchableOpacity
            style={styles.homeButton}
            activeOpacity={0.82}
            onPress={() => router.navigate('/(tabs)/home')}
          >
            <Text style={styles.homeButtonText}>ホームに戻る</Text>
          </TouchableOpacity>
        </View>
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
    paddingBottom: 14,
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
    gap: 32,
  },
  message: {
    fontSize: 18,
    fontFamily: Fonts.display,
    color: Colors.light.text,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 28,
  },
  petCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakCount: {
    fontSize: 32,
    fontFamily: Fonts.display,
    fontWeight: '700',
    color: Colors.light.text,
  },
  streakPlus: {
    fontSize: 32,
    fontFamily: Fonts.display,
    fontWeight: '700',
    color: '#DA5B5B',
  },
  homeButton: {
    marginTop: 20,
    alignSelf: 'stretch',
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  homeButtonText: {
    fontSize: 18,
    fontFamily: Fonts.display,
    fontWeight: '600',
    color: Colors.light.text,
  },
});
