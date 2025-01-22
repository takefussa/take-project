import { atom } from "recoil";
import { Session } from "@supabase/supabase-js";

export const sessionState = atom<Session | null | undefined>({
  key: "sessionState",
  default: undefined, // 初期状態は undefined（セッション確認中）
});
