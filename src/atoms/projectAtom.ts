// src/atoms/projectAtom.ts
import { atom } from 'recoil';

export const projectListState = atom({
  key: 'projectListState', // ユニークなキー
  default: [], // 初期状態（空の配列）
});
