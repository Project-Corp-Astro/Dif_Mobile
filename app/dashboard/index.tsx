import { useState } from 'react';
import { RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import {
  H2,
  Paragraph,
  Text,
  Button,
  YStack,
  XStack,
  Spinner,
  ScrollView,
  Card,
  View
} from 'tamagui';

import { fetchDailyHoroscope } from '@services/horoscopeService';
import { useUserStore } from '@state/userStore';
import { useHaptics } from '@hooks/useHaptics';

export default function TodayScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const user = useUserStore((state) => state.user);
  const haptics = useHaptics();
  const today = new Date();
  const formattedDate = format(today, 'MMMM d, yyyy');

  const { data: horoscope, isLoading, error, refetch } = useQuery({
    queryKey: ['dailyHoroscope', today.toISOString().split('T')[0]],
    queryFn: () => fetchDailyHoroscope(user?.zodiacSign || 'aries'),
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
    haptics.successNotification();
  };

  const handleViewHoroscope = () => {
    haptics.selection();
    router.push(`/horoscope/${today.toISOString().split('T')[0]}` as any);
  };

  const handleViewReports = () => {
    haptics.selection();
    const currentMonth = format(today, 'yyyy-MM');
    router.push(`/reports/${currentMonth}` as any);
  };

  return (
    <ScrollView
      flex={1}
      backgroundColor="$background"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <YStack padding="$4" space="$4">
        <YStack space="$1">
          <H2 size="$7">Hello, {user?.name || 'Stargazer'}</H2>
          <Paragraph color="$gray10">{formattedDate}</Paragraph>
        </YStack>

        <Card elevate size="$4" bordered={false} overflow="hidden">
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            style={{
              padding: 20,
              borderRadius: 16,
            }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <XStack justifyContent="space-between" alignItems="center" space="$4">
              <Text color="white" fontWeight="bold" fontSize="$5">Your Daily Horoscope</Text>
              <Text color="white" fontWeight="$6" fontSize="$4">{user?.zodiacSign || 'Aries'}</Text>
            </XStack>

            {isLoading ? (
              <YStack height={100} justifyContent="center" alignItems="center">
                <Spinner size="large" color="white" />
              </YStack>
            ) : error ? (
              <Text color="white" textAlign="center" marginVertical="$5">
                Unable to load your horoscope. Please try again.
              </Text>
            ) : (
              <YStack>
                <Text color="white" fontSize="$4" lineHeight="$6" marginBottom={16}>
                  {(horoscope as any)?.prediction || 
                    "Today brings unexpected opportunities. Stay open to new connections and don't hesitate to share your ideas. Your creativity is at its peak."}
                </Text>
                <Button
                  backgroundColor="rgba(255,255,255,0.2)"
                  color="white"
                  onPress={handleViewHoroscope}
                  alignSelf="flex-start"
                  accessibilityLabel="View full horoscope"
                  accessibilityHint="Opens the detailed daily horoscope"
                  testID="view-horoscope-button"
                  pressStyle={{ opacity: 0.9 }}
                  animation="bouncy"
                >
                  <Text color="white">View Full Horoscope</Text>
                </Button>
              </YStack>
            )}
          </LinearGradient>
        </Card>

        <H2 size="$5">Quick Actions</H2>

        <XStack space="$3" flexWrap="wrap">
          <Card 
            width="48%" 
            marginBottom="$4"
            onPress={handleViewReports}
            testID="monthly-report-card"
            accessibilityLabel="Monthly Report"
            accessibilityHint="View your personalized monthly astrological forecast"
            bordered
            animation="bouncy"
            pressStyle={{ scale: 0.98 }}
            elevate
          >
            <YStack space="$2" padding="$4" flex={1}>
              <XStack 
                width={40} 
                height={40} 
                borderRadius={20} 
                backgroundColor="$blue2" 
                justifyContent="center" 
                alignItems="center"
                marginBottom="$2"
              >
                <Ionicons name="calendar-outline" size={24} color="#6366f1" />
              </XStack>
              <Text fontWeight="$6" fontSize="$4">Monthly Report</Text>
              <Paragraph color="$gray10" marginBottom="$2">
                View your personalized monthly astrological forecast
              </Paragraph>
              <Button
                variant="outlined"
                marginTop="auto"
                onPress={handleViewReports}
                testID="view-report-button"
                pressStyle={{ scale: 0.98 }}
                animation="bouncy"
              >
                <Text>View Report</Text>
              </Button>
            </YStack>
          </Card>

          <Card 
            width="48%" 
            marginBottom="$4"
            onPress={() => {
              haptics.selection();
              router.push('/dashboard/chat' as any);
            }}
            testID="astro-chat-card"
            accessibilityLabel="Astro Chat"
            accessibilityHint="Chat with our AI-powered astrological assistant"
            bordered
            animation="bouncy"
            pressStyle={{ scale: 0.98 }}
            elevate
          >
            <YStack space="$2" padding="$4" flex={1}>
              <XStack 
                width={40} 
                height={40} 
                borderRadius={20} 
                backgroundColor="$blue2" 
                justifyContent="center" 
                alignItems="center"
                marginBottom="$2"
              >
                <Ionicons name="chatbubble-outline" size={24} color="#6366f1" />
              </XStack>
              <Text fontWeight="$6" fontSize="$4">Astro Chat</Text>
              <Paragraph color="$gray10" marginBottom="$2">
                Chat with our AI-powered astrological assistant
              </Paragraph>
              <Button
                variant="outlined"
                marginTop="auto"
                onPress={() => {
                  haptics.selection();
                  router.push('/dashboard/chat' as any);
                }}
                testID="start-chat-button"
                pressStyle={{ scale: 0.98 }}
                animation="bouncy"
              >
                <Text>Start Chat</Text>
              </Button>
            </YStack>
          </Card>
        </XStack>
      </YStack>
    </ScrollView>
  );
}
