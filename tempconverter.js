import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function TempConverter() {
  const [temp, setTemp] = useState("");
  const [unit, setUnit] = useState(false);
  const [tempInput, setTempInput] = useState("");

  // Convert Celsius to Fahrenheit
  const convertToF = (value) => {
    return (value * 9) / 5 + 32;
  };

  // Convert Fahrenheit to Celsius
  const convertToC = (value) => {
    return ((value - 32) * 5) / 9;
  };

  // Convert temperature based on unit
  const convertTemp = (value, unit) => {
    if (value === "" || isNaN(value)) {
      return "-";
    }
    value = parseInt(value);
    if (unit) {
      value = convertToC(value);
    } else {
      value = convertToF(value);
    }
    return value.toFixed(1);
  };

  const getUnit = (unit) => {
    return unit ? "C" : "F";
  };

  const handleTempChange = (value) => {
    setTempInput(value);
  };

  const handleUnitChange = () => {
    setUnit((prevUnit) => !prevUnit);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tempContainer}>
        <Text style={styles.tempText}>
          {convertTemp(temp, unit)}
          <Text style={styles.tempUnit}>°{getUnit(unit)}</Text>
        </Text>
      </View>
      <View style={styles.tempInputGroup}>
        <Text style={styles.tempInputLabel}>Enter Temperature</Text>
        <TextInput
          style={styles.tempInput}
          keyboardType="numeric"
          maxLength={20}
          onChangeText={handleTempChange}
        />
      </View>
      <View style={styles.tempUnitChangeGroup}>
        <Text style={[styles.tempUnitLabel, styles.tempUnitLabelBlue]}>°C &gt; °F</Text>
        <Switch
          style={styles.tempUnitSwitch}
          trackColor={{ false: "#cccccc", true: "#cccccc" }}
          thumbColor={unit ? "orange" : "blue"}
          value={unit}
          onValueChange={handleUnitChange}
        />
        <Text style={[styles.tempUnitLabel, styles.tempUnitLabelOrange]}>°F &gt; °C</Text>
      </View>
      <TouchableOpacity style={styles.convertButton} onPress={() => setTemp(tempInput)}>
        <Text style={styles.convertBtnText}>Convert</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  tempContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 250,
    borderRadius: 100,
  },
  tempText: {
    fontSize: 60,
    fontWeight: "bold",
  },
  tempUnit: {
    fontSize: 30,
    fontWeight: "bold",
    color: "gray",
  },
  tempInputGroup: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    gap: 20,
  },
  tempInputLabel: {
    fontSize: 17,
    color: "black",
    fontWeight: "bold",
  },
  tempInput: {
    padding: 8,
    borderColor: "black",
    borderWidth: 1,
    height: 50,
    width: 200,
    borderRadius: 7,
    textAlign: "right",
    fontWeight: "bold",
  },
  tempUnitChangeGroup: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  tempUnitLabel: {
    fontSize: 17,
    fontWeight: "bold",
  },
  tempUnitLabelBlue: {
    color: "blue",
  },
  tempUnitLabelOrange: {
    color: "orange",
  },
  tempUnitSwitch: {
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
  },
  convertButton: {
    backgroundColor: "dodgerblue",
    borderRadius: 7,
    width: 150,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    margin: "auto",
  },
  convertBtnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
