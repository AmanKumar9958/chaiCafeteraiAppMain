import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrdersScreen() {
	return (
		<SafeAreaView style={styles.screen}>
			<View style={styles.header}>
				<Text style={styles.title}>Orders</Text>
			</View>
			<View style={styles.center}>
				<Text style={styles.empty}>You have no orders yet.</Text>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	screen: { flex: 1, backgroundColor: '#f8fafc' },
	header: { paddingHorizontal: 16, paddingTop: 48, paddingBottom: 8 },
	title: { fontSize: 28, fontWeight: '800', color: '#111827' },
	center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
	empty: { color: '#6b7280' },
});