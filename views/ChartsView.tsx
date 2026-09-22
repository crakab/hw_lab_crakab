import React from 'react';
import { ScrollView, Dimensions, StyleSheet, Text } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useLibrary } from '../viewModels/LibraryContext';

const screenWidth = Dimensions.get('window').width;

export default function ChartsView() {
  const { getMaleAuthoredBooks, getFemaleAuthoredBooks, getBooksFor } = useLibrary();

  const genderData = {
    labels: ['Male', 'Female'],
    datasets: [{ data: [getMaleAuthoredBooks().length, getFemaleAuthoredBooks().length] }],
  };

  const blueConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: () => '#3c78f6',
    labelColor: () => '#000',
  };

  const authorData = {
    labels: ['Shakespeare', 'Tolkien', 'Austen', 'Dickens', 'Bronte'],
    datasets: [
      {
        data: [
          getBooksFor('William Shakespeare').length,
          getBooksFor('J.R.R. Tolkien').length,
          getBooksFor('Jane Austen').length,
          getBooksFor('Charles Dickens').length,
          getBooksFor('Charlotte Bronte').length,
        ],
      },
    ],
  };

  const greenConfig = { ...blueConfig, color: () => '#3fa34d' };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Books by Author Gender</Text>
      <BarChart
        data={genderData}
        width={screenWidth - 40}
        height={250}
        chartConfig={blueConfig}
        fromZero
        yAxisLabel=""
        yAxisSuffix=""
      />

      <Text style={styles.title}>Books by Popular Author</Text>
      <BarChart
        data={authorData}
        width={screenWidth - 40}
        height={250}
        chartConfig={greenConfig}
        fromZero
        yAxisLabel=""
        yAxisSuffix=""
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 60 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
});
