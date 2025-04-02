// screens/PokemonDetailScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { COLORS, SPACING, FONT_SIZES, SHADOWS, BORDER_RADIUS } from '../utils/theme';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { usePokemonDetails } from '../hooks/usePokemonDetails';

// If you're using icons, uncomment this:
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
type Route = {
  "PokemonDetailScreen": {
    "url": string,
    "name": string
  }
}
const PokemonDetailScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<Route, "PokemonDetailScreen">>()
  const { url, name } = route.params;
  // React Query hook for fetching Pokemon details
  const { data, isLoading, isError, error } = usePokemonDetails(url)
  console.log("Data : ", data)
  // Get color based on Pokemon type
  const getTypeColor = (type: string) => {
    const typeColors: {[label:string]: string} = {
      normal: '#A8A878',
      fire: COLORS.primary,
      water: COLORS.water,
      grass: COLORS.secondary,
      electric: COLORS.accent,
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dark: COLORS.dark,
      dragon: COLORS.dragon,
      steel: '#B8B8D0',
      fairy: '#EE99AC',
    };
    
    return typeColors[type ] || COLORS.gray;
  };

  // Format Pokemon ID to have leading zeros
  const formatId = (id: number) => {
    return `#${String(id).padStart(3, '0')}`;
  };

  // Convert height from decimeters to meters and format
  const formatHeight = (height: number) => {
    return `${(height / 10).toFixed(1)}m`;
  };

  // Convert weight from hectograms to kilograms and format
  const formatWeight = (weight: number ) => {
    return `${(weight / 10).toFixed(1)}kg`;
  };

  // Format stat name
  const formatStatName = (statName: string) => {
    const statNames: {[label:string]: string} = {
      'hp': 'HP',
      'attack': 'Attack',
      'defense': 'Defense',
      'special-attack': 'Sp. Atk',
      'special-defense': 'Sp. Def',
      'speed': 'Speed'
    };
    
    return statNames[statName] || statName;
  };

  // Calculate stat percentage for the stat bars (max is usually 255)
  const calculateStatPercentage = (value: number) => {
    return (value / 255) * 100;
  };

  // If loading, show loading screen
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Image
          source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' }}
          style={styles.loadingBall}
        />
        {/* <ActivityIndicator size="large" color={COLORS.primary} style={styles.loadingSpinner} /> */}
        <Text style={styles.loadingText}>Loading {name}...</Text>
      </SafeAreaView>
    );
  }

  // If error, show error screen
  if (!data || isError) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Something went wrong!</Text>
        <Text style={styles.errorMessage}>{error?.message || ''}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  console.log("Types : ", data)
  // Get the primary type for the pokemon to use as theme color
  const primaryType = data.types && data.types.length > 0 ? data.types[0].type.name : 'normal';
  const primaryColor = getTypeColor(primaryType);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button */}
      <View style={[styles.header, { backgroundColor: primaryColor }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          {/* Uncomment if using icons */}
          {/* <Icon name="arrow-left" size={24} color={COLORS.white} /> */}
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{data.name.charAt(0).toUpperCase() + data.name.slice(1)}</Text>
        <Text style={styles.pokemonId}>{formatId(data.id)}</Text>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Pokemon Image */}
        <View style={[styles.imageContainer, { backgroundColor: primaryColor }]}>
          <Image
            source={{
              uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`,
            }}
            style={styles.pokemonImage}
          />
        </View>

        {/* Types */}
        <View style={styles.typesContainer}>
          {data.types.map((typeInfo: {type: {name: string}}) => (
            <View
              key={typeInfo.type.name}
              style={[
                styles.typeBadge,
                { backgroundColor: getTypeColor(typeInfo.type.name) },
              ]}
            >
              <Text style={styles.typeText}>
                {typeInfo.type.name.charAt(0).toUpperCase() + typeInfo.type.name.slice(1)}
              </Text>
            </View>
          ))}
        </View>

        {/* Info Section */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Height</Text>
              <Text style={styles.infoValue}>{formatHeight(data.height)}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Weight</Text>
              <Text style={styles.infoValue}>{formatWeight(data.weight)}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Base Exp</Text>
              <Text style={styles.infoValue}>{data.base_experience}</Text>
            </View>
          </View>

          {/* Abilities */}
          <Text style={styles.sectionTitle}>Abilities</Text>
          <View style={styles.abilitiesContainer}>
            {data.abilities.map((abilityInfo) => (
              <View key={abilityInfo.ability.name} style={styles.abilityItem}>
                <Text style={styles.abilityName}>
                  {abilityInfo.ability.name.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </Text>
                {abilityInfo.is_hidden && (
                  <Text style={styles.hiddenAbility}>(Hidden)</Text>
                )}
              </View>
            ))}
          </View>

          {/* Stats */}
          <Text style={styles.sectionTitle}>Base Stats</Text>
          <View style={styles.statsContainer}>
            {data.stats.map((statInfo) => (
              <View key={statInfo.stat.name} style={styles.statItem}>
                <Text style={styles.statName}>
                  {formatStatName(statInfo.stat.name)}
                </Text>
                <Text style={styles.statValue}>{statInfo.base_stat}</Text>
                <View style={styles.statBarContainer}>
                  <View
                    style={[
                      styles.statBar,
                      {
                        width: `${calculateStatPercentage(statInfo.base_stat)}%`,
                        backgroundColor: primaryColor,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Moves Section (Limited to 5 for brevity) */}
          <Text style={styles.sectionTitle}>Moves</Text>
          <View style={styles.movesContainer}>
            {data.moves.slice(0, 5).map((moveInfo) => (
              <View key={moveInfo.move.name} style={styles.moveItem}>
                <Text style={styles.moveName}>
                  {moveInfo.move.name.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </Text>
              </View>
            ))}
            <Text style={styles.moveCount}>
              +{data.moves.length - 5} more moves
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.l,
  },
  errorText: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: 'bold',
    color: COLORS.error,
    marginBottom: SPACING.m,
  },
  errorMessage: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SPACING.l,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.l,
    borderRadius: BORDER_RADIUS.medium,
  },
  retryButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SPACING.m,
    paddingBottom: SPACING.s,
    paddingHorizontal: SPACING.l,
  },
  backButton: {
    padding: SPACING.s,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xlarge,
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    fontSize: FONT_SIZES.xlarge,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: SPACING.s,
  },
  pokemonId: {
    fontSize: FONT_SIZES.large,
    fontWeight: 'bold',
    color: COLORS.white,
    opacity: 0.8,
  },
  scrollContainer: {
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    paddingBottom: SPACING.l,
  },
  pokemonImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  typesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: -SPACING.l,
    marginBottom: SPACING.m,
  },
  typeBadge: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.medium,
    marginHorizontal: SPACING.xs,
    ...SHADOWS.small,
  },
  typeText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.xlarge,
    borderTopRightRadius: BORDER_RADIUS.xlarge,
    padding: SPACING.l,
    ...SHADOWS.medium,
    marginTop: SPACING.s,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SPACING.m,
    marginTop: SPACING.m,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.m,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: FONT_SIZES.small,
    color: COLORS.gray,
    marginBottom: SPACING.xs,
  },
  infoValue: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.dark,
  },
  abilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.m,
  },
  abilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: BORDER_RADIUS.medium,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.m,
    marginRight: SPACING.s,
    marginBottom: SPACING.s,
  },
  abilityName: {
    fontSize: FONT_SIZES.small,
    color: COLORS.dark,
  },
  hiddenAbility: {
    fontSize: FONT_SIZES.small,
    color: COLORS.gray,
    marginLeft: SPACING.xs,
    fontStyle: 'italic',
  },
  statsContainer: {
    marginBottom: SPACING.m,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  statName: {
    width: 70,
    fontSize: FONT_SIZES.medium,
    color: COLORS.dark,
  },
  statValue: {
    width: 40,
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    textAlign: 'right',
    marginRight: SPACING.s,
  },
  statBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: BORDER_RADIUS.small,
    overflow: 'hidden',
  },
  statBar: {
    height: '100%',
  },
  movesContainer: {
    marginBottom: SPACING.l,
  },
  moveItem: {
    backgroundColor: COLORS.lightGray,
    borderRadius: BORDER_RADIUS.medium,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.m,
    marginBottom: SPACING.s,
  },
  moveName: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.dark,
  },
  moveCount: {
    fontSize: FONT_SIZES.small,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
});

export default PokemonDetailScreen;