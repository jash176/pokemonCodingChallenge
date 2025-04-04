import React, {useCallback, useEffect, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
  Pressable,
} from 'react-native';
import {useFetchPokemon} from '../hooks/useFetchPokemon';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {
  BORDER_RADIUS,
  COLORS,
  FONT_SIZES,
  SHADOWS,
  SPACING,
} from '../utils/theme';
import {useTeam} from '../contexts/team';
import PokemonPreviewSheet, {
  PokemonPreviewSheetRef,
} from '../components/PokemonPreviewSheet';
import {
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import messaging from '@react-native-firebase/messaging';
import InfoOutline from '../assets/icons/InfoOutline';
export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useFetchPokemon();
  const {addPokemon, isPokemonInTeam} = useTeam();

  // Reference to the bottom sheet component
  const previewSheetRef = useRef<PokemonPreviewSheetRef>(null);
  useEffect(() => {
    // Check if app was opened from a notification (when app was in quit state)
    const checkInitialNotification = async () => {
      const initialNotification = await messaging().getInitialNotification();
      if (initialNotification) {
        handleNotificationNavigation(initialNotification.data);
      }
    };
    checkInitialNotification();
  }, [navigation]);
  // Function to handle navigation from notification data
  const handleNotificationNavigation = (data: any) => {
    if (data && data.url && data.pokemonName) {
      navigation.navigate('Details', {
        url: data.url,
        name: data.pokemonName,
      });
    }
  };
  // Handle catching a Pokemon
  const handleCatchPokemon = useCallback(
    (pokemon: any, index: number) => {
      // Check if already in team
      if (isPokemonInTeam(pokemon.name)) {
        Alert.alert(
          'Already Caught',
          `${
            pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
          } is already in your team!`,
        );
        return;
      }

      // Try to add to team
      const success = addPokemon({
        name: pokemon.name,
        url: pokemon.url,
      });

      if (success) {
        Alert.alert(
          'Success',
          `${
            pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
          } was added to your team!`,
        );
      } else {
        Alert.alert(
          'Team Full',
          'Your team already has 6 Pokémon! Remove one to catch more.',
        );
      }
    },
    [addPokemon, isPokemonInTeam],
  );

  // Function to open the preview sheet
  const openPokemonPreview = useCallback((pokemon: any, index: number) => {
    previewSheetRef.current?.open({
      ...pokemon,
      id: index + 1,
    });
  }, []);

  // Handle navigation to details
  const handleViewDetails = useCallback(
    (pokemon: any) => {
      navigation.navigate('Details', {
        url: pokemon.url,
        name: pokemon.name,
      });
    },
    [navigation],
  );

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  // Display Pokemon card
  const renderPokemonCard = ({item, index}: any) => {
    const pokemonId = index + 1;
    const isInTeam = isPokemonInTeam(item.name);

    return (
      <Pressable
        style={({pressed}) => [
          styles.card,
          isInTeam && styles.caughtCard,
          pressed && styles.cardPressed, // Scaling effect
        ]}
        onPress={() => {
          navigation.navigate('Details', {url: item.url, name: item.name});
        }}>
        {/* Pokémon Image */}
        <View style={styles.pokemonImageContainer}>
          <Image
            source={{
              uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
            }}
            style={styles.pokemonImage}
          />
        </View>

        {/* Pokémon Info */}
        <View style={styles.pokemonInfo}>
          <Text style={styles.pokemonId}>#{pokemonId}</Text>
          <Text style={styles.pokemonName} numberOfLines={1}>
            {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={event => {
              event.stopPropagation();
              openPokemonPreview(item, index);
            }}>
            {/* <Text style={styles.infoButtonText}>Info</Text> */}
            <InfoOutline />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.catchButton, isInTeam && styles.caughtButton]}
            onPress={event => {
              event.stopPropagation();
              handleCatchPokemon(item, index);
            }}>
            <Text style={styles.catchButtonText}>
              {isInTeam ? 'Caught' : 'Catch'}
            </Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    );
  };

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#FF5733" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: 'red', fontSize: 16}}>
          Failed to load Pokémon. Please try again.
        </Text>
      </View>
    );
  }

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Pokédex</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => {
                navigation.navigate('Teams');
              }}>
              <Text style={styles.headerButtonText}>Teams</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => {
                navigation.navigate('Settings');
              }}>
              <Text style={styles.headerButtonText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={data?.pages.flatMap(page => page.results)}
          renderItem={renderPokemonCard}
          keyExtractor={item => item.name}
          contentContainerStyle={styles.list}
          onEndReached={() => hasNextPage && fetchNextPage()}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            isFetchingNextPage && (
              <View style={styles.footer}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.footerText}>Loading more Pokémon...</Text>
              </View>
            )
          }
        />

        {/* Pokemon Preview Bottom Sheet */}
        <PokemonPreviewSheet
          ref={previewSheetRef}
          onViewDetails={handleViewDetails}
        />
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.light,
  },
  loadingBall: {
    width: 60,
    height: 60,
    marginBottom: SPACING.m,
  },
  loadingSpinner: {
    position: 'absolute',
  },
  loadingText: {
    color: COLORS.dark,
    fontSize: FONT_SIZES.large,
    marginTop: SPACING.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.m,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  title: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.small,
    marginLeft: SPACING.s,
  },
  headerButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  profileButton: {
    padding: SPACING.xs,
  },
  profileIconPlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.lightGray,
  },
  list: {
    padding: SPACING.m,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.medium,
    marginBottom: SPACING.m,
    padding: SPACING.m,
    ...SHADOWS.small,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.primary,
  },
  cardRightSection: {
    alignItems: 'center',
  },

  typeBadge: {
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.small,
    alignSelf: 'flex-start',
  },
  typeText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.small,
    fontWeight: '600',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.m,
  },
  footerText: {
    color: COLORS.gray,
    marginLeft: SPACING.s,
  },

  cardPressed: {
    transform: [{scale: 0.97}], // Small scaling effect
    opacity: 0.9,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: BORDER_RADIUS.medium,
  },
  pokemonImageContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pokemonImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  pokemonInfo: {
    alignItems: 'center',
    marginTop: SPACING.s,
  },
  pokemonId: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.gray,
  },
  pokemonName: {
    fontSize: FONT_SIZES.large,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: SPACING.m,
  },
  infoButton: {
    borderRadius: BORDER_RADIUS.small,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.s,
  },
  infoButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  catchButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.m,
    borderRadius: BORDER_RADIUS.small,
    alignSelf: 'center',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  caughtButton: {
    backgroundColor: COLORS.success,
  },
  catchButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  caughtCard: {
    borderColor: COLORS.success,
    borderWidth: 2,
  },
});
