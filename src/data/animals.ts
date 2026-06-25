import React from 'react';
import { SvgProps } from 'react-native-svg';
import BearSvg from '../../assets/images/pets/bear.svg';
import CatSvg from '../../assets/images/pets/cat.svg';
import CoalaSvg from '../../assets/images/pets/coala.svg';
import HamsterSvg from '../../assets/images/pets/hamster.svg';
import LionSvg from '../../assets/images/pets/lion.svg';
import PandaSvg from '../../assets/images/pets/panda.svg';
import ParakeetSvg from '../../assets/images/pets/parakeet.svg';
import PenguinSvg from '../../assets/images/pets/penguin.svg';
import RabbitSvg from '../../assets/images/pets/rabbit.svg';
import SecretPetSvg from '../../assets/images/pets/secret.svg';
import ShibadogSvg from '../../assets/images/pets/shibadog.svg';

export type Animal = {
  id: number;
  type: string;
  name: string;
  bgColor: string;
  Pet: React.FC<SvgProps>;
  personality: string;
  message: string;
};

export const ANIMALS: Animal[] = [
  { id: 1,  type: '柴犬',       name: 'ぽち',        bgColor: '#EDE0FF', Pet: ShibadogSvg,  personality: 'やんちゃ',   message: '今日も全力で一緒に走ろう！' },
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
