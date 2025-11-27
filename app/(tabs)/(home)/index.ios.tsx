
import React from "react";
import { Stack } from "expo-router";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { colors, buttonStyles } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { router } from "expo-router";
import TodaysChallengeCard from "@/components/TodaysChallengeCard";
import { useAuth } from "@/contexts/AuthContext";

export default function HomeScreen() {
  const { userProfile } = useAuth();
  
  // Sample data - in a real app, this would come from an API
  const streak = 15;
  const followers = 142;
  const todayPlace = "-";
  
  const todayChallenge = {
    challenge: "Assemble furniture in 60 seconds",
    environment: "Your living room or any indoor space",
    phrase: "Where's the instructions manual?!",
    partner: "CapCut"
  };

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Get first name from full name
  const getFirstName = () => {
    if (!userProfile?.full_name) return "User";
    return userProfile.full_name.split(' ')[0];
  };

  const handleStartChallenge = () => {
    router.push('/(tabs)/(home)/record');
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
            {/* Header with greeting and stats */}
            <View style={styles.header}>
              {/* Personalized Greeting */}
              <Text style={styles.greeting}>
                {getGreeting()}, {getFirstName()}
              </Text>

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
                <Text style={styles.sponsorName}>CapCut</Text>
              </View>
            </View>

            {/* Challenge Card */}
            <View style={styles.challengeCardContainer}>
              <TodaysChallengeCard
                challenge={todayChallenge.challenge}
                environment={todayChallenge.environment}
                phrase={todayChallenge.phrase}
                partner={todayChallenge.partner}
              />
            </View>

            {/* Start Challenge Button */}
            <TouchableOpacity 
              style={styles.startButton}
              onPress={handleStartChallenge}
            >
              <Text style={styles.startButtonText}>START CHALLENGE</Text>
            </TouchableOpacity>

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
  greeting: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
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
  challengeCardContainer: {
    marginBottom: 24,
  },
  startButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 24,
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
