import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useFavorites, Movie } from '../../context/FavoritesContext';
import { TMDB_IMAGE_BASE, TMDB_API_KEY, TMDB_BASE_URL } from '../../constants/api';

export default function MovieDetailScreen() {
  // Récupération de l'id passé en paramètre de navigation
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [movie, setMovie] = React.useState<Movie | null>(null);

  // SharedValue pour animer le bouton favori
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Gesture tap sur le bouton favori avec animation spring
  const tap = Gesture.Tap()
    .runOnJS(true)
    .onBegin(() => {
      scale.value = withSpring(0.9);
    })
    .onFinalize(() => {
      scale.value = withSpring(1);
    })
    .onEnd(() => {
      if (!movie) return;
      if (isFavorite(movie.id)) {
        removeFavorite(movie.id);
      } else {
        addFavorite(movie);
      }
    });

  // Chargement du détail du film depuis l'API TMDB
  React.useEffect(() => {
    fetch(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`)
      .then((r) => r.json())
      .then(setMovie);
  }, [id]);

  if (!movie) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#fff' }}>Chargement...</Text>
      </View>
    );
  }

  const fav = isFavorite(movie.id);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {movie.poster_path && (
        <Image
          source={{ uri: `${TMDB_IMAGE_BASE}${movie.poster_path}` }}
          style={styles.poster}
        />
      )}
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.rating}>
        ⭐ {movie.vote_average.toFixed(1)} · {movie.release_date?.slice(0, 4)}
      </Text>
      <Text style={styles.overview}>{movie.overview}</Text>

      <GestureDetector gesture={tap}>
        <Animated.View style={[styles.favButton, fav && styles.favButtonActive, animatedStyle]}>
          <Text style={styles.favButtonText}>
            {fav ? '❤️ Retirer des favoris' : '🤍 Ajouter aux favoris'}
          </Text>
        </Animated.View>
      </GestureDetector>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { padding: 16, alignItems: 'center', gap: 12 },
  center: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  poster: { width: '100%', height: 400, borderRadius: 12 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', textAlign: 'center' },
  rating: { color: '#f5c518', fontSize: 16 },
  overview: { color: '#ccc', fontSize: 14, lineHeight: 22, textAlign: 'center' },
  favButton: {
    backgroundColor: '#1c1c1e',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 8,
    width: '100%',
    alignItems: 'center',
  },
  favButtonActive: { backgroundColor: '#3a1a1a' },
  favButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});