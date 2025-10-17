// File: app/_layout.tsx

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar'; // <-- Make sure this is from 'expo-status-bar'
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { auth } from '../lib/firebase';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: '(tabs)',
};

(async () => {
    try {
        await SplashScreen.preventAutoHideAsync();
    } catch (e) {
        // ignore
    }
})();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        ...FontAwesome.font,
    });

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                await SplashScreen.preventAutoHideAsync();
            } catch (e) {
                // ignore
            }

            if (loaded && mounted) {
                const MIN_DISPLAY_MS = 700;
                setTimeout(async () => {
                    if (!mounted) return;
                    try {
                        await SplashScreen.hideAsync();
                    } catch (e) {
                        // ignore
                    }
                }, MIN_DISPLAY_MS);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [loaded]);

    useEffect(() => {
        if (error) throw error;
    }, [error]);

    if (!loaded) return null;

    return <RootLayoutNav />;
}

function RootLayoutNav() {
    // We are not using colorScheme for status bar, so it can be removed if not used elsewhere
    // const colorScheme = useColorScheme();

    // <-- CHANGE: Define the background color that matches your app's screen
    const appBackgroundColor = '#FFF8F0';

    const [user, setUser] = useState<User | null>(auth.currentUser);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setAuthChecked(true);
        });
        return () => unsub();
    }, []);

    if (!authChecked) {
        // Tiny loading gate while we confirm auth state
        return (
            <SafeAreaProvider>
                <ThemeProvider value={DefaultTheme}>
                    <StatusBar style="dark" backgroundColor={appBackgroundColor} translucent={false} />
                    <View style={{ flex: 1, backgroundColor: appBackgroundColor, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size="small" color="#ea580c" />
                    </View>
                </ThemeProvider>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            {/* The ThemeProvider is for navigation components, not the status bar */}
            <ThemeProvider value={DefaultTheme}>
                {/* -- CORRECTED STATUS BAR --
                    style="dark": Makes icons like time and battery dark, which is good for a light background.
                    backgroundColor: Sets the background color of the status bar.
                    translucent={false}: This is the key. It makes the status bar a solid block.
                */}
                <StatusBar style="dark" backgroundColor={appBackgroundColor} translucent={false} />
                
                <Stack>
                    {user ? (
                        <>
                            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
                        </>
                    ) : (
                        <Stack.Screen name="auth" options={{ headerShown: false }} />
                    )}
                </Stack>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}