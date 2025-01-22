// import { RecoilState, useRecoilState } from "recoil";
// import { Session } from "next-auth";

// interface SessionProviderProps {
//   sessionAtom: RecoilState<Session | null>;
// }

// export default function SessionProvider({ sessionAtom }: SessionProviderProps) {
//   const [session, setSession] = useRecoilState(sessionAtom);

//   return <div>{session?.user?.name || "No Session"}</div>;
// }

import { Session } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { sessionState } from "@/libs/states";
import supabase from "@/libs/supabase";

type SessionProviderProps = {
  children: React.ReactNode;
};

export const SessionProvider = ({ children }: SessionProviderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const [, setSession] = useRecoilState<Session | null>(sessionState);

  useEffect(() => {
    const sessionUpdate = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error(error);
        setIsReady(false);
        return;
      }
      setSession(session);
      if (session) {
        if (pathname === "/") {
          router.replace("/auth");
          return ;
        }
        setIsReady(true);
        return;
      }
      if (pathname !== "/") {
        router.replace("/");
        return;
      }
      setIsReady(true);
      return;
    };

    sessionUpdate();
  }, [router, pathname, setIsReady]);

  if (!isReady) {
    return <></>;
  }
  return <>{children}</>;
};