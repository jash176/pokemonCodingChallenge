import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useTeam } from '../contexts/team';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SHADOWS, SPACING } from '../utils/theme';
import { NavigationProp, useNavigation } from '@react-navigation/native';

export default function TeamScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { team, removePokemon } = useTeam();

  const handleRemovePokemon = (pokemonName: string) => {
    Alert.alert(
      'Remove Pokémon',
      `Are you sure you want to remove ${pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)} from your team?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: () => {
            removePokemon(pokemonName);
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderPokemonCard = ({ item, index }: any) => {
    // Extract the Pokemon ID from the URL
    const urlParts = item.url.split('/');
    const pokemonId = urlParts[urlParts.length - 2];

    return (
      <View style={styles.card}>
        <View style={styles.pokemonInfo}>
          <Text style={styles.pokemonId}>#{pokemonId}</Text>
          <Text style={styles.pokemonName}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
        </View>
        <View style={styles.cardRightSection}>
          <Image 
            source={{ 
              uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png` 
            }} 
            style={styles.pokemonImage} 
          />
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => handleRemovePokemon(item.name)}
          >
            <Text style={styles.removeButtonText}>Release</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>My Team</Text>
        <View style={{ width: 30 }} />
      </View>

      {team.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image 
            source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' }}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyText}>Your team is empty!</Text>
          <Text style={styles.emptySubtext}>Catch some Pokémon to add them to your team.</Text>
          <TouchableOpacity
            style={styles.catchButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.catchButtonText}>Go Catch Pokémon</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={team}
          renderItem={renderPokemonCard}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.list}
          ListHeaderComponent={() => (
            <Text style={styles.teamCount}>
              {team.length} Pokémon in team ({6 - team.length} slots available)
            </Text>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
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
  backButton: {
    padding: SPACING.xs,
  },
  backButtonText: {
    fontSize: FONT_SIZES.xlarge,
    color: COLORS.primary,
  },
  title: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  teamCount: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
    marginVertical: SPACING.m,
  },
  list: {
    padding: SPACING.m,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.medium,
    marginBottom: SPACING.m,
    padding: SPACING.m,
    ...SHADOWS.small,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.secondary,
  },
  pokemonInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  cardRightSection: {
    alignItems: 'center',
  },
  pokemonId: {
    color: COLORS.gray,
    fontSize: FONT_SIZES.medium,
    marginBottom: SPACING.xs,
  },
  pokemonName: {
    fontSize: FONT_SIZES.large,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SPACING.s,
  },
  pokemonImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  removeButton: {
    backgroundColor: COLORS.error,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.small,
    marginTop: SPACING.xs,
  },
  removeButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyImage: {
    width: 100,
    height: 100,
    marginBottom: SPACING.l,
  },
  emptyText: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SPACING.s,
  },
  emptySubtext: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SPACING.l,
  },
  catchButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.m,
    borderRadius: BORDER_RADIUS.medium,
  },
  catchButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: FONT_SIZES.medium,
  },
});