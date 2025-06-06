import { useState } from 'react';
import { Share } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Card, Button, YStack, XStack, View, Text, ScrollView, Spinner, H3, Paragraph, useTheme } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { useHaptics } from '@/hooks/useHaptics';

import { fetchDailyHoroscope } from '@services/horoscopeService';
import { useUserStore } from '@state/userStore';

export default function HoroscopeDetailScreen() {
  const { date } = useLocalSearchParams();
  const user = useUserStore((state) => state.user);
  const [activeTab, setActiveTab] = useState('general');
  const { lightImpact, errorNotification } = useHaptics();
  const theme = useTheme();
  
  // Format the date for display
  const formattedDate = date 
    ? format(parseISO(date.toString()), 'MMMM d, yyyy')
    : format(new Date(), 'MMMM d, yyyy');

  // Fetch detailed horoscope data
  const { data: horoscope, isLoading, error } = useQuery({
    queryKey: ['detailedHoroscope', date, user?.zodiacSign],
    queryFn: () => fetchDailyHoroscope(date?.toString() || new Date().toISOString().split('T')[0], user?.zodiacSign || 'aries'),
  });

  const handleShare = async () => {
    if (!horoscope) return;
    
    try {
      lightImpact();
      
      await Share.share({
        message: `My ${formattedDate} horoscope for ${user?.zodiacSign || 'Aries'}: ${horoscope.general}`,
        title: `${user?.zodiacSign || 'Aries'} Horoscope for ${formattedDate}`,
      });
    } catch (error) {
      errorNotification();
      console.error('Error sharing horoscope:', error);
    }
  };

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <YStack justifyContent="center" alignItems="center" height={200}>
          <Spinner size="large" color="$primary" />
        </YStack>
      );
    }

    if (error || !horoscope) {
      return (
        <YStack justifyContent="center" alignItems="center" height={200}>
          <Text color="$red10" textAlign="center" marginBottom="$4">
            Unable to load horoscope. Please try again later.
          </Text>
          <Button onPress={() => router.back()} accessibilityLabel="Go back" testID="go-back-button">
            Go Back
          </Button>
        </YStack>
      );
    }

    return (
      <Card padding="$4" borderRadius="$4" marginBottom="$6">
        <Paragraph fontSize="$4" lineHeight="$6" color="$color">
          {activeTab === 'general' && horoscope?.general}
          {activeTab === 'love' && horoscope?.love}
          {activeTab === 'career' && horoscope?.career}
          {activeTab === 'health' && horoscope?.health}
        </Paragraph>
      </Card>
    );
  };

  return (
    <ScrollView backgroundColor="$background" flex={1}>
      <YStack padding="$4" paddingBottom="$8">
        {/* Header with date and sign */}
        <YStack marginBottom="$6">
          <H3 color="$color" fontWeight="bold">{formattedDate}</H3>
          <Text fontSize="$5" color="$primary" marginTop="$1">{user?.zodiacSign || 'Aries'}</Text>
        </YStack>

        {/* Stats cards */}
        <YStack marginBottom="$6">
          <XStack space="$4" justifyContent="space-between">
            <Card padding="$4" alignItems="center" flex={1} backgroundColor="$background" borderRadius="$4">
              <Text fontSize="$3" color="$gray10" marginBottom="$2">Lucky Number</Text>
              <Text fontSize="$5" fontWeight="bold" color="$color">{horoscope?.luckyNumber || '7'}</Text>
            </Card>
            <Card padding="$4" alignItems="center" flex={1} backgroundColor="$background" borderRadius="$4">
              <Text fontSize="$3" color="$gray10" marginBottom="$2">Lucky Color</Text>
              <Text fontSize="$5" fontWeight="bold" color="$color">{horoscope?.luckyColor || 'Blue'}</Text>
            </Card>
            <Card padding="$4" alignItems="center" flex={1} backgroundColor="$background" borderRadius="$4">
              <Text fontSize="$3" color="$gray10" marginBottom="$2">Compatibility</Text>
              <Text fontSize="$5" fontWeight="bold" color="$color">{horoscope?.compatibility || 'Libra'}</Text>
            </Card>
          </XStack>
        </YStack>

        {/* Tabs */}
        <YStack marginBottom="$4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack space="$2" paddingVertical="$2">
              <Button
                size="$3"
                backgroundColor={activeTab === 'general' ? '$primary' : '$gray3'}
                color={activeTab === 'general' ? 'white' : '$gray11'}
                onPress={() => { setActiveTab('general'); lightImpact(); }}
                borderRadius="$6"
                paddingHorizontal="$4"
                accessibilityLabel="General horoscope tab"
                accessibilityState={{ selected: activeTab === 'general' }}
                testID="general-tab"
              >
                General
              </Button>
              <Button
                size="$3"
                backgroundColor={activeTab === 'love' ? '$primary' : '$gray3'}
                color={activeTab === 'love' ? 'white' : '$gray11'}
                onPress={() => { setActiveTab('love'); lightImpact(); }}
                borderRadius="$6"
                paddingHorizontal="$4"
                accessibilityLabel="Love horoscope tab"
                accessibilityState={{ selected: activeTab === 'love' }}
                testID="love-tab"
              >
                Love
              </Button>
              <Button
                size="$3"
                backgroundColor={activeTab === 'career' ? '$primary' : '$gray3'}
                color={activeTab === 'career' ? 'white' : '$gray11'}
                onPress={() => { setActiveTab('career'); lightImpact(); }}
                borderRadius="$6"
                paddingHorizontal="$4"
                accessibilityLabel="Career horoscope tab"
                accessibilityState={{ selected: activeTab === 'career' }}
                testID="career-tab"
              >
                Career
              </Button>
              <Button
                size="$3"
                backgroundColor={activeTab === 'health' ? '$primary' : '$gray3'}
                color={activeTab === 'health' ? 'white' : '$gray11'}
                onPress={() => { setActiveTab('health'); lightImpact(); }}
                borderRadius="$6"
                paddingHorizontal="$4"
                accessibilityLabel="Health horoscope tab"
                accessibilityState={{ selected: activeTab === 'health' }}
                testID="health-tab"
              >
                Health
              </Button>
            </XStack>
          </ScrollView>
        </YStack>

        {/* Tab content */}
        {renderTabContent()}

        {/* Action buttons */}
        <XStack justifyContent="space-between" gap="$4">
          <Button 
            icon={<Ionicons name="arrow-back" size={18} color="white" />}
            onPress={() => { router.back(); lightImpact(); }}
            flex={1}
            accessibilityLabel="Go back"
            testID="back-button"
          >
            Back
          </Button>
          <Button 
            icon={<Ionicons name="share-outline" size={18} color="white" />}
            onPress={handleShare}
            flex={1}
            accessibilityLabel="Share horoscope"
            testID="share-button"
          >
            Share
          </Button>
        </XStack>
      </YStack>
    </ScrollView>
  );
}
