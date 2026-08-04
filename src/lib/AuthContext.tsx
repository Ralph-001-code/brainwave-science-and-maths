import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import type { Profile, Role, School } from "./supabase";
import type { YearId, Programme, CheckpointStage, IgcseSubjectId } from "./quizData";
import type { UnlockEntry } from "./avatarUnlocks";

const ADMIN_EMAIL = "ofoeraphael2010@gmail.com";

type AuthState = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  loading: boolean;
  // ... (rest unchanged below)
  signUp: (
    email: string,
    password: string,
    username: string,
    firstName: string,
    lastName: string,
    yearId: YearId,
    emailUpdates: boolean,
    programme: Programme,
    checkpointStage: CheckpointStage | null,
    igcseSubjects: IgcseSubjectId[],
    role: Role,
  ) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setYear: (yearId: YearId) => Promise<{ error: string | null }>;
  setEmailUpdates: (enabled: boolean) => Promise<{ error: string | null }>;
  setTimerPrefs: (enabled: boolean, duration: number) => Promise<{ error: string | null }>;
  setProgramme: (p: Programme, stage: CheckpointStage | null, subjects: IgcseSubjectId[]) => Promise<{ error: string | null }>;
  setRole: (role: Role) => Promise<{ error: string | null }>;
  joinSchool: (schoolId: string) => Promise<{ error: string | null }>;
  leaveSchool: () => Promise<{ error: string | null }>;
  createSchool: (name: string, country?: string, city?: string) => Promise<{ error: string | null; school: School | null }>;
  sendFriendRequest: (addresseeId: string) => Promise<{ error: string | null }>;
  acceptFriendRequest: (friendshipId: string) => Promise<{ error: string | null }>;
  declineFriendRequest: (friendshipId: string) => Promise<{ error: string | null }>;
  removeFriend: (friendshipId: string) => Promise<{ error: string | null }>;
  unlocks: UnlockEntry[];
  refreshUnlocks: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [unlocks, setUnlocks] = useState<UnlockEntry[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadProfile(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (error) {
      console.error("loadProfile error", error);
      return null;
    }
    setProfile(data as Profile | null);
    return data as Profile | null;
  }

  async function loadUnlocks(userId: string) {
    const { data, error } = await supabase
      .from("avatar_unlocks")
      .select("item_type, item_id")
      .eq("user_id", userId);
    if (error) return;
    setUnlocks((data as UnlockEntry[]) ?? []);
  }

  useEffect(() => {
    let mounted = true;

    const timeout = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 8000);

    supabase.auth.getSession()
      .then(({ data }) => {
        if (!mounted) return;
        clearTimeout(timeout);
        setSession(data.session);
        setUser(data.session?.user ?? null);
        if (data.session?.user) {
          Promise.all([
            loadProfile(data.session.user.id),
            loadUnlocks(data.session.user.id),
          ]).catch(() => {}).finally(() => mounted && setLoading(false));
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        if (!mounted) return;
        clearTimeout(timeout);
        setLoading(false);
      });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        (async () => {
          try {
            await Promise.all([
              loadProfile(newSession.user.id),
              loadUnlocks(newSession.user.id),
            ]);
          } catch {
            // Network/profile errors shouldn't trap the user on a spinner.
          }
          setLoading(false);
        })();
      } else {
        setProfile(null);
        setUnlocks([]);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signUp: AuthState["signUp"] = async (
    email, password, username, firstName, lastName, yearId, emailUpdates,
    programme, checkpointStage, igcseSubjects, role,
  ) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    if (data.user) {
      const { error: profileErr } = await supabase.from("profiles").insert({
        id: data.user.id,
        username,
        first_name: firstName,
        last_name: lastName,
        year_id: yearId,
        xp: 0,
        streak: 0,
        email_updates: emailUpdates,
        programme,
        checkpoint_stage: checkpointStage,
        igcse_subjects: igcseSubjects,
        role,
      });
      if (profileErr) return { error: profileErr.message };

      try {
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/new-signup-notify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ email, username, firstName, lastName, role, programme, yearId }),
        });
      } catch {
        // Notification is best-effort; never block signup on it.
      }
    }
    return { error: null };
  };

  const signIn: AuthState["signIn"] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setUnlocks([]);
  };

  const refreshProfile = async () => {
    if (user) await Promise.all([loadProfile(user.id), loadUnlocks(user.id)]);
  };

  const setYear: AuthState["setYear"] = async (yearId) => {
    if (!user) return { error: "Not signed in." };
    const { error } = await supabase.from("profiles").update({ year_id: yearId }).eq("id", user.id);
    if (error) return { error: error.message };
    await loadProfile(user.id);
    return { error: null };
  };

  const setEmailUpdates: AuthState["setEmailUpdates"] = async (enabled) => {
    if (!user) return { error: "Not signed in." };
    const { error } = await supabase.from("profiles").update({ email_updates: enabled }).eq("id", user.id);
    if (error) return { error: error.message };
    await loadProfile(user.id);
    return { error: null };
  };

  const setTimerPrefs: AuthState["setTimerPrefs"] = async (enabled, duration) => {
    if (!user) return { error: "Not signed in." };
    const { error } = await supabase.from("profiles").update({ timer_enabled: enabled, timer_duration: duration }).eq("id", user.id);
    if (error) return { error: error.message };
    await loadProfile(user.id);
    return { error: null };
  };

  const setProgramme: AuthState["setProgramme"] = async (p, stage, subjects) => {
    if (!user) return { error: "Not signed in." };
    const { error } = await supabase.from("profiles").update({
      programme: p,
      checkpoint_stage: stage,
      igcse_subjects: subjects,
    }).eq("id", user.id);
    if (error) return { error: error.message };
    await loadProfile(user.id);
    return { error: null };
  };

  const setRole: AuthState["setRole"] = async (role) => {
    if (!user) return { error: "Not signed in." };
    const { error } = await supabase.from("profiles").update({ role }).eq("id", user.id);
    if (error) return { error: error.message };
    await loadProfile(user.id);
    return { error: null };
  };

  const joinSchool: AuthState["joinSchool"] = async (schoolId) => {
    if (!user) return { error: "Not signed in." };
    const { error } = await supabase.from("profiles").update({ school_id: schoolId }).eq("id", user.id);
    if (error) return { error: error.message };
    await loadProfile(user.id);
    return { error: null };
  };

  const leaveSchool: AuthState["leaveSchool"] = async () => {
    if (!user) return { error: "Not signed in." };
    const { error } = await supabase.from("profiles").update({ school_id: null }).eq("id", user.id);
    if (error) return { error: error.message };
    await loadProfile(user.id);
    return { error: null };
  };

  const createSchool: AuthState["createSchool"] = async (name, country, city) => {
    if (!user) return { error: "Not signed in.", school: null };
    const { data, error } = await supabase.from("schools").insert({
      name: name.trim(),
      country: country?.trim() || null,
      city: city?.trim() || null,
      created_by: user.id,
    }).select().single();
    if (error) return { error: error.message, school: null };
    const school = data as School;
    const { error: joinErr } = await supabase.from("profiles").update({ school_id: school.id }).eq("id", user.id);
    if (joinErr) return { error: joinErr.message, school: null };
    await loadProfile(user.id);
    return { error: null, school };
  };

  const sendFriendRequest: AuthState["sendFriendRequest"] = async (addresseeId) => {
    if (!user) return { error: "Not signed in." };
    const { error } = await supabase.from("friendships").insert({
      requester_id: user.id,
      addressee_id: addresseeId,
      status: "pending",
    });
    if (error) return { error: error.message };
    return { error: null };
  };

  const acceptFriendRequest: AuthState["acceptFriendRequest"] = async (friendshipId) => {
    if (!user) return { error: "Not signed in." };
    const { error } = await supabase.from("friendships").update({ status: "accepted" }).eq("id", friendshipId);
    if (error) return { error: error.message };
    return { error: null };
  };

  const declineFriendRequest: AuthState["declineFriendRequest"] = async (friendshipId) => {
    if (!user) return { error: "Not signed in." };
    const { error } = await supabase.from("friendships").update({ status: "declined" }).eq("id", friendshipId);
    if (error) return { error: error.message };
    return { error: null };
  };

  const removeFriend: AuthState["removeFriend"] = async (friendshipId) => {
    if (!user) return { error: "Not signed in." };
    const { error } = await supabase.from("friendships").delete().eq("id", friendshipId);
    if (error) return { error: error.message };
    return { error: null };
  };

  const isAdmin = !!user && user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return (
    <AuthContext.Provider
      value={{ session, user, profile, isAdmin, loading, unlocks, refreshUnlocks: () => user ? loadUnlocks(user.id) : Promise.resolve(), signUp, signIn, signOut, refreshProfile, setYear, setEmailUpdates, setTimerPrefs, setProgramme, setRole, joinSchool, leaveSchool, createSchool, sendFriendRequest, acceptFriendRequest, declineFriendRequest, removeFriend }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
