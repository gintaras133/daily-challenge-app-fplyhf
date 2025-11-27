
import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { colors, buttonStyles } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { router } from "expo-router";
import TodaysChallengeCard from "@/components/TodaysChallengeCard";
import { useAuth } from "@/contexts/AuthContext";
import { useTask } from "@/contexts/TaskContext";
import { useFonts, PlayfairDisplay_900Black } from '@expo-google-fonts/playfair-display';
import { 
  getTopSafePadding, 
  getBottomSafePadding, 
  getHorizontalPadding,
  getSpacing,
  getBorderRadius,
  getFontSizes,
  getIconSize,
} from '@/utils/responsive';

export default function HomeScreen() {
  const { userProfile } = useAuth();
  const { todayTask } = useTask();
  
  // Load Playfair Display font
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_900Black,
  });
  
  // Sample data - in a real app, this would come from an API
  const streak = 15;
  const followers = 142;

  // Get responsive values
  const fontSizes = getFontSizes();
  const topPadding = getTopSafePadding();
  const bottomPadding = getBottomSafePadding();
  const horizontalPadding = getHorizontalPadding();
  const spacing = getSpacing();

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
        contentContainerStyle={[
          styles.scrollContent,
          { 
            paddingTop: topPadding,
            paddingHorizontal: horizontalPadding,
            paddingBottom: bottomPadding,
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={[styles.logoContainer, { top: topPadding, left: horizontalPadding }]}>
          <Text style={[styles.logo, { fontSize: fontSizes.hero }]}>BLOOP</Text>
        </View>

        {/* Header with greeting and stats */}
        <View style={[styles.header, { marginTop: spacing * 5, marginBottom: spacing * 3.5 }]}>
          {/* Personalized Greeting */}
          <Text style={[styles.greeting, { fontSize: fontSizes.title, marginBottom: spacing * 2 }]}>
            {getGreeting()}, {getFirstName()}
          </Text>

          {/* Stats Row */}
          <View style={[styles.statsRow, { gap: spacing }]}>
            <View style={[
              styles.statBadge, 
              { 
                paddingHorizontal: spacing * 2, 
                paddingVertical: spacing,
                borderRadius: getBorderRadius('large'),
                gap: spacing * 0.5,
              }
            ]}>
              <IconSymbol 
                android_material_icon_name="local-fire-department" 
                size={getIconSize('medium')} 
                color="#000000"
              />
              <Text style={[styles.statText, { fontSize: fontSizes.medium }]}>{streak}</Text>
            </View>
            
            <View style={[
              styles.statBadge, 
              { 
                paddingHorizontal: spacing * 2, 
                paddingVertical: spacing,
                borderRadius: getBorderRadius('large'),
                gap: spacing * 0.5,
              }
            ]}>
              <IconSymbol 
                android_material_icon_name="people" 
                size={getIconSize('medium')} 
                color="#000000"
              />
              <Text style={[styles.statText, { fontSize: fontSizes.medium }]}>{followers}</Text>
            </View>
          </View>
        </View>

        {/* Task Card */}
        <View style={[styles.challengeCardContainer, { marginBottom: spacing * 2 }]}>
          <TodaysChallengeCard
            challenge={todayTask.challenge}
            guidelines={todayTask.guidelines}
            conqueredFear={todayTask.conqueredFear}
            duration={todayTask.duration}
            reward={todayTask.reward}
            partner={todayTask.partner}
            sampleVideoUrl={todayTask.sampleVideoUrl}
          />
        </View>

        {/* Start Task Button */}
        <TouchableOpacity 
          style={[
            styles.startButton,
            {
              paddingVertical: spacing * 2,
              borderRadius: getBorderRadius('large'),
              marginBottom: spacing * 2,
            }
          ]}
          onPress={handleStartChallenge}
        >
          <Text style={[styles.startButtonText, { fontSize: fontSizes.large }]}>START TASK</Text>
        </TouchableOpacity>

        {/* Bottom Message */}
        <Text style={[
          styles.bottomMessage, 
          { 
            fontSize: fontSizes.medium,
            lineHeight: fontSizes.medium * 1.5,
            paddingHorizontal: spacing * 2,
          }
        ]}>
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
    // Dynamic padding applied inline
  },
  logoContainer: {
    position: 'absolute',
    zIndex: 10,
  },
  logo: {
    fontFamily: 'PlayfairDisplay_900Black',
    color: '#003399',
    letterSpacing: 1,
  },
  header: {
    // Dynamic margins applied inline
  },
  greeting: {
    color: colors.text,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  statText: {
    color: colors.text,
    fontWeight: '700',
  },
  challengeCardContainer: {
    // Dynamic margin applied inline
  },
  startButton: {
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  startButtonText: {
    color: colors.text,
    fontWeight: '700',
    letterSpacing: 1,
  },
  bottomMessage: {
    color: colors.text,
    fontWeight: '500',
    textAlign: 'center',
  },
});
