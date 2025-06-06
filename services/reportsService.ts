import { supabase } from './supabaseClient';
import { format, parseISO } from 'date-fns';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

// Types
export interface MonthlyReport {
  id: string;
  userId: string;
  month: string;
  summary: string;
  details: {
    love: string;
    career: string;
    health: string;
    personal: string;
  };
  energyTrends: number[];
  areas: {
    love: number;
    career: number;
    health: number;
    personal: number;
  };
  recommendations: {
    favorableDays: number[];
    actions: string[];
    avoidances: string[];
  };
  createdAt: string;
}

/**
 * Fetches monthly report for a specific month and user
 * @param month - Month in YYYY-MM format
 * @param userId - User ID
 */
export const fetchMonthlyReport = async (
  month: string = format(new Date(), 'yyyy-MM'),
  userId: string
): Promise<MonthlyReport> => {
  try {
    // First check if we have the report in our database
    const { data, error } = await supabase
      .from('monthly_reports')
      .select('*')
      .eq('user_id', userId)
      .eq('month', month)
      .single();

    // If found in database, return it
    if (data && !error) {
      return {
        id: data.id,
        userId: data.user_id,
        month: data.month,
        summary: data.summary,
        details: data.details,
        energyTrends: data.energy_trends,
        areas: data.areas,
        recommendations: data.recommendations,
        createdAt: data.created_at,
      };
    }

    // If not found in database, generate a new report
    // In a real app, this would involve complex astrological calculations
    // For now, we'll generate mock data
    const mockReport = await generateMockMonthlyReport(month, userId);
    
    // Save to database for future use
    await saveReportToDatabase(mockReport);
    
    return mockReport;
  } catch (error) {
    console.error('Error fetching monthly report:', error);
    throw new Error('Failed to fetch monthly report');
  }
};

/**
 * Fetches all monthly reports for a user
 * @param userId - User ID
 * @param limit - Maximum number of reports to fetch
 */
export const fetchUserReports = async (
  userId: string,
  limit: number = 12
): Promise<MonthlyReport[]> => {
  try {
    const { data, error } = await supabase
      .from('monthly_reports')
      .select('*')
      .eq('user_id', userId)
      .order('month', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error('Failed to fetch user reports');
    }

    return data.map(report => ({
      id: report.id,
      userId: report.user_id,
      month: report.month,
      summary: report.summary,
      details: report.details,
      energyTrends: report.energy_trends,
      areas: report.areas,
      recommendations: report.recommendations,
      createdAt: report.created_at,
    }));
  } catch (error) {
    console.error('Error fetching user reports:', error);
    throw new Error('Failed to fetch user reports');
  }
};

/**
 * Generates and downloads a PDF report
 * @param report - Monthly report data
 */
export const generatePDFReport = async (report: MonthlyReport): Promise<string> => {
  try {
    const formattedMonth = format(parseISO(`${report.month}-01`), 'MMMM yyyy');
    
    // Create HTML content for the PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              padding: 20px;
              color: #1e293b;
            }
            h1 {
              color: #6366f1;
              text-align: center;
              margin-bottom: 30px;
            }
            h2 {
              color: #1e1b4b;
              margin-top: 30px;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 10px;
            }
            .summary {
              background-color: #eff6ff;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .section {
              margin-bottom: 25px;
            }
            .favorable-days {
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
              margin-top: 10px;
            }
            .day-badge {
              background-color: #e0e7ff;
              color: #6366f1;
              width: 30px;
              height: 30px;
              border-radius: 15px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
            }
            .action-item {
              margin-bottom: 8px;
            }
            .footer {
              text-align: center;
              margin-top: 50px;
              color: #94a3b8;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <h1>Monthly Astrological Report</h1>
          <p><strong>Month:</strong> ${formattedMonth}</p>
          <p><strong>Generated on:</strong> ${format(new Date(), 'MMMM d, yyyy')}</p>
          
          <h2>Summary</h2>
          <div class="summary">
            <p>${report.summary}</p>
          </div>
          
          <h2>Details</h2>
          
          <div class="section">
            <h3>Love & Relationships</h3>
            <p>${report.details.love}</p>
          </div>
          
          <div class="section">
            <h3>Career & Finance</h3>
            <p>${report.details.career}</p>
          </div>
          
          <div class="section">
            <h3>Health & Wellness</h3>
            <p>${report.details.health}</p>
          </div>
          
          <div class="section">
            <h3>Personal Growth</h3>
            <p>${report.details.personal}</p>
          </div>
          
          <h2>Recommendations</h2>
          
          <div class="section">
            <h3>Favorable Days</h3>
            <div class="favorable-days">
              ${report.recommendations.favorableDays.map(day => `<div class="day-badge">${day}</div>`).join('')}
            </div>
          </div>
          
          <div class="section">
            <h3>Actions to Take</h3>
            <ul>
              ${report.recommendations.actions.map(action => `<li class="action-item">${action}</li>`).join('')}
            </ul>
          </div>
          
          <div class="section">
            <h3>Things to Avoid</h3>
            <ul>
              ${report.recommendations.avoidances.map(avoid => `<li class="action-item">${avoid}</li>`).join('')}
            </ul>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Corp Astro Mobile. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;
    
    // Generate PDF file
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false
    });
    
    // Get the PDF file name
    const fileName = `${formattedMonth.replace(' ', '_')}_Report.pdf`;
    
    // Create a new file path in the documents directory
    const pdfPath = `${FileSystem.documentDirectory}${fileName}`;
    
    // Copy the file to the new location
    await FileSystem.copyAsync({
      from: uri,
      to: pdfPath
    });
    
    return pdfPath;
  } catch (error) {
    console.error('Error generating PDF report:', error);
    throw new Error('Failed to generate PDF report');
  }
};

/**
 * Shares a report PDF
 * @param reportPath - Path to the PDF file
 */
export const shareReportPDF = async (reportPath: string): Promise<void> => {
  try {
    // Check if sharing is available
    const isSharingAvailable = await Sharing.isAvailableAsync();
    
    if (!isSharingAvailable) {
      throw new Error('Sharing is not available on this device');
    }
    
    // Share the PDF file
    await Sharing.shareAsync(reportPath);
  } catch (error) {
    console.error('Error sharing report PDF:', error);
    throw new Error('Failed to share report PDF');
  }
};

/**
 * Helper function to save report data to database
 */
const saveReportToDatabase = async (report: MonthlyReport): Promise<void> => {
  try {
    await supabase.from('monthly_reports').insert([
      {
        id: report.id,
        user_id: report.userId,
        month: report.month,
        summary: report.summary,
        details: report.details,
        energy_trends: report.energyTrends,
        areas: report.areas,
        recommendations: report.recommendations,
      },
    ]);
  } catch (error) {
    console.error('Error saving report to database:', error);
    // We'll just log the error but not throw, as this is a background operation
  }
};

/**
 * Helper function to generate mock monthly report data
 * In a real app, this would involve complex astrological calculations
 */
const generateMockMonthlyReport = async (
  month: string,
  userId: string
): Promise<MonthlyReport> => {
  // Get user's zodiac sign
  const { data: userData } = await supabase
    .from('profiles')
    .select('zodiac_sign')
    .eq('id', userId)
    .single();
  
  const zodiacSign = userData?.zodiac_sign || 'aries';
  const monthDate = parseISO(`${month}-01`);
  const formattedMonth = format(monthDate, 'MMMM');
  
  // Generate random favorable days (between 1-28)
  const favorableDays = Array.from({ length: 5 }, () => 
    Math.floor(Math.random() * 28) + 1
  ).sort((a, b) => a - b);
  
  // Generate random energy trends (values between 60-95)
  const energyTrends = Array.from({ length: 4 }, () => 
    Math.floor(Math.random() * 35) + 60
  );
  
  // Generate random area scores (values between 60-95)
  const areas = {
    love: Math.floor(Math.random() * 35) + 60,
    career: Math.floor(Math.random() * 35) + 60,
    health: Math.floor(Math.random() * 35) + 60,
    personal: Math.floor(Math.random() * 35) + 60,
  };
  
  return {
    id: `${userId}-${month}`,
    userId,
    month,
    summary: `${formattedMonth} brings significant opportunities for ${zodiacSign}. This is a time of growth and transformation, particularly in your personal relationships and career. The cosmic energy supports your endeavors, especially around the ${favorableDays[0]}th and ${favorableDays[2]}th. Focus on clear communication and trust your intuition when making important decisions.`,
    details: {
      love: `Your romantic life sees positive developments in ${formattedMonth}. If you're in a relationship, expect deeper connections through meaningful conversations. Single? An unexpected encounter mid-month could spark something special. The ${favorableDays[1]}th is particularly favorable for matters of the heart.`,
      career: `Professional growth is highlighted this month. A project you've been working on gains recognition, potentially leading to new opportunities. Financial matters require attention around the third week - be cautious with investments and major purchases during this time.`,
      health: `Your energy levels fluctuate this month, with a noticeable peak in the second week. Focus on maintaining balance between work and rest. Incorporating mindfulness practices will be particularly beneficial. Pay attention to your sleep quality and consider adjusting your evening routine.`,
      personal: `This is an excellent month for self-discovery and personal development. You'll gain clarity about your path forward and feel more confident in your decisions. Creative pursuits are highly favored, especially in the latter half of ${formattedMonth}.`,
    },
    energyTrends,
    areas,
    recommendations: {
      favorableDays,
      actions: [
        `Schedule important meetings on your favorable days`,
        `Practice meditation to enhance intuition`,
        `Focus on clear communication in relationships`,
        `Review financial plans mid-month`,
        `Make time for creative pursuits`,
      ],
      avoidances: [
        `Making major financial decisions on the 8th or 15th`,
        `Rushing into new partnerships without proper consideration`,
        `Neglecting self-care routines`,
        `Overcommitting to social events in the third week`,
      ],
    },
    createdAt: new Date().toISOString(),
  };
};
