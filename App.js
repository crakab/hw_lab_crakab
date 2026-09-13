import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import Topbar from "./topbar.js";
import TempConverter from "./tempconverter.js";

export default function App() {
  return (
    <View>
      <StatusBar hidden />
      <Topbar title="TempConverter" />
      <TempConverter />
    </View>
  );
}