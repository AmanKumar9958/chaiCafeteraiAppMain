// File: app/auth.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential } from 'firebase/auth';
import { useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text, View, Platform } from 'react-native';

// Import Google auth session tools
import { ResponseType } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';

import { auth } from '../lib/firebase';

WebBrowser.maybeCompleteAuthSession();

export default function AuthScreen() {
  const router = useRouter();

  // Detect platform and select correct client ID
  const clientId =
    Platform.select({
      android: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
      ios: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      web: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    }) ?? '';

  // Configure Google Auth Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId,
    responseType: ResponseType.IdToken,
    scopes: ['profile', 'email'],
  });

  // Redirect user if already logged in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.replace('/(tabs)');
    });
    return () => unsub();
  }, [router]);

  // Handle Google Sign-In response
  useEffect(() => {
    const handleResponse = async () => {
      if (response?.type === 'success') {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        await signInWithCredential(auth, credential);
      }
    };
    handleResponse();
  }, [response]);

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Image
          source={require('../assets/images/adaptive-icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>ChaiCafeteraiApp</Text>
      </View>

      <View style={styles.bottom}>
        <Pressable
          disabled={!request}
          onPress={() => promptAsync()}
          style={({ pressed }) => [styles.googleBtn, pressed && { opacity: 0.9 }]}
        >
          <Ionicons name="logo-google" size={18} color="#4285F4" style={styles.googleIconIon} />
          <Text style={styles.googleText}>Continue with Google</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F0' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 160, height: 160, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '800', color: '#111827' },
  bottom: { padding: 16, paddingBottom: 32 },
  googleBtn: {
    backgroundColor: '#ffffff',
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  googleIconIon: { marginRight: 8 },
  googleText: { fontSize: 16, fontWeight: '700', color: '#111827' },
});
