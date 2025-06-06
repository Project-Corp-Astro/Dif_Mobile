import { useState } from 'react';
import { RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Card, Button, YStack, XStack, Spinner, Text, View, ScrollView, H2, Paragraph } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { format, subMonths } from 'date-fns';
import { useQuery } from '@tanstack/react-query';

import { fetchMonthlyReport } from '@services/reportsService';
import { useUserStore } from '@state/userStore';
import { useHaptics } from '@hooks/useHaptics';

// Define interfaces for our data types
interface Report {
  month: string;
  isComplete: boolean;
  summary?: string;
  categories?: Array<{
    name: string;
    value?: number;
  }>;
}

export default function ReportsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const user = useUserStore((state) => state.user);
  const haptics = useHaptics();
  const today = new Date();

  const { data: reports, isLoading, error, refetch } = useQuery({
    queryKey: ['monthlyReports'],
    queryFn: () => fetchMonthlyReport(user?.id || '', format(new Date(), 'yyyy-MM')),
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
    haptics.successNotification();
  };

  const getMonthData = (monthsAgo: number) => {
    const date = subMonths(today, monthsAgo);
    const monthYear = format(date, 'yyyy-MM');
    const displayMonth = format(date, 'MMMM yyyy');
    
    // Handle the case where reports might be a single report or an array
    const reportsArray = Array.isArray(reports) ? reports : reports ? [reports] : [];
    const report = reportsArray.find((r: Report) => r.month === monthYear);
    
    return {
      monthYear,
      displayMonth,
      report,
    };
  };

  const handleViewReport = (monthYear: string) => {
    haptics.selection();
    router.push(`/reports/${monthYear}` as any);
  };

  const renderReportCard = (monthsAgo: number) => {
    const { monthYear, displayMonth, report } = getMonthData(monthsAgo);
    
    return (
      <Card key={monthYear} elevate size="$4" bordered>
        <Card.Header padded>
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$5" fontWeight="$6" color="$gray12">{displayMonth}</Text>
            {report?.isComplete && (
              <View backgroundColor="$green2" paddingHorizontal="$2" paddingVertical="$1" borderRadius="$4">
                <Text fontSize="$2" color="$green11" fontWeight="$5">Complete</Text>
              </View>
            )}
          </XStack>
        </Card.Header>
        
        <Card.Footer padded>
          <YStack space="$2">
            <Paragraph color="$gray11" size="$3">
              {report?.summary || 'Your personalized astrological insights for this month.'}
            </Paragraph>
            
            <XStack flexWrap="wrap" gap="$2" marginTop="$2">
              {report?.categories?.map((category: { name: string; value?: number }) => (
                <View key={category.name} backgroundColor="$blue2" paddingHorizontal="$2" paddingVertical="$1" borderRadius="$4">
                  <Text fontSize="$2" color="$blue11" fontWeight="$5">{category.name}</Text>
                </View>
              ))}
            </XStack>
            
            <Button
              marginTop="$3"
              backgroundColor="$background"
              color="$blue10"
              borderColor="$gray5"
              borderWidth={1}
              onPress={() => handleViewReport(monthYear)}
              accessibilityLabel={`View ${displayMonth} report`}
              accessibilityHint="Opens the detailed monthly report"
              testID={`view-report-${monthYear}`}
              pressStyle={{ scale: 0.98 }}
              animation="bouncy"
            >
              <Text>View Report</Text>
            </Button>
          </YStack>
        </Card.Footer>
      </Card>
    );
  };

  return (
    <ScrollView
      backgroundColor="$gray2"
      padding="$4"
      contentContainerStyle={{ paddingBottom: 32 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <H2 color="$gray12" marginBottom="$1">Monthly Reports</H2>
      <Paragraph color="$gray11" marginBottom="$4">
        View your personalized astrological reports
      </Paragraph>

      {isLoading ? (
        <YStack height={200} justifyContent="center" alignItems="center">
          <Spinner size="large" color="$blue10" />
          <Text marginTop="$2" color="$gray11">Loading reports...</Text>
        </YStack>
      ) : error ? (
        <YStack height={200} justifyContent="center" alignItems="center">
          <Text color="$red10" marginBottom="$4" textAlign="center">
            Unable to load reports. Please try again.
          </Text>
          <Button 
            onPress={onRefresh}
            accessibilityLabel="Retry loading reports"
            testID="retry-button"
          >
            Retry
          </Button>
        </YStack>
      ) : (
        <YStack space="$4" marginTop="$2">
          {[0, 1, 2, 3, 4, 5].map((monthsAgo) => renderReportCard(monthsAgo))}
        </YStack>
      )}
    </ScrollView>
  );
}
