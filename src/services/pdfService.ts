import jsPDF from 'jspdf';
import type { Trip, DayItinerary, Hotel, WeatherData, PackingItem, BudgetBreakdown } from '../store/useStore';

export async function generatePDF(
  trip: Partial<Trip> | null,
  itinerary: DayItinerary[],
  hotels: Hotel[],
  weather: WeatherData | null,
  packingList: PackingItem[],
  budget: BudgetBreakdown | null
): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 0;

  const addPage = () => {
    doc.addPage();
    y = 20;
    addHeader();
  };

  const checkPageBreak = (needed: number = 20) => {
    if (y + needed > pageHeight - 20) addPage();
  };

  const addHeader = () => {
    doc.setFillColor(99, 102, 241);
    doc.rect(0, 0, pageWidth, 12, 'F');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('Smart AI Travel Planner | Powered by Gemini AI', 10, 8);
    doc.text(`${trip?.destination || 'Travel Report'}`, pageWidth - 10, 8, { align: 'right' });
  };

  // Cover Page
  doc.setFillColor(99, 102, 241);
  doc.rect(0, 0, pageWidth, 80, 'F');
  
  // Decorative circles
  doc.setFillColor(139, 92, 246);
  doc.circle(pageWidth - 20, 20, 30, 'F');
  doc.setFillColor(236, 72, 153);
  doc.circle(20, 70, 20, 'F');

  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('Smart AI Travel', 20, 35);
  doc.text('Planner', 20, 48);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Powered by Google Gemini AI', 20, 60);

  // India flag colors bar
  doc.setFillColor(255, 153, 51);
  doc.rect(0, 80, pageWidth / 3, 4, 'F');
  doc.setFillColor(255, 255, 255);
  doc.rect(pageWidth / 3, 80, pageWidth / 3, 4, 'F');
  doc.setFillColor(19, 136, 8);
  doc.rect((pageWidth / 3) * 2, 80, pageWidth / 3, 4, 'F');

  y = 100;

  // Trip Summary Box
  doc.setFillColor(245, 247, 255);
  doc.roundedRect(15, y, pageWidth - 30, 65, 5, 5, 'F');
  doc.setFillColor(99, 102, 241);
  doc.roundedRect(15, y, 5, 65, 2, 2, 'F');

  doc.setFontSize(16);
  doc.setTextColor(30, 30, 80);
  doc.setFont('helvetica', 'bold');
  doc.text(`Location: ${trip?.destination || 'Your Destination'}`, 25, y + 14);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 120);

  const details = [
    [`Duration:`, `${trip?.days || 0} Days`],
    [`Travelers:`, `${trip?.travelers || 0} People`],
    [`Budget:`, `${trip?.currency || 'INR'} ${(trip?.budget || 0).toLocaleString()}`],
    [`Start Date:`, trip?.startDate || 'N/A'],
    [`Transport:`, trip?.transport || 'N/A'],
    [`Interests:`, (trip?.interests || []).join(', ')],
  ];

  details.forEach(([label, value], i) => {
    const col = i % 2 === 0 ? 25 : pageWidth / 2 + 5;
    const row = y + 28 + Math.floor(i / 2) * 12;
    doc.setFont('helvetica', 'bold');
    doc.text(label, col, row);
    doc.setFont('helvetica', 'normal');
    doc.text(value, col + 30, row);
  });

  y += 75;

  // Generated Date
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text(`Generated on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} using AI`, pageWidth / 2, y, { align: 'center' });

  // Section helper
  const addSection = (title: string, emoji: string) => {
    addPage();

    doc.setFillColor(99, 102, 241);
    doc.roundedRect(15, y, pageWidth - 30, 16, 4, 4, 'F');

    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 22, y + 11);

    y += 28;
  };

  // ITINERARY SECTION
  addSection('Day-Wise Itinerary', '');

  itinerary.forEach(day => {

    // Start every new day on a fresh page (except Day 1)
    if (day.day > 1) {
        doc.addPage();
        y = 20;
        addHeader();
    }

    checkPageBreak(60);
    
    
    doc.setFillColor(238, 240, 255);
    doc.roundedRect(15, y, pageWidth - 30, 14, 3, 3, 'F');
    doc.setFontSize(11);
    doc.setTextColor(99, 102, 241);
    doc.setFont('helvetica', 'bold');
    doc.text(`Day ${day.day}: ${day.theme}`, 20, y + 9);
    doc.setFontSize(9);
    doc.setTextColor(130, 130, 180);
    doc.text(`${new Date(day.date).toLocaleDateString('en-IN')} | Est: Rs.${day.dailyExpense?.toLocaleString() || 'N/A'}`, pageWidth - 20, y + 9, { align: 'right' });
    y += 18;

    ['Morning', 'Afternoon', 'Evening'].forEach((period, pi) => {
      const activities = period === 'Morning' ? day.morning : period === 'Afternoon' ? day.afternoon : day.evening;
      if (!activities || activities.length === 0) return;

      checkPageBreak(25);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(pi === 0 ? 245 : pi === 1 ? 16 : 139, pi === 0 ? 158 : pi === 1 ? 185 : 92, pi === 0 ? 11 : pi === 1 ? 129 : 246);
      const icon = period === 'Morning' ? '' : period === 'Afternoon' ? '' : '';
      doc.text(`${icon} ${period}`, 20, y);
      y += 7;

      activities.forEach(act => {
        checkPageBreak(16);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(40, 40, 80);
        doc.text(`- ${act.name}`, 22, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 130);
        doc.text(`${act.duration} | Rs.${act.cost === 0 ? 'Free' : act.cost?.toLocaleString()}`, pageWidth - 20, y, { align: 'right' });
        y += 6;
        
        if (act.description) {
          const descLines = doc.splitTextToSize(`    ${act.description}`, pageWidth - 50);
          doc.setFontSize(8);
          doc.text(descLines.slice(0, 2), 22, y);
          y += descLines.slice(0, 2).length * 4 + 2;
        }
      });
    });

    if (day.restaurants && day.restaurants.length > 0) {
      checkPageBreak(16);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(239, 68, 68);
      doc.text('Restaurants', 20, y);
      y += 6;
      day.restaurants.forEach(r => {
        console.log(r.name);
        checkPageBreak(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 120);
        doc.text(`- ${r.name} — ${r.cuisine} (${r.priceRange}) | Must try: ${r.mustTry}`, 22, y);
        y += 6;
      });
    }

    if (day.tips && day.tips.length > 0) {
      checkPageBreak(25);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(245, 158, 11);
      doc.text(' Local Tips', 20, y);
      y += 6;
      day.tips.slice(0, 3).forEach(tip => {
        checkPageBreak(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 120);
        doc.text(`- ${tip}`, 22, y);
        y += 5;
      });
    }
    y += 12;
  });

  // BUDGET SECTION
  if (budget) {
    addSection('Budget Analysis', '');
    
    const budgetItems = [
      { label: 'Hotel Accommodation', amount: budget.hotel },
      { label: 'Food & Dining', amount: budget.food },
      { label: 'Transportation', amount: budget.transport },
      { label: 'Activities & Entrance', amount: budget.activities },
      { label: 'Shopping', amount: budget.shopping },
      { label: 'Miscellaneous', amount: budget.miscellaneous },
    ];

    budgetItems.forEach(item => {
      checkPageBreak(12);
      const barWidth = (item.amount / budget.total) * (pageWidth - 80);
      doc.setFillColor(225, 228, 255);
      doc.roundedRect(20, y, pageWidth - 80, 6, 2, 2, 'F');
      doc.setFillColor(99, 102, 241);
      doc.roundedRect(20, y, barWidth, 6, 2, 2, 'F');
      doc.setFontSize(9);
      doc.setTextColor(40, 40, 80);
      doc.setFont('helvetica', 'normal');
      doc.text(item.label, 20, y - 1);
      doc.setFont('helvetica', 'bold');
      doc.text(`Rs.${item.amount.toLocaleString()}`, pageWidth - 20, y + 4, { align: 'right' });
      y += 14;
    });

    checkPageBreak(14);
    doc.setFillColor(99, 102, 241);
    doc.roundedRect(15, y, pageWidth - 30, 12, 3, 3, 'F');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('Total Estimated Budget', 22, y + 8);
    doc.text(`${budget.currency} ${budget.total.toLocaleString()}`, pageWidth - 22, y + 8, { align: 'right' });
    y += 18;
  }

  // HOTELS SECTION
  if (hotels.length > 0) {
    addSection('Hotel Recommendations', '');
    
    hotels.forEach((hotel, i) => {
      checkPageBreak(35);
      doc.setFillColor(245, 247, 255);
      doc.roundedRect(15, y, pageWidth - 30, 30, 3, 3, 'F');
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 30, 80);
      doc.text(`${i + 1}. ${hotel.name} ${'*'.repeat(hotel.stars)}`, 20, y + 9);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 120);
      doc.text(`Location: ${hotel.location}`, 20, y + 17);
      doc.text(`Rating: ${hotel.rating}/5 | Price: Rs.${hotel.pricePerNight?.toLocaleString()}/night`, 20, y + 23);
      doc.text(`Amenities: ${hotel.amenities.slice(0, 5).join(', ')}`, 20, y + 29);
      y += 36;
    });
  }

  // PACKING LIST
  if (packingList.length > 0) {
    addSection('Packing Checklist', '');
    
    packingList.forEach(category => {
      checkPageBreak(20 + category.items.length * 6);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(99, 102, 241);
      doc.text(category.category, 20, y);
      y += 7;
      
      const cols = 2;
      const colWidth = (pageWidth - 40) / cols;
      category.items.forEach((item, j) => {
        const col = j % cols;
        const row = Math.floor(j / cols);
        if (col === 0 && j > 0) checkPageBreak(6);
        const x = 22 + col * colWidth;
        const yPos = y + row * 6;
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 100);
        doc.text(`- ${item}`, x, yPos);
      });
      y += Math.ceil(category.items.length / cols) * 6 + 6;
    });
  }

  // WEATHER SECTION
  if (weather) {
    addSection('Weather Information', '');
    
    checkPageBreak(20);
    doc.setFillColor(224, 242, 254);
    doc.roundedRect(15, y, pageWidth - 30, 25, 4, 4, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 100, 180);
    doc.text(`Current: ${weather.current.temp}°C — ${weather.current.description}`, 22, y + 10);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Humidity: ${weather.current.humidity}% | Wind: ${weather.current.windSpeed} km/h | Feels like: ${weather.current.feels_like}°C`, 22, y + 18);
    y += 32;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 80);
    doc.text('Packing Recommendations:', 20, y);
    y += 7;
    weather.packingSuggestions.forEach(tip => {
      checkPageBreak(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 120);
      doc.text(`- ${tip}`, 22, y);
      y += 6;
    });
  }

  // Footer on last page
  checkPageBreak(30);
  doc.setFontSize(8);
  doc.setTextColor(180, 180, 180);
  doc.text('Generated by Smart AI Travel Planner | Powered by Google Gemini AI', pageWidth / 2, pageHeight - 15, { align: 'center' });
  doc.text('This itinerary is AI-generated. Always verify details before travel.', pageWidth / 2, pageHeight - 10, { align: 'center' });

  // Add header to first page
  doc.setPage(1);
  addHeader();

  // Save
  doc.save(`SmartTravel_${trip?.destination?.replace(/\s+/g, '_') || 'Trip'}_${new Date().toISOString().split('T')[0]}.pdf`);
}
