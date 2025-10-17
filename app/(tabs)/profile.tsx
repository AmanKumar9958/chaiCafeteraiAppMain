// File: app/(tabs)/profile.jsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../lib/firebase';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(auth.currentUser);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Account</Text>
      </View>

      <View style={styles.content}>
        {user ? (
          <View style={styles.centered}>
            <Ionicons name="person-circle-outline" size={80} color="#4b5563" />
            <Text style={styles.name}>{user.displayName || 'User'}</Text>
            <Text style={styles.email}>{user.email}</Text>

            <TouchableOpacity
              style={[styles.fullButton, styles.logoutButton]}
              onPress={async () => {
                await signOut(auth);
                router.replace('/auth');
              }}
            >
              <Text style={styles.fullButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.fullWidthCenter}>
            <Ionicons name="log-in-outline" size={80} color="#9ca3af" />
            <Text style={styles.loginPrompt}>Please log in to continue</Text>
            <Text style={styles.helperText}>
              Log in to view your orders, manage your profile, and enjoy a seamless experience.
            </Text>

            <TouchableOpacity style={[styles.fullButton, styles.googleButton]}>
              <View style={styles.googleButtonContent}>
                <Ionicons name="logo-google" size={20} color="white" />
                <Text style={styles.fullButtonText}>Sign in with Google</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc', // gray-50
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  centered: {
    alignItems: 'center',
  },
  fullWidthCenter: {
    width: '100%',
    alignItems: 'center',
  },
  name: {
    marginTop: 16,
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
  },
  email: {
    marginTop: 6,
    fontSize: 16,
    color: '#6b7280',
  },
  loginPrompt: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#4b5563',
  },
  helperText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#9ca3af',
  },
  fullButton: {
    width: '100%',
    borderRadius: 999,
    paddingVertical: 14,
    marginTop: 24,
  },
  fullButtonText: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
  },
  googleButton: {
    backgroundColor: '#3b82f6',
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
});