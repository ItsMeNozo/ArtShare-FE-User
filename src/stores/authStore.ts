import { create } from 'zustand';
import { auth } from '@/firebase';  // Assuming Firebase auth is set up
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  sendEmailVerification,
} from 'firebase/auth';

interface AuthState {
  user: any | null;
  error: string | null;
  setUser: (user: any) => void;
  clearUser: () => void;
  setError: (error: string) => void;
  signUpWithEmail: (email: string, password: string) => void;
  loginWithEmail: (email: string, password: string) => void;
  logout: () => void;
  signUpWithGoogle: () => void;
  signUpWithFacebook: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  error: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  setError: (error) => set({ error }),

  // Sign Up with Email
  signUpWithEmail: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Send email verification
      await sendEmailVerification(user);
      set({ user });
      // Redirect user to the verify email page
      window.location.href = '/verify-email'; // Redirect to /verify-email after successful sign-up
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  // Login with Email
  loginWithEmail: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the user's email is verified
      if (!user.emailVerified) {
        set({ error: "Please verify your email before proceeding." });
        return;
      }

      set({ user });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  // Google Sign-Up
  signUpWithGoogle: async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      set({ user });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  // Facebook Sign-Up
  signUpWithFacebook: async () => {
    const provider = new FacebookAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      set({ user });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  // Sign Out
  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null });
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));
