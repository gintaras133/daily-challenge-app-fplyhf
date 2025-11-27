
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

  return (
    <>
      <Stack.Screen
        options={{
          title: "Daily Task",
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
