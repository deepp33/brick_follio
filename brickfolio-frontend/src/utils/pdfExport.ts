import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface MarketDataForPDF {
  metrics: {
    averageROI: string;
    yearlyROIChange: string;
    priceGrowth: string;
    priceYoYChange: string;
    rentalYield: string;
    rentalYieldChange: string;
    marketVolume: string;
    totalTransactionVolumeChange: string;
  };
  topPerformingAreas: Array<{
    area: string;
    growth: string;
  }>;
  investmentTrends: Array<{
    type: string;
    percentage: string;
  }>;
  marketTrends?: {
    roiTrendsByArea: {
      options: Array<{
        location: string;
        roi: string[];
      }>;
      months: string[];
    };
    rentalYieldByArea: Array<{
      location: string;
      rentalYield: string;
      properties: number;
    }>;
    transactionVolumes?: {
      options: string[];
      Month: Record<string, Record<string, number>>;
    };
  };
  filters?: {
    timeHorizon: string;
    regions: string[];
    propertyTypes: string[];
    roiRange: { min: number; max: number };
    rentalYieldRange: { min: number; max: number };
    priceGrowthRange: { min: number; max: number };
  };
}

export const generateMarketAnalyticsPDF = async (
  marketData: MarketDataForPDF,
  elementRef?: HTMLElement
): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Add header
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Market Insights & Analytics Report', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Add date
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  pdf.text(`Generated on: ${currentDate}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  // Add key metrics section
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Key Market Metrics', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  const metrics = [
    { label: 'Average ROI', value: marketData.metrics.averageROI, change: marketData.metrics.yearlyROIChange },
    { label: 'Price Growth', value: marketData.metrics.priceGrowth, change: marketData.metrics.priceYoYChange },
    { label: 'Rental Yield', value: marketData.metrics.rentalYield, change: marketData.metrics.rentalYieldChange },
    { label: 'Market Volume', value: marketData.metrics.marketVolume, change: marketData.metrics.totalTransactionVolumeChange }
  ];

  metrics.forEach((metric, index) => {
    const x = margin + (index % 2) * (contentWidth / 2);
    const y = yPosition + Math.floor(index / 2) * 15;
    
    pdf.setFont('helvetica', 'bold');
    pdf.text(metric.label, x, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${metric.value} (${metric.change})`, x, y + 5);
  });

  yPosition += 35;

  // Add top performing areas
  if (marketData.topPerformingAreas && marketData.topPerformingAreas.length > 0) {
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Top Performing Areas', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');

    marketData.topPerformingAreas.forEach((area, index) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(`${index + 1}. ${area.area}: ${area.growth}`, margin, yPosition);
      yPosition += 7;
    });

    yPosition += 10;
  }

  // Add investment trends
  if (marketData.investmentTrends && marketData.investmentTrends.length > 0) {
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Investment Trends', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');

    marketData.investmentTrends.forEach((trend) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(`${trend.type}: ${trend.percentage}`, margin, yPosition);
      yPosition += 7;
    });

    yPosition += 10;
  }

  // Add filtered trends data if available
  if (marketData.marketTrends) {
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Filtered Market Trends', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');

    // ROI Trends
    if (marketData.marketTrends.roiTrendsByArea && marketData.marketTrends.roiTrendsByArea.options && marketData.marketTrends.roiTrendsByArea.options.length > 0) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('ROI Trends by Area:', margin, yPosition);
      yPosition += 7;

      pdf.setFont('helvetica', 'normal');
      marketData.marketTrends.roiTrendsByArea.options.forEach((option) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = margin;
        }
        const latestRoi = option.roi[option.roi.length - 1];
        pdf.text(`${option.location}: ${latestRoi}%`, margin + 10, yPosition);
        yPosition += 7;
      });
      yPosition += 5;
    }

    // Rental Yield Trends
    if (marketData.marketTrends.rentalYieldByArea && marketData.marketTrends.rentalYieldByArea.length > 0) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Rental Yield by Area:', margin, yPosition);
      yPosition += 7;

      pdf.setFont('helvetica', 'normal');
      marketData.marketTrends.rentalYieldByArea.forEach((yieldData) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(`${yieldData.location}: ${yieldData.rentalYield}% (${yieldData.properties} properties)`, margin + 10, yPosition);
        yPosition += 7;
      });
      yPosition += 5;
    }
  }

  // Add applied filters if available
  if (marketData.filters) {
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Applied Filters', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');

    const filters = [
      `Time Horizon: ${marketData.filters.timeHorizon}`,
      `Regions: ${marketData.filters.regions.join(', ')}`,
      `Property Types: ${marketData.filters.propertyTypes.join(', ')}`,
      `ROI Range: ${marketData.filters.roiRange.min}% - ${marketData.filters.roiRange.max}%`,
      `Rental Yield Range: ${marketData.filters.rentalYieldRange.min}% - ${marketData.filters.rentalYieldRange.max}%`,
      `Price Growth Range: ${marketData.filters.priceGrowthRange.min}% - ${marketData.filters.priceGrowthRange.max}%`
    ];

    filters.forEach((filter) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(filter, margin, yPosition);
      yPosition += 7;
    });
  }

  // Add footer
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    pdf.text('BrickFolio Market Analytics Report', pageWidth / 2, pageHeight - 5, { align: 'center' });
  }

  // Save the PDF
  const fileName = `market-analytics-report-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};

export const generatePDFFromElement = async (elementRef: HTMLElement): Promise<void> => {
  try {
    const canvas = await html2canvas(elementRef, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 10;

    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const fileName = `market-analytics-screenshot-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating PDF from element:', error);
    throw error;
  }
};
