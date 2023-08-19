import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
  View,
} from "react-native";
import BobaItem, { BobaItemProps } from "./BobaItem";

export type BobaListProps = {
  latitude: Number | null;
  longitude: Number | null;
};

const BobaList: React.FC<BobaListProps> = ({ latitude, longitude }) => {
  const [bobaData, setBobaData] = useState<BobaItemProps[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const retrieveNearbyBoba = async () => {
    const URL = `http://localhost:8000/nearby_boba/?latitude=${latitude}&longitude=${longitude}`;

    console.log(`fetching data at ${URL}`);
    try {
      const response = await fetch(URL);
      const responseJson = await response.json();
      responseJson.sort(
        (a: BobaItemProps, b: BobaItemProps) => a.dist - b.dist
      );
      setBobaData(responseJson);
      setIsLoading(false);

      console.log(responseJson);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (latitude && longitude) {
      retrieveNearbyBoba();
    }
  }, [latitude, longitude]);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={isLoading ? styles.loading : null}
    >
      {bobaData === null ? (
        <View style={[styles.loading, styles.scrollView]}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      ) : (
        bobaData.map((boba) => <BobaItem key={boba.id} {...boba} />)
      )}
    </ScrollView>
  );
};

export default BobaList;

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
    flex: 1,
    borderRadius: 10,
    padding: 1,
  },
  loading: {
    flexGrow: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
