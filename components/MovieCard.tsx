import React, { useCallback } from 'react';
import { Text, StyleSheet, Image, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Movie } from '../context/FavoritesContext';
import { TMDB_IMAGE_BASE } from '../constants/api';

type Props = {
  movie: Movie;
  index: number;
};

export default function MovieCard({ movie, index }: Props) {
  const router = useRouter();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.95);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1);
  }, [scale]);

  const handlePress = useCallback(() => {
    router.push({
      pathname: '/movie/[id]',
      params: { id: movie.id },
    });
  }, [movie.id, router]);

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).springify()}
      style={animatedStyle}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={styles.card}
      >
        {movie.poster_path ? (
          <Image
            source={{ uri: `${TMDB_IMAGE_BASE}${movie.poster_path}` }}
            style={styles.poster}
          />
        ) : (
          <View style={[styles.poster, styles.noPoster]}>
            <Text>No image</Text>
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>{movie.title}</Text>
          <Text style={styles.rating}>⭐ {movie.vote_average.toFixed(1)}</Text>
          <Text style={styles.date}>{movie.release_date?.slice(0, 4)}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#1c1c1e',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    overflow: 'hidden',
  },
  poster: {
    width: 90,
    height: 130,
  },
  noPoster: {
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    gap: 6,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  rating: {
    color: '#f5c518',
    fontSize: 14,
  },
  date: {
    color: '#888',
    fontSize: 13,
  },
});