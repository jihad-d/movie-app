import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FavoritesProvider } from '../context/FavoritesContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FavoritesProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#000' },
            headerTintColor: '#fff',
            contentStyle: { backgroundColor: '#000' },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'Films populaires', headerRight: () => null }} />
          <Stack.Screen name="favorites" options={{ title: 'Mes favoris' }} />
          <Stack.Screen name="movie/[id]" options={{ title: 'Détail' }} />
        </Stack>
      </FavoritesProvider>
    </GestureHandlerRootView>
  );
}   