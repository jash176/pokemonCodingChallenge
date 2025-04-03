import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {BORDER_RADIUS, COLORS, FONT_SIZES, SPACING} from '../utils/theme';

export interface PokemonPreviewSheetProps {
  onViewDetails: (pokemon: any) => void;
}

export interface PokemonPreviewSheetRef {
  open: (pokemon: any) => void;
  close: () => void;
}

const PokemonPreviewSheet = forwardRef<
  PokemonPreviewSheetRef,
  PokemonPreviewSheetProps
>(({onViewDetails}, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<any>(null);

  useImperativeHandle(ref, () => ({
    open: pokemon => {
      console.log('✅ open() called with:', pokemon);
      setSelectedPokemon(pokemon);
      setTimeout(() => {
        console.log('📌 bottomSheetRef.current:', bottomSheetRef.current);
        bottomSheetRef.current?.expand(); // Try this first
      }, 50);
    },
    close: () => {
      console.log('🔒 Closing BottomSheet...');
      bottomSheetRef.current?.close();
    },
  }));

  return (
    <BottomSheet
      ref={bottomSheetRef}
      onChange={() => {}}
      index={-1}
      snapPoints={['40%']}
      enablePanDownToClose={true}>
      <BottomSheetView
        style={{
          flex: 1,
          padding: 36,
          alignItems: 'center',
        }}>
        {selectedPokemon && (
          <View style={styles.previewContainer}>
            <Image
              source={{
                uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${selectedPokemon.id}.png`,
              }}
              style={styles.previewImage}
            />
            <View style={styles.previewInfo}>
              <Text style={styles.previewName}>
                {selectedPokemon.name.charAt(0).toUpperCase() +
                  selectedPokemon.name.slice(1)}
              </Text>
              <Text style={styles.previewId}>#{selectedPokemon.id}</Text>

              <TouchableOpacity
                style={styles.viewDetailsButton}
                onPress={() => {
                  bottomSheetRef.current?.close();
                  onViewDetails(selectedPokemon);
                }}>
                <Text style={styles.viewDetailsText}>View Full Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: COLORS.white,
  },
  bottomSheetIndicator: {
    backgroundColor: COLORS.gray,
    width: 40,
  },
  previewContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: SPACING.l,
    alignItems: 'center',
  },
  previewImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  previewInfo: {
    flex: 1,
    marginLeft: SPACING.l,
  },
  previewName: {
    fontSize: FONT_SIZES.xlarge,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SPACING.s,
  },
  previewId: {
    fontSize: FONT_SIZES.large,
    color: COLORS.gray,
    marginBottom: SPACING.m,
  },
  viewDetailsButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderRadius: BORDER_RADIUS.small,
    alignItems: 'center',
    marginTop: SPACING.m,
  },
  viewDetailsText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: FONT_SIZES.medium,
  },
});

export default PokemonPreviewSheet;
