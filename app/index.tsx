import React, { useEffect, useState, useCallback, useRef } from 'react';
import { FlatList, ActivityIndicator, View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import { useMovies } from '../hooks/useMovies';

export default function HomeScreen() {
  const router = useRouter();
  const { movies, loading, page, hasMore, fetchMovies } = useMovies();
  const [query, setQuery] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Chargement initial
  useEffect(() => {
    fetchMovies('', 1);
  }, [fetchMovies]);

  // Debounce sur la recherche
  const handleSearch = useCallback((text: string) => {
    setQuery(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchMovies(text, 1);
    }, 500);
  }, [fetchMovies]);

  // Pagination infinie
  const handleEndReached = useCallback(() => {
    if (!loading && hasMore) {
      fetchMovies(query, page + 1);
    }
  }, [loading, hasMore, fetchMovies, query, page]);

  return (
    <View style={styles.container}>
      <SearchBar value={query} onChangeText={handleSearch} />
      <Pressable style={styles.favBtn} onPress={() => router.push('/favorites')}>
        <Text style={styles.favBtnText}>❤️ Mes favoris</Text>
      </Pressable>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => <MovieCard movie={item} index={index} />}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator color="#fff" style={{ margin: 16 }} /> : null}
        ListEmptyComponent={
          !loading ? <Text style={styles.empty}>Aucun film trouvé</Text> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  favBtn: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#1c1c1e',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  favBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  empty: { color: '#888', textAlign: 'center', marginTop: 40, fontSize: 15 },
});