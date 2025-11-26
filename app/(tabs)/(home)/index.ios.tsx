
import React from "react";
import { Stack } from "expo-router";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { colors, buttonStyles } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";

export default function HomeScreen() {
  // Sample data - in a real app, this would come from an API
  const streak = 15;
  const followers = 142;
  const todayPlace = "-";
  
  const todayChallenge = {
    challenge: "Assemble furniture in 60 seconds",
    environment: "Your living room or any indoor space",
    phrase: "Where's the instructions manual?!",
    partner: "IKEA"
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Daily Challenge",
          headerShown: false,
        }}
      />
      <View style={styles.container}>
        <LinearGradient
          colors={['#ff9999', '#ffb3b3']}
          style={styles.gradient}
        >
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header with menu button */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.menuButton}>
                <IconSymbol 
                  ios_icon_name="line.3.horizontal"
                  android_material_icon_name="menu" 
                  size={28} 
                  color="#000000"
                />
              </TouchableOpacity>
              
              {/* Stats Row */}
              <View style={styles.statsRow}>
                <View style={styles.statBadge}>
                  <IconSymbol 
                    ios_icon_name="flame.fill"
                    android_material_icon_name="local-fire-department" 
                    size={20} 
                    color="#ffffff"
                  />
                  <Text style={styles.statText}>{streak}</Text>
                </View>
                
                <View style={styles.statBadge}>
                  <IconSymbol 
                    ios_icon_name="person.2.fill"
                    android_material_icon_name="people" 
                    size={20} 
                    color="#ffffff"
                  />
                  <Text style={styles.statText}>{followers}</Text>
                </View>
                
                <View style={styles.statBadge}>
                  <IconSymbol 
                    ios_icon_name="trophy.fill"
                    android_material_icon_name="emoji-events" 
                    size={20} 
                    color="#ffffff"
                  />
                  <Text style={styles.statText}>{todayPlace}</Text>
                </View>
              </View>
            </View>

            {/* Sponsor Section */}
            <View style={styles.sponsorSection}>
              <Text style={styles.sponsorTitle}>THIS MONTH&apos;S SPONSOR</Text>
              <View style={styles.sponsorBadge}>
                <Text style={styles.sponsorName}>IKEA</Text>
              </View>
            </View>

            {/* Challenge Card */}
            <View style={styles.challengeCard}>
              <View style={styles.challengeHeader}>
                <Text style={styles.challengeHeaderText}>Today&apos;s Challenge</Text>
              </View>

              <View style={styles.challengeContent}>
                <View style={styles.challengeSection}>
                  <Text style={styles.challengeLabel}>Challenge:</Text>
                  <Text style={styles.challengeValue}>{todayChallenge.challenge}</Text>
                </View>

                <View style={styles.challengeSection}>
                  <Text style={styles.challengeLabel}>Environment:</Text>
                  <Text style={styles.challengeValue}>{todayChallenge.environment}</Text>
                </View>

                <View style={styles.challengeSection}>
                  <Text style={styles.challengeLabel}>Phrase to say:</Text>
                  <View style={styles.phraseBox}>
                    <Text style={styles.phraseText}>{todayChallenge.phrase}</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.startButton}>
                  <Text style={styles.startButtonText}>START CHALLENGE</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Bottom Message */}
            <Text style={styles.bottomMessage}>
              Complete the challenge to unlock voting & scroll mode
            </Text>
          </ScrollView>
        </LinearGradient>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff9999',
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 40,
  },
  menuButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  statText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  sponsorSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  sponsorTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: 1,
  },
  sponsorBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 60,
    paddingVertical: 32,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: colors.secondary,
  },
  sponsorName: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 4,
  },
  challengeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 4,
    borderColor: colors.secondary,
    overflow: 'hidden',
    marginBottom: 24,
  },
  challengeHeader: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    alignItems: 'center',
  },
  challengeHeaderText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  challengeContent: {
    padding: 24,
  },
  challengeSection: {
    marginBottom: 24,
  },
  challengeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#888888',
    marginBottom: 8,
  },
  challengeValue: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
    lineHeight: 26,
  },
  phraseBox: {
    backgroundColor: '#333333',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  phraseText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 8,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  bottomMessage: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
});
