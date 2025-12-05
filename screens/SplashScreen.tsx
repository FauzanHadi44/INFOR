import React from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image 
        source={require("../assets/Logo.png")} 
        style={styles.logo} 
        resizeMode="contain" 
      />
      <Text style={styles.brandText}>INFORMATIKA FORUM</Text>
      <ActivityIndicator size="large" color="#b39673ff" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 120,
    marginBottom: 20,
  },
  brandText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#BFA27E",
    letterSpacing: 3,
    marginBottom: 40,
  },
  loader: {
    position: 'absolute',
    bottom: 100,
  }
});
