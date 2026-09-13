import { View, Text, StyleSheet, Platform } from "react-native";

export default function Topbar({ title }) {
  return (
    <View style={[styles.container, Platform.OS === "ios" && styles.containerIOS]}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "dodgerblue",
    padding: 24,
  },
  containerIOS: {
    paddingTop: 60,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});