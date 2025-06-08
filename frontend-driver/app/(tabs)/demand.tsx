import { Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Dimensions } from 'react-native';
import React, { useState } from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import { LineChart } from 'react-native-chart-kit';
import handleSubmit from '@/services/routes';
import * as types from "@/types";
import data from '@/data/sources';
// import demoResult from '@/data/demo.json';
import styles from "../../styles/demandStyles"; // 👈 updated import

const screenWidth = Dimensions.get('window').width;

export default function Index() {
  const [source, setSource] = useState<string>("");
  const [result, setResult] = useState<types.PredictionData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedPoint, setSelectedPoint] = useState<{x: number, y: number} | null>(null);

  const locations = data;

  const onSubmit = async () => {
    if (!source.trim()) {
      Alert.alert("Error", "Please select a source location");
      return;
    }
    setIsLoading(true);
    
    // // Simulate API call with demo data
    // setTimeout(() => {
    //   setResult(demoResult as types.PredictionData);
    //   setIsLoading(false);
    // }, 1500);
    
    // Uncomment for real API call
    try {
      const res = await handleSubmit(null as unknown as void, `demand/${source}`, 'GET');
      setResult(res);
    } catch (error) {
      Alert.alert("Error", "Error fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const chartConfig = {
    backgroundColor: '#1a1a1a',
    backgroundGradientFrom: '#1a1a1a',
    backgroundGradientTo: '#2d2d2d',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 255, 127, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "2",
      strokeWidth: "2",
      stroke: "#00ff7f"
    },
    propsForBackgroundLines: {
      strokeDasharray: "",
      stroke: "#333333",
      strokeWidth: 1
    }
  };

  const chartData = result ? {
    labels: result.x?.map(x => x % 4 === 0 ? formatHour(x) : '') || [],
    datasets: [{
      data: result.y || [],
      color: (opacity = 1) => `rgba(0, 255, 127, ${opacity})`,
      strokeWidth: 3
    }]
  } : null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Demand Forecast</Text>
        <Text style={styles.subtitle}>Optimize your earnings with data-driven insights</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>
        </Text>
        
        <SelectDropdown
          data={locations}
          search={true}
          searchInputStyle={styles.searchInputStyle}
          searchPlaceHolder="Type to search locations..."
          searchPlaceHolderColor="#fff"
          searchInputTxtColor="#fff"
          onSelect={(selectedItem: string) => {setSource(selectedItem);}}
          renderButton={(selectedItem: string, isOpened: boolean) => (
            <View style={[styles.dropdownButtonStyle, isOpened && styles.dropdownButtonOpen]}>
              <Text style={[styles.dropdownButtonTxtStyle, !selectedItem && styles.placeholderText]}>
                {selectedItem || 'Select source location'}
              </Text>
            </View>
          )}
          renderItem={(item, index, isSelected) => (
            <View style={[styles.dropdownItemStyle, isSelected && styles.selectedItem]}>
              <Text style={[styles.dropdownItemTxtStyle, isSelected && styles.selectedItemText]}>
                {item}
              </Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />

        <TouchableOpacity 
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]} 
          onPress={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <>
              <Text style={styles.submitButtonText}>Get Forecast</Text>
            </>
          )}
        </TouchableOpacity>

        {result && (
          <View style={styles.resultsContainer}>
            {/* Summary Cards */}
            <View style={styles.summaryContainer}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>₹{result.max_earning?.toFixed(2)}</Text>
                <Text style={styles.summaryLabel}>Max Earning</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>{formatHour(result.best_hour || 0)}</Text>
                <Text style={styles.summaryLabel}>Best Hour</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryValue}>{result.best_drop}</Text>
                <Text style={styles.summaryLabel}>Best Location</Text>
              </View>
            </View>

            {/* Interactive Chart */}
            {chartData && (
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>
                </Text>
                <LineChart
                  data={chartData}
                  width={screenWidth - 40}
                  height={320}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                  onDataPointClick={(data) => {
                    setSelectedPoint({x: data.index, y: data.value});
                  }}
                  withInnerLines={true}
                  withOuterLines={true}
                  withVerticalLines={true}
                  withHorizontalLines={true}
                />
                {selectedPoint && (
                  <View style={styles.selectedPointInfo}>
                    <Text style={styles.selectedPointText}>
                      {formatHour(selectedPoint.x)}: ₹{selectedPoint.y.toFixed(2)}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Hourly Data Table */}
            <View style={styles.tableContainer}>
              <Text style={styles.tableTitle}>
              </Text>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Time</Text>
                <Text style={styles.tableHeaderText}>Earnings</Text>
                <Text style={styles.tableHeaderText}>Best Location</Text>
              </View>
              <ScrollView style={styles.tableScrollView} nestedScrollEnabled={true}>
                {result.hourly_table?.map((entry, index) => (
                  <View key={index} style={[
                    styles.tableRow, 
                    entry.hour === result.best_hour && styles.bestHourRow
                  ]}>
                    <Text style={styles.tableCell}>{formatHour(entry.hour)}</Text>
                    <Text style={[styles.tableCell, styles.earningsCell]}>
                      ₹{entry.max_money.toFixed(2)}
                    </Text>
                    <Text style={[styles.tableCell, styles.locationCell]}>
                      {entry.drop_locations[0]}
                    </Text>
                    {entry.hour === result.best_hour && ("")}
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
