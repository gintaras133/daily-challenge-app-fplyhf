
import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { colors, buttonStyles } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { router } from "expo-router";
import TodaysChallengeCard from "@/components/TodaysChallengeCard";
import { useAuth } from "@/contexts/AuthContext";
import { useFonts, PlayfairDisplay_900Black } from '@expo-google-fonts/playfair-display';

export default function HomeScreen() {
  const { userProfile } = useAuth();
  
  // Load Playfair Display font
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_900Black,
  });
  
  // Sample data - in a real app, this would come from an API
  const streak = 15;
  const followers = 142;
  
  const todayTask = {
    task: "Story in 3 Clips",
    constraint: "Tell a mini story in three separate shots or angles.",
    skillMastery: "Narrative pacing, basic sequencing, and transitions.",
    duration: "20–40 sec final video\n60 min for shooting + editing.",
    suggestion: "Use CapCut transition effects between clips",
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

  // Don't render until fonts are loaded
  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>BLOOP</Text>
        </View>

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
                android_material_icon_name="local-fire-department" 
                size={20} 
                color="#000000"
              />
              <Text style={styles.statText}>{streak}</Text>
            </View>
            
            <View style={styles.statBadge}>
              <IconSymbol 
                android_material_icon_name="people" 
                size={20} 
                color="#000000"
              />
              <Text style={styles.statText}>{followers}</Text>
            </View>
          </View>
        </View>

        {/* Task Card */}
        <View style={styles.challengeCardContainer}>
          <TodaysChallengeCard
            task={todayTask.task}
            constraint={todayTask.constraint}
            skillMastery={todayTask.skillMastery}
            duration={todayTask.duration}
            suggestion={todayTask.suggestion}
            partner={todayTask.partner}
          />
        </View>

        {/* Start Task Button */}
        <TouchableOpacity 
          style={styles.startButton}
          onPress={handleStartChallenge}
        >
          <Text style={styles.startButtonText}>START TASK</Text>
        </TouchableOpacity>

        {/* Bottom Message */}
        <Text style={styles.bottomMessage}>
          Complete the task to unlock voting & scroll mode
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  logoContainer: {
    position: 'absolute',
    top: 48,
    left: 24,
    zIndex: 10,
  },
  logo: {
    fontSize: 36,
    fontFamily: 'PlayfairDisplay_900Black',
    color: '#003399',
    letterSpacing: 1,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
  },
  greeting: {
    color: colors.text,
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
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  statText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
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
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  bottomMessage: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
});
