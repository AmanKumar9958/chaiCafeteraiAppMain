// File: app/(tabs)/index.jsx
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged, User } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../lib/firebase';

// Naya, bada Dummy Data (Phase 2 mein ise Firebase se laayenge)
const CATEGORIES = [
  { id: '1', name: 'All', icon: 'fast-food-outline' as const },
  { id: '2', name: 'Pizza', icon: 'pizza-outline' as const },
  // Ionicons doesn't have 'hamburger-outline'. Use a close alternative.
  { id: '3', name: 'Burgers', icon: 'fast-food-outline' as const },
  { id: '4', name: 'Rolls', icon: 'leaf-outline' as const },
  { id: '5', name: 'Desserts', icon: 'ice-cream-outline' as const },
  { id: '6', name: 'Drinks', icon: 'cafe-outline' as const },
];

const DUMMY_FOOD_DATA = [
  // Pizzas
  { id: 'p1', name: 'Margherita Pizza', category: 'Pizza', price: 250, image: 'https://imgs.search.brave.com/1hSv0Mueiu-Sq60tP4ZRxDjozKT_QAx7Yx-EWNRyUOU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzM1LzQ3LzUz/LzM2MF9GXzIzNTQ3/NTM3MV80REl1UGF2/WDV0YUhqdjd6ZERG/NmNDQktDT1VseEta/ci5qcGc' },
  { id: 'p2', name: 'Paneer Tikka Pizza', category: 'Pizza', price: 350, image: 'https://imgs.search.brave.com/1Itjll9ptaJrMvqHrhV0iw2VdhFzwfPyFWT7JyvAPRs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9waXp6/YS02NzUyNDY0Lmpw/Zw' },
  // Burgers
  { id: 'b1', name: 'Veggie Burger', category: 'Burgers', price: 120, image: 'https://imgs.search.brave.com/35Lz9SJO-DxlY34Vlg9G18PL5XEbNGNmTS1wKRlOpRE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/cHJvZC53ZWJzaXRl/LWZpbGVzLmNvbS82/NjU0NTQ4YzRiZmEx/OWJjNWU0YzVhN2Mv/NjY3M2YzNzA4N2Rl/M2EyM2VjZjg0Njkz/X1Bob3RvX0J1cmdl/ci5hdmlm' },
  { id: 'b2', name: 'Cheese Burger', category: 'Burgers', price: 150, image: 'https://imgs.search.brave.com/my_85fVjLxorBJcICYarcjxVGJ7jI6hGklv3EjMNrfs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzEzLzc2Lzc4LzA0/LzM2MF9GXzEzNzY3/ODA0MjFfSVdQN1NK/VHk2SU85SThxTlZi/MklTVG9XZHg3MkFC/OUcuanBn' },
  // Rolls
  { id: 'r1', name: 'Paneer Kathi Roll', category: 'Rolls', price: 180, image: 'https://imgs.search.brave.com/2UuNl7OOT4h05azA2p6w3A2hK6my1n5lUWsGY-906BU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTU3/MzE2Njg4L3Bob3Rv/L3RocmVlLXNwcmlu/Zy1yb2xscy13aXRo/LXNhdWNlLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz13MzJU/MDRWNWFWckhzczRK/RzF6R1FVN2xuRjZa/U0JlMWxKRkxOa3pS/UUIwPQ' },
  { id: 'r2', name: 'Veggie Roll', category: 'Rolls', price: 140, image: 'https://imgs.search.brave.com/DqGu0zwURq9XnIaz3VyuSjjkbomtOoPYnUSDdvGS9FQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9zdHJl/ZXQtc3R5bGUtdmVn/LWZyYW5raWUtcm9s/bC1zY2hlendhbi1j/dWlzaW5lLWFzaWEt/Y2hpbmVzZS1jdWlz/aW5lLXRyYWRpdGlv/bmFsLXN0cmVldC1z/dHlsZS12ZWctZnJh/bmtpZS1yb2xsLXNj/aGV6d2FuLWN1aXNp/bmUtMzI3NzkyMTEz/LmpwZw' },
  // Desserts
  { id: 'd1', name: 'Choco Lava Cake', category: 'Desserts', price: 100, image: 'https://imgs.search.brave.com/wK3KJo94Pdbws1SJgGMfmIfUHsc8GBCSGMqxjYFyaX0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvOTAw/MDc0OTY0L3Bob3Rv/L21vbHRlbi1jaG9j/b2xhdGUtbGF2YS1i/cm93bmllLWNha2Vz/LWNsb3NlLXVwLWlz/b2xhdGVkLW9uLXdo/aXRlLWJhY2tncm91/bmQuanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPWpWWEowTEds/QU9Zano3YllURGlu/YTFVc3FVd0RMYnk5/dFphVklDWkhjQm89' },
  // Drinks
  { id: 'dr1', name: 'Mojito', category: 'Drinks', price: 90, image: 'https://imgs.search.brave.com/4qdw-sYDSBjPD56R3TDqMgc0P8UFeQV4m2N3AQOntGM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cGhvdG9zLWdyYXR1/aXRlL3Z1ZS1jb3Rl/LW1vaml0by1jb2Nr/dGFpbC1tZW50aGUt/Y2l0cm9uLXZlcnQt/Z2xhY2Utc2VhdS1n/bGFjZV8xNzY0NzQt/MjQ5OS5qcGc_c2Vt/dD1haXNfaHlicmlk/Jnc9NzQwJnE9ODA' },
];


type FoodItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
};

// Each card will be used inside a 2-column FlatList; use container style to size properly.
const FoodItemCard = ({ item }: { item: FoodItem }) => (
  <View style={styles.card}>
    <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
    <View style={styles.cardBody}>
      <Text style={styles.itemName}>{item.name}</Text>
      <View style={styles.rowBetween}>
        <Text style={styles.itemPrice}>₹{item.price}</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

// Poori Home Screen ka main component
export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const listRef = useRef<FlatList<FoodItem>>(null);
  const chipScrollRef = useRef<ScrollView>(null);
  const chipOffsetsRef = useRef<Record<string, number>>({});
  const [user, setUser] = useState<User | null>(auth.currentUser);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const [greeting, setGreeting] = useState<string>(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const h = new Date().getHours();
      setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening');
    }, 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  // Yeh line selected category ke hisaab se food items ko filter karti hai
  const filteredFood = selectedCategory === 'All' 
    ? DUMMY_FOOD_DATA 
    : DUMMY_FOOD_DATA.filter(item => item.category === selectedCategory);

  // Whenever category changes, ensure list is scrolled to top
  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [selectedCategory]);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.topRow}>
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Ionicons name="person" size={22} color="#fff" />
            </View>
          )}
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.userName}>{user?.displayName || 'Friend'}</Text>
          </View>
        </View>
        <Text style={styles.title}>What would you like to eat today?</Text>
      </View>

      {/* If user not resolved yet, show a simple skeleton header */}
      {!user ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 }}>
          <View style={{ height: 12, width: 120, backgroundColor: '#e5e7eb', borderRadius: 6, marginBottom: 8 }} />
          <View style={{ height: 26, width: 220, backgroundColor: '#e5e7eb', borderRadius: 8 }} />
        </View>
      ) : null}

      {/* Food items - sticky chips header + 2 columns */}
      <FlatList
        ref={listRef}
        style={styles.itemsList}
        data={filteredFood}
        renderItem={({ item }) => <FoodItemCard item={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.foodListContainer}
        ListHeaderComponent={() => (
          <View style={styles.chipsStickyContainer}>
            <ScrollView
              ref={chipScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {CATEGORIES.map((cat) => {
                const isActive = cat.name === selectedCategory;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onLayout={(e) => {
                      chipOffsetsRef.current[cat.id] = e.nativeEvent.layout.x;
                    }}
                    onPress={() => {
                      setSelectedCategory(cat.name);
                      // keep selected chip in view
                      requestAnimationFrame(() => {
                        const x = chipOffsetsRef.current[cat.id] ?? 0;
                        chipScrollRef.current?.scrollTo({ x: Math.max(0, x - 16), animated: true });
                      });
                    }}
                    style={[styles.catButton, isActive ? styles.catButtonActive : styles.catButtonInactive]}
                  >
                    <Ionicons name={cat.icon as any} size={18} color={isActive ? 'white' : '#374151'} />
                    <Text style={[styles.catLabel, isActive ? styles.catLabelActive : styles.catLabelInactive]} numberOfLines={1}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
        stickyHeaderIndices={[0]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF8F0' },
  header: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 8 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginBottom: 8 },
  welcome: { fontSize: 16, color: '#6b7280' },
  title: { fontSize: 24, fontWeight: '800', color: '#111827', marginTop: 6 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ddd' },
  avatarFallback: { backgroundColor: '#ea580c', alignItems: 'center', justifyContent: 'center' },
  greeting: { fontSize: 12, color: '#6b7280' },
  userName: { fontSize: 18, fontWeight: '800', color: '#111827', marginTop: 2 },
  categoriesContainer: { paddingHorizontal: 16, paddingVertical: 10, paddingBottom: 12 },
  chipsStickyContainer: { backgroundColor: '#FFF8F0' },
  catButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 22,
    marginRight: 12,
  },
  catButtonActive: { backgroundColor: '#ea580c' },
  catButtonInactive: { backgroundColor: '#e5e7eb' },
  catLabel: { marginLeft: 8, fontWeight: '700' },
  catLabelActive: { color: '#fff' },
  catLabelInactive: { color: '#374151' },
  foodListContainer: { paddingHorizontal: 8, paddingBottom: 24 },
  itemsList: { flex: 1 },
  columnWrapper: { justifyContent: 'space-between' },
  card: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', marginBottom: 12, flexBasis: '48%' },
  cardImage: { width: '100%', height: 128 },
  cardBody: { padding: 12 },
  itemName: { fontSize: 16, fontWeight: '700', color: '#1f2937' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  itemPrice: { fontSize: 16, fontWeight: '700', color: '#16a34a' },
  addBtn: { backgroundColor: '#ea580c', borderRadius: 999, padding: 8 },
});