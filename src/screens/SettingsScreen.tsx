import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SHADOWS, SPACING } from '../utils/theme';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/auth';
import { StorageUtils } from '../utils/storage';

export default function SettingsScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { logout, user } = useAuth();

  // Get user initials from email or name
  const getUserInitials = () => {
    if (!user) return "?";
    
    if (user.displayName) {
      return user.displayName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase();
    }
    
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    
    return "?";
  };

  // Get user display name
  const getDisplayName = () => {
    if (!user) return "User";
    
    if (user.displayName) {
      return user.displayName;
    }
    
    if (user.email) {
      // Extract name part from email (before @)
      const emailName = user.email.split('@')[0];
      // Capitalize first letter and replace dots/underscores with spaces
      return emailName
        .replace(/[._]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
    }
    
    return "User";
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? This will also clear your team data.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            // Clear all local data
            StorageUtils.clearAll();
            // Logout user
            logout();
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleClearTeam = () => {
    Alert.alert(
      'Clear Team',
      'Are you sure you want to clear your team? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          onPress: () => {
            StorageUtils.removeItem('pokemon-team');
            Alert.alert('Success', 'Your team has been cleared.');
          },
          style: 'destructive',
        },
      ]
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
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          {user?.photoURL ? (
            <Image 
              source={{ uri: user.photoURL }} 
              style={styles.profileImage} 
            />
          ) : (
            <View style={styles.initialsContainer}>
              <Text style={styles.initialsText}>{getUserInitials()}</Text>
            </View>
          )}
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{getDisplayName()}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'No email'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity testID='btn-logout' style={styles.settingItem} onPress={handleLogout}>
            <Text style={styles.settingText}>Logout</Text>
            <Text style={styles.logoutText}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <TouchableOpacity style={styles.settingItem} onPress={handleClearTeam}>
            <Text style={styles.settingText}>Clear Team Data</Text>
            <Text style={styles.logoutText}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingText}>Version</Text>
            <Text style={styles.versionText}>1.0.0</Text>
          </View>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.l,
    marginTop: SPACING.m,
    ...SHADOWS.small,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  initialsContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xlarge,
    fontWeight: 'bold',
  },
  profileInfo: {
    marginLeft: SPACING.l,
    flex: 1,
  },
  profileName: {
    fontSize: FONT_SIZES.large,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: SPACING.xs,
  },
  profileEmail: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.gray,
  },
  section: {
    marginVertical: SPACING.m,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.medium,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.gray,
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  settingText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.dark,
  },
  logoutText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.error,
  },
  versionText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.gray,
  },
});