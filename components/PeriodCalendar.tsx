import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface PeriodCalendarProps {
  onComplete?: () => void;
}

const PeriodCalendar = ({ onComplete }: PeriodCalendarProps) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get calendar data
  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateSelected = (date: Date): boolean => {
    return selectedDates.some(selectedDate => 
      selectedDate.toDateString() === date.toDateString()
    );
  };

  const handleDatePress = (date: Date) => {
    const dateStr = date.toDateString();
    const isSelected = selectedDates.some(selectedDate => 
      selectedDate.toDateString() === dateStr
    );

    if (isSelected) {
      // Remove date if already selected
      setSelectedDates(selectedDates.filter(selectedDate => 
        selectedDate.toDateString() !== dateStr
      ));
    } else {
      // Add date if not selected
      setSelectedDates([...selectedDates, date]);
    }
  };

  const navigateMonth = (direction: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const handleSave = () => {
    if (selectedDates.length === 0) {
      Alert.alert('No dates selected', 'Please select the dates of your last period.');
      return;
    }

    // Sort dates
    const sortedDates = selectedDates.sort((a, b) => a.getTime() - b.getTime());
    const startDate = sortedDates[0];
    const endDate = sortedDates[sortedDates.length - 1];

    Alert.alert(
      'Period Saved',
      `Your period from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()} has been recorded.`,
      [
        {
          text: 'OK',
          onPress: () => {
            // Here you would typically save to your app's storage
            // and navigate to the next screen
            console.log('Saved period dates:', sortedDates);
            // Call the onComplete callback to proceed to the next screen
            onComplete?.();
          }
        }
      ]
    );
  };

  const days = getDaysInMonth(currentMonth);
  const monthYear = currentMonth.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Track Your Period</Text>
        <Text style={styles.subtitle}>
          Select the dates of your last period
        </Text>
      </View>

      <View style={styles.calendarContainer}>
        {/* Month navigation */}
        <View style={styles.monthHeader}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigateMonth(-1)}
          >
            <Text style={styles.navButtonText}>←</Text>
          </TouchableOpacity>
          
          <Text style={styles.monthText}>{monthYear}</Text>
          
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigateMonth(1)}
          >
            <Text style={styles.navButtonText}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Day headers */}
        <View style={styles.dayHeaders}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <Text key={day} style={styles.dayHeader}>{day}</Text>
          ))}
        </View>

        {/* Calendar grid */}
        <View style={styles.calendar}>
          {days.map((date, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                date && isDateSelected(date) && styles.selectedDay,
              ]}
              onPress={() => date && handleDatePress(date)}
              disabled={!date}
            >
              <Text style={[
                styles.dayText,
                date && isDateSelected(date) && styles.selectedDayText,
                !date && styles.emptyDay,
              ]}>
                {date ? date.getDate() : ''}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {selectedDates.length > 0 && (
        <View style={styles.selectedInfo}>
          <Text style={styles.selectedTitle}>Selected Dates:</Text>
          <Text style={styles.selectedCount}>
            {selectedDates.length} day{selectedDates.length !== 1 ? 's' : ''} selected
          </Text>
        </View>
      )}

      <TouchableOpacity 
        style={[
          styles.saveButton,
          selectedDates.length === 0 && styles.saveButtonDisabled
        ]}
        onPress={handleSave}
        disabled={selectedDates.length === 0}
      >
        <Text style={styles.saveButtonText}>Save Period Dates</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#e91e63',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  calendarContainer: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  navButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#666',
    fontSize: 12,
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 5,
  },
  selectedDay: {
    backgroundColor: '#e91e63',
  },
  dayText: {
    fontSize: 16,
    color: '#333',
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyDay: {
    color: 'transparent',
  },
  selectedInfo: {
    margin: 20,
    padding: 15,
    backgroundColor: '#fff3e0',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  selectedCount: {
    fontSize: 14,
    color: '#666',
  },
  saveButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#e91e63',
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PeriodCalendar; 