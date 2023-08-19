import React from "react";
import { Linking, Text, StyleSheet, View } from "react-native";

export interface BobaItemProps {
  id: string;
  name: string;
  rating: number;
  address: string;
  city: string;
  dist: number;
}

const BobaItem: React.FC<BobaItemProps> = (props: BobaItemProps) => {
  const openInGoogleMaps = () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${props.address}, ${props.city}`
    )}`;
    Linking.openURL(mapsUrl);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{props.name}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text onPress={openInGoogleMaps} style={styles.address}>
          {props.address}, {props.city}
        </Text>
        <Text style={styles.dist}>{props.dist} miles away.</Text>
        <Text style={styles.rating}>Rating: {props.rating}</Text>
      </View>
    </View>
  );
};

export default BobaItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    borderRadius: 20,
    padding: 0,
    paddingTop: 0,
    backgroundColor: "white",
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titleContainer: {
    width: "100%",
    backgroundColor: "#926fed",
    padding: 5,
    paddingStart: 15,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
  },
  detailContainer: { marginLeft: 13, margin: 7 },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    color: "white",
  },
  address: {
    color: "blue",
    textDecorationLine: "underline", // Underline text
    fontSize: 15

  },
  rating: {
    fontStyle: "italic",
    fontSize: 14

  },
  dist: {
    fontSize: 15
  }
});
