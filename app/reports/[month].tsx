import { useState } from 'react';
import { Share, Dimensions, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LineChart } from 'react-native-chart-kit'; // Type declaration will be added later
import { Card, Button, YStack, XStack, Progress, Text, ScrollView, Spinner, H2, H3, Paragraph, View, useTheme } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { useQuery } from '@tanstack/react-query';

import { fetchMonthlyReport } from '@services/reportsService';
import { useUserStore } from '@state/userStore';
import { useHaptics } from '@hooks/useHaptics';

// Updated MonthlyReport type to match the component usage
type MonthlyReport = {
  summary: string;
  energyTrends: number[];
  aspects?: {
    love?: { score: string; description: string };
    career?: { score: string; description: string };
    health?: { score: string; description: string };
    personal?: { score: string; description: string };
  };
  details?: {
    planetary?: string;
    lunar?: string;
    love?: string;
    career?: string;
    health?: string;
    personal?: string;
  };
  recommendations?: {
    focus?: string;
    practices?: string;
    dates?: string;
    favorableDays?: number[];
    actions?: string[];
    avoidances?: string[];
  };
  areas?: {
    love: number;
    career: number;
    health: number;
    personal: number;
  };
};

const screenWidth = Dimensions.get('window').width;

export default function MonthlyReportScreen() {
  const { month } = useLocalSearchParams<{ month: string }>();
  const theme = useTheme();
  const { user } = useUserStore();
  const haptics = useHaptics();
  const [isSharing, setIsSharing] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  // Format the month for display
  const formattedMonth = month 
    ? format(parseISO(`${month}-01`), 'MMMM yyyy')
    : format(new Date(), 'MMMM yyyy');

  // Fetch monthly report data
  const { data, isLoading, error } = useQuery({
    queryKey: ['monthlyReport', month, user?.id],
    queryFn: () => fetchMonthlyReport(month as string, user?.id || ''),
    enabled: !!month && !!user?.id,
  });

  // Initialize report with default values to prevent TypeScript errors
  const report: MonthlyReport = data || {
    summary: '',
    energyTrends: [],
    aspects: {
      love: { score: '0', description: '' },
      career: { score: '0', description: '' },
      health: { score: '0', description: '' },
      personal: { score: '0', description: '' }
    },
    details: {
      planetary: '',
      lunar: '',
      love: '',
      career: '',
      health: '',
      personal: ''
    },
    recommendations: {
      focus: '',
      practices: '',
      dates: '',
      favorableDays: [],
      actions: [],
      avoidances: []
    },
    areas: {
      love: 0,
      career: 0,
      health: 0,
      personal: 0
    }
  };

  const handleShare = async () => {
    if (!report) return;
    
    try {
      setIsSharing(true);
      haptics.lightImpact();
      
      await Share.share({
        title: `Monthly Astrology Report: ${formattedMonth}`,
        message: `Check out my astrology report for ${formattedMonth}!\n\nSummary: ${report.summary}\n\nDownload the app to get your own report!`,
      });
    } catch (error) {
      console.error('Error sharing report:', error);
      haptics.errorNotification();
      Alert.alert('Sharing Failed', 'Unable to share your report at this time.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleBack = () => {
    haptics.mediumImpact();
    router.back();
  };

  const handleDownloadPDF = async () => {
    haptics.mediumImpact();
    // In a real app, this would download the PDF report
    console.log('PDF Report downloaded successfully!');
  };

  if (isLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
        <Spinner size="large" color="$primary" />
        <Text fontSize="$4" color="$gray10" marginTop="$4">
          Loading your monthly report...
        </Text>
      </YStack>
    );
  }

  if (error || !report) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
        <Text color="$red10" textAlign="center" marginBottom="$4">
          Unable to load the monthly report. Please try again later.
        </Text>
        <Button onPress={handleBack} accessibilityLabel="Go back" testID="go-back-button">
          Go Back
        </Button>
      </YStack>
    );
  }

  const renderOverviewSection = () => {
    // Helper function to safely parse scores
    const parseScore = (score: string | undefined): number => {
      if (!score) return 7;
      const parsed = parseInt(score);
      return isNaN(parsed) ? 7 : parsed;
    };
    
    return (
      <YStack space="$4">
        <Card elevate>
          <Card.Header>
            <H3>Monthly Summary</H3>
          </Card.Header>
          <Card.Footer>
            <Paragraph>{report.summary}</Paragraph>
          </Card.Footer>
        </Card>

        <Card elevate>
          <Card.Header>
            <H3>Energy Trends</H3>
          </Card.Header>
          <Card.Footer paddingTop="$0">
            <LineChart
              data={{
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [
                  {
                    data: report.energyTrends || [65, 78, 72, 80],
                    color: () => theme.primary?.val || '#6366f1',
                    strokeWidth: 2,
                  },
                ],
              }}
              width={screenWidth - 64}
              height={180}
              chartConfig={{
                backgroundColor: theme.background?.val || '#ffffff',
                backgroundGradientFrom: theme.background?.val || '#ffffff',
                backgroundGradientTo: theme.background?.val || '#ffffff',
                decimalPlaces: 0,
                color: () => theme.primary?.val || '#6366f1',
                labelColor: () => theme.gray11?.val || '#64748b',
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: theme.primary?.val || '#6366f1',
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </Card.Footer>
        </Card>

        <Card elevate>
          <Card.Header>
            <H3>Key Aspects</H3>
          </Card.Header>
          <Card.Footer>
            <YStack space="$3">
              <Text fontWeight="$6">Love & Relationships: {report?.aspects?.love?.score || '7/10'}</Text>
              <Progress value={parseScore(report?.aspects?.love?.score) * 10} />
              <Paragraph>{report?.aspects?.love?.description || 'A favorable month for deepening connections. Communication flows easily, especially after the 15th. Single? Look for meaningful connections around the 20th.'}</Paragraph>
              
              <Text fontWeight="$6" marginTop="$2">Career & Finance: {report?.aspects?.career?.score || '8/10'}</Text>
              <Progress value={parseScore(report?.aspects?.career?.score) * 10} />
              <Paragraph>{report?.aspects?.career?.description || 'Professional opportunities arise mid-month. Your leadership qualities are highlighted. Financial decisions made now have long-term positive effects.'}</Paragraph>
              
              <Text fontWeight="$6" marginTop="$2">Health & Wellness: {report?.aspects?.health?.score || '6/10'}</Text>
              <Progress value={parseScore(report?.aspects?.health?.score) * 10} />
              <Paragraph>{report?.aspects?.health?.description || 'Focus on balance this month. Energy levels may fluctuate - listen to your body and adjust your routine accordingly. Excellent time to establish new wellness habits.'}</Paragraph>
              
              <Text fontWeight="$6" marginTop="$2">Personal Growth: {report?.aspects?.personal?.score || '9/10'}</Text>
              <Progress value={parseScore(report?.aspects?.personal?.score) * 10} />
              <Paragraph>{report?.aspects?.personal?.description || 'Tremendous growth potential this month. Your intuition is heightened, making this an excellent time for self-reflection and setting intentions for the future.'}</Paragraph>
            </YStack>
          </Card.Footer>
        </Card>
      </YStack>
    );
  };

  const renderDetailSection = () => {
    return (
      <YStack space="$4">
        <Card elevate>
          <Card.Header>
            <H3>Planetary Influences</H3>
          </Card.Header>
          <Card.Footer>
            <Paragraph>
              {report?.details?.planetary || 
                "Venus in your sign amplifies your natural charm and magnetism. Mars in Capricorn brings disciplined energy to career pursuits. Mercury retrograde from the 10th-30th suggests reviewing communication and avoiding signing contracts during this period."}
            </Paragraph>
          </Card.Footer>
        </Card>

        <Card elevate>
          <Card.Header>
            <H3>Lunar Phases</H3>
          </Card.Header>
          <Card.Footer>
            <Paragraph>
              {report?.details?.lunar || 
                "New Moon on the 7th: Set intentions related to personal identity and new beginnings. Full Moon on the 21st: Culmination in partnerships and relationships. Use this energy for important conversations and clarity."}
            </Paragraph>
          </Card.Footer>
        </Card>

        <Card elevate>
          <Card.Header>
            <H3>Love & Relationships</H3>
          </Card.Header>
          <Card.Footer>
            <Paragraph>
              {report?.details?.love || 
                "This month brings significant developments in your relationships. You'll find yourself more open to deep connections and meaningful conversations. If you're in a relationship, expect to strengthen your bond through shared experiences. Single? A surprising encounter mid-month could spark something special."}
            </Paragraph>
          </Card.Footer>
        </Card>

        <Card elevate>
          <Card.Header>
            <H3>Career & Finance</H3>
          </Card.Header>
          <Card.Footer>
            <Paragraph>
              {report?.details?.career || 
                "A productive period for professional growth. Your innovative ideas will be well-received, especially around the 15th-20th. Financial matters require careful attention - review investments and avoid impulsive purchases. A long-term financial plan started now has excellent prospects."}
            </Paragraph>
          </Card.Footer>
        </Card>

        <Card elevate>
          <Card.Header>
            <H3>Health & Wellness</H3>
          </Card.Header>
          <Card.Footer>
            <Paragraph>
              {report?.details?.health || 
                "Your energy levels fluctuate this month, with a noticeable peak in the second week. Focus on maintaining balance between work and rest. Incorporating mindfulness practices will be particularly beneficial. Pay attention to your sleep quality and consider adjusting your evening routine for better rest."}
            </Paragraph>
          </Card.Footer>
        </Card>

        <Card elevate>
          <Card.Header>
            <H3>Personal Growth</H3>
          </Card.Header>
          <Card.Footer>
            <Paragraph>
              {report?.details?.personal || 
                "This is a powerful month for self-development. You're naturally drawn to learning new skills and expanding your knowledge. Consider taking a class or workshop that aligns with your interests. Journaling and meditation will be particularly effective tools for gaining clarity on your path forward."}
            </Paragraph>
          </Card.Footer>
        </Card>
      </YStack>
    );
  };

  const renderRecommendationsSection = () => {
    return (
      <YStack space="$4">
        <Card elevate>
          <Card.Header>
            <H3>Monthly Focus</H3>
          </Card.Header>
          <Card.Footer>
            <Paragraph>
              {report?.recommendations?.focus || 
                "This month, focus on building sustainable routines that support your long-term goals. The planetary alignments favor structured approaches to personal and professional development."}
            </Paragraph>
          </Card.Footer>
        </Card>

        <Card elevate>
          <Card.Header>
            <H3>Recommended Practices</H3>
          </Card.Header>
          <Card.Footer>
            <Paragraph>
              {report?.recommendations?.practices || 
                "1. Morning meditation to set daily intentions\n2. Weekly review of goals and progress\n3. Regular physical activity, especially outdoors\n4. Journaling before bed to process the day's events"}
            </Paragraph>
          </Card.Footer>
        </Card>

        <Card elevate>
          <Card.Header>
            <H3>Key Dates</H3>
          </Card.Header>
          <Card.Footer>
            <Paragraph>
              {report?.recommendations?.dates || 
                "7th: Ideal for starting new projects\n15th-18th: Favorable for important conversations and negotiations\n21st: Full moon brings clarity to relationship matters\n28th: Excellent day for financial planning and decisions"}
            </Paragraph>
          </Card.Footer>
        </Card>

        <Card elevate>
          <Card.Header>
            <H3>Favorable Days</H3>
          </Card.Header>
          <Card.Footer>
            <XStack flexWrap="wrap" gap="$2">
              {(report?.recommendations?.favorableDays || [7, 12, 15, 18, 21, 28]).map((day) => (
                <Button
                  key={day}
                  size="$3"
                  circular
                  backgroundColor={theme.primary?.val || '#6366f1'}
                  color={theme.background?.val || '#ffffff'}
                  onPress={() => haptics.selection()}
                >
                  {day}
                </Button>
              ))}
            </XStack>
          </Card.Footer>
        </Card>

        <Card elevate>
          <Card.Header>
            <H3>Recommended Actions</H3>
          </Card.Header>
          <Card.Footer>
            <YStack space="$2">
              {((report.recommendations?.actions) || [
                "Schedule time for creative pursuits",
                "Reach out to mentors or advisors",
                "Update your financial plan",
                "Strengthen connections with close friends",
                "Learn a new skill related to your career goals"
              ]).map((action, index) => (
                <XStack key={index} alignItems="center" space="$2">
                  <Ionicons name="checkmark-circle" size={20} color={theme.primary?.val || '#6366f1'} />
                  <Text>{action}</Text>
                </XStack>
              ))}
            </YStack>
          </Card.Footer>
        </Card>

        <Card elevate>
          <Card.Header>
            <H3>What to Avoid</H3>
          </Card.Header>
          <Card.Footer>
            <YStack space="$2">
              {((report.recommendations?.avoidances) || [
                "Making impulsive financial decisions",
                "Overcommitting to social events",
                "Neglecting self-care routines",
                "Starting major projects during Mercury retrograde (10th-30th)",
                "Avoiding necessary conversations about boundaries"
              ]).map((avoidance, index) => (
                <XStack key={index} alignItems="center" space="$2">
                  <Ionicons name="close-circle" size={20} color={theme.red10?.val || '#ef4444'} />
                  <Text>{avoidance}</Text>
                </XStack>
              ))}
            </YStack>
          </Card.Footer>
        </Card>
      </YStack>
    );
  };

  return (
    <View flex={1} backgroundColor="$background">
      <ScrollView flex={1} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <YStack space="$4">
          <YStack space="$1">
            <H2 color="$color">{formattedMonth} Report</H2>
            <Text fontSize="$5" color="$primary">{user?.zodiacSign || 'Aries'}</Text>
          </YStack>

          <YStack marginBottom="$4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <XStack space="$2" paddingVertical="$2">
                <Button
                  chromeless
                  onPress={() => { haptics.lightImpact(); setActiveSection('overview'); }}
                  backgroundColor={activeSection === 'overview' ? theme.primary?.val : 'transparent'}
                  color={activeSection === 'overview' ? theme.background?.val : theme.color?.val}
                  borderRadius="$4"
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                >
                  Overview
                </Button>

                <Button
                  chromeless
                  onPress={() => { haptics.lightImpact(); setActiveSection('details'); }}
                  backgroundColor={activeSection === 'details' ? theme.primary?.val : 'transparent'}
                  color={activeSection === 'details' ? theme.background?.val : theme.color?.val}
                  borderRadius="$4"
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                >
                  Details
                </Button>

                <Button
                  chromeless
                  onPress={() => { haptics.lightImpact(); setActiveSection('recommendations'); }}
                  backgroundColor={activeSection === 'recommendations' ? theme.primary?.val : 'transparent'}
                  color={activeSection === 'recommendations' ? theme.background?.val : theme.color?.val}
                  borderRadius="$4"
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                >
                  Recommendations
                </Button>
              </XStack>
            </ScrollView>
          </YStack>

          {activeSection === 'overview' && renderOverviewSection()}
          {activeSection === 'details' && renderDetailSection()}
          {activeSection === 'recommendations' && renderRecommendationsSection()}

          <XStack space="$4" marginTop="$4">
            <Button
              size="$4"
              backgroundColor="$gray3"
              color="$primary"
              onPress={handleShare}
              icon={<Ionicons name="share-outline" size={20} color={theme.primary?.val || '#6366f1'} />}
              flex={1}
              accessibilityLabel="Share report"
              testID="share-button"
            >
              Share
            </Button>
            <Button
              size="$4"
              backgroundColor="$gray3"
              color="$primary"
              onPress={handleDownloadPDF}
              icon={<Ionicons name="download-outline" size={20} color={theme.primary?.val || '#6366f1'} />}
              flex={1}
              accessibilityLabel="Download PDF report"
              testID="download-pdf-button"
            >
              Download PDF
            </Button>
          </XStack>
        </YStack>
      </ScrollView>
    </View>
  );
}

// No StyleSheet needed with Tamagui
