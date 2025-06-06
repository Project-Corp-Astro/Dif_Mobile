import { supabase } from './supabaseClient';
import { format } from 'date-fns';

// Types
export interface HoroscopeData {
  id: string;
  date: string;
  zodiacSign: string;
  general: string;
  love: string;
  career: string;
  health: string;
  luckyNumber: number;
  luckyColor: string;
  compatibility: string;
  mood: string;
}

/**
 * Fetches daily horoscope for a specific zodiac sign and date
 * @param zodiacSign - User's zodiac sign
 * @param date - Date for horoscope in YYYY-MM-DD format (defaults to today)
 */
export const fetchDailyHoroscope = async (
  zodiacSign: string,
  date: string = format(new Date(), 'yyyy-MM-dd')
): Promise<HoroscopeData> => {
  try {
    // First check if we have the horoscope in our database
    const { data, error } = await supabase
      .from('horoscopes')
      .select('*')
      .eq('zodiac_sign', zodiacSign.toLowerCase())
      .eq('date', date)
      .single();

    // If found in database, return it
    if (data && !error) {
      return {
        id: data.id,
        date: data.date,
        zodiacSign: data.zodiac_sign,
        general: data.general,
        love: data.love,
        career: data.career,
        health: data.health,
        luckyNumber: data.lucky_number,
        luckyColor: data.lucky_color,
        compatibility: data.compatibility,
        mood: data.mood,
      };
    }

    // If not found in database, fetch from external API
    // In a real app, this would be a call to an actual horoscope API
    // For now, we'll generate mock data
    const mockHoroscope = generateMockHoroscope(zodiacSign, date);
    
    // Save to database for future use
    await saveHoroscopeToDatabase(mockHoroscope);
    
    return mockHoroscope;
  } catch (error) {
    console.error('Error fetching daily horoscope:', error);
    throw new Error('Failed to fetch horoscope data');
  }
};

/**
 * Fetches weekly horoscope for a specific zodiac sign
 * @param zodiacSign - User's zodiac sign
 * @param weekStartDate - Start date of the week in YYYY-MM-DD format
 */
export const fetchWeeklyHoroscope = async (
  zodiacSign: string,
  weekStartDate: string = format(new Date(), 'yyyy-MM-dd')
): Promise<any> => {
  try {
    // In a real app, this would fetch from a weekly horoscope API
    // For now, we'll return mock data
    return {
      id: `weekly-${zodiacSign}-${weekStartDate}`,
      zodiacSign,
      weekStartDate,
      general: `This week brings significant opportunities for ${zodiacSign}. Focus on your goals and don't be afraid to take calculated risks.`,
      love: `Romance is in the air for ${zodiacSign} this week. Single? You might meet someone special. In a relationship? Expect deeper connections.`,
      career: `Professional growth is highlighted for ${zodiacSign}. A project you've been working on may gain recognition.`,
      health: `Pay attention to your physical wellbeing, ${zodiacSign}. Regular exercise and proper rest will keep your energy levels high.`,
      weeklyTip: `Make time for self-reflection and meditation, ${zodiacSign}. It will help you gain clarity on important decisions.`,
    };
  } catch (error) {
    console.error('Error fetching weekly horoscope:', error);
    throw new Error('Failed to fetch weekly horoscope data');
  }
};

/**
 * Fetches monthly horoscope for a specific zodiac sign
 * @param zodiacSign - User's zodiac sign
 * @param month - Month in YYYY-MM format
 */
export const fetchMonthlyHoroscope = async (
  zodiacSign: string,
  month: string = format(new Date(), 'yyyy-MM')
): Promise<any> => {
  try {
    // In a real app, this would fetch from a monthly horoscope API
    // For now, we'll return mock data
    return {
      id: `monthly-${zodiacSign}-${month}`,
      zodiacSign,
      month,
      general: `${zodiacSign}, this month brings a focus on personal growth and self-discovery. You'll find yourself reflecting on your life path.`,
      love: `Relationships take center stage for ${zodiacSign} this month. Communication will be key to resolving any misunderstandings.`,
      career: `Career opportunities abound for ${zodiacSign}. Your hard work is being noticed, and a promotion or new project may be on the horizon.`,
      health: `Balance is important for ${zodiacSign}'s wellbeing this month. Make sure to incorporate both activity and rest into your routine.`,
      monthlyFocus: `Financial planning should be a priority for ${zodiacSign} this month. Review your budget and consider long-term investments.`,
      luckyDays: [7, 15, 23],
    };
  } catch (error) {
    console.error('Error fetching monthly horoscope:', error);
    throw new Error('Failed to fetch monthly horoscope data');
  }
};

/**
 * Helper function to save horoscope data to database
 */
const saveHoroscopeToDatabase = async (horoscope: HoroscopeData): Promise<void> => {
  try {
    await supabase.from('horoscopes').insert([
      {
        id: horoscope.id,
        date: horoscope.date,
        zodiac_sign: horoscope.zodiacSign.toLowerCase(),
        general: horoscope.general,
        love: horoscope.love,
        career: horoscope.career,
        health: horoscope.health,
        lucky_number: horoscope.luckyNumber,
        lucky_color: horoscope.luckyColor,
        compatibility: horoscope.compatibility,
        mood: horoscope.mood,
      },
    ]);
  } catch (error) {
    console.error('Error saving horoscope to database:', error);
    // We'll just log the error but not throw, as this is a background operation
  }
};

/**
 * Helper function to generate mock horoscope data
 * In a real app, this would be replaced with actual API calls
 */
const generateMockHoroscope = (zodiacSign: string, date: string): HoroscopeData => {
  const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'turquoise', 'gold', 'silver', 'indigo', 'violet'];
  const moods = ['happy', 'contemplative', 'energetic', 'relaxed', 'focused', 'creative', 'inspired', 'determined', 'peaceful', 'enthusiastic'];
  
  const randomIndex = signs.indexOf(zodiacSign.toLowerCase());
  const compatibilityIndex = (randomIndex + 6) % 12; // Opposite sign
  
  return {
    id: `${zodiacSign.toLowerCase()}-${date}`,
    date,
    zodiacSign: zodiacSign.toLowerCase(),
    general: `Today is a day of new beginnings for ${zodiacSign}. You may find yourself drawn to new opportunities and experiences. Trust your instincts and follow your heart.`,
    love: `In matters of the heart, ${zodiacSign} should focus on open communication. Express your feelings honestly and listen actively to your partner's needs.`,
    career: `Professional growth is highlighted for ${zodiacSign} today. Your creativity and problem-solving abilities will be particularly strong. Don't be afraid to share your ideas.`,
    health: `Pay attention to your physical wellbeing, ${zodiacSign}. A balanced diet and regular exercise will help maintain your energy levels throughout the day.`,
    luckyNumber: Math.floor(Math.random() * 100),
    luckyColor: colors[Math.floor(Math.random() * colors.length)],
    compatibility: signs[compatibilityIndex],
    mood: moods[Math.floor(Math.random() * moods.length)],
  };
};
