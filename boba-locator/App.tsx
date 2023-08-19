import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Card, ListItem } from "react-native-elements";
import BobaList from "./components/BobaList";
import * as Location from "expo-location";

export default function App() {
  const [curLatitude, setCurLatitude] = useState<number | null>(null);
  const [curLongitude, setCurLongitude] = useState<number | null>(null);
  const [city, setCity] = useState<string>("");

  const fetchLocation = async () => {
    let locationSubscription: Location.LocationSubscription | null = null;
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Location permission not granted");
        return;
      }

      // Get location and update when changed
      let locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // Update every 1 second
        },
        (newLocation) => {
          console.log(newLocation.coords);
          const { latitude, longitude } = newLocation.coords;
          setCurLatitude(latitude);
          setCurLongitude(longitude);
        }
      );

      // Get city from coords
      const API_URL = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${curLatitude}&lon=${curLongitude}`;
      fetch(API_URL)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.address && data.address.city) {
            setCity(data.address.city);
          }
        })
        .catch((error) => {
          console.error("Error fetching city:", error);
        });
    } catch (error) {
      console.error("Error fetching location:", error);
    }

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  };

  useEffect(() => {
    // Function to fetch nearby boba stores
    fetchLocation();
  }, [curLatitude, curLongitude]);

  return (
    <View style={styles.container}>
      <View style={[styles.flexItem, styles.textContainer]}>
        <Text style={styles.title}>Boba Near Me</Text>
        {city && <Text style={styles.location}>Current Location: {city}</Text>}
      </View>
      <View style={[styles.flexItem, styles.scrollViewContainer]}>
        <BobaList latitude={curLatitude} longitude={curLongitude} />
      </View>
    </View>
  );
  // TODO: if no boba in walking dist, display a sad message
  // TODO: send a notif if there is boba within walking dist
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "10%",
    backgroundColor: "#45249c",
  },
  flexItem: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    margin: "5%",
    padding: "5%",
  },
  textContainer: {
    flex: 1,
    padding: "0%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    color: "white",
  },
  location: {
    fontSize: 18,
    color: "white",
  },
  scrollViewContainer: {
    flex: 5,
    padding: 0,
    borderRadius: 10,
    backgroundColor: "#f0edf7",
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.75,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
