import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Button,
  AsyncStorage,
} from "react-native";
import MapView, { Polyline } from "react-native-maps";
const Map = ({ center, trackRoute, setMapRef }) => {
  const [map, setMap] = useState();
  const latitudeDelta = 0.05;
  const longitudeDelta = 0.05;
  return (
    <MapView
      ref={(map) => {
        setMapRef(map);
      }}
      initialRegion={{
        ...center,
        latitudeDelta,
        longitudeDelta,
      }}
      provider={MapView.PROVIDER_GOOGLE}
      showsUserLocation={true}
      style={styles.mapStyle}
    >
      {trackRoute.length > 0 ? (
        <Polyline
          coordinates={trackRoute}
          strokeColor="blue" // fallback for when `strokeColors` is not supported by the map-provider
          strokeColors={["#05C6FF"]}
          strokeWidth={6}
        />
      ) : null}
    </MapView>
  );
};

const styles = StyleSheet.create({
  mapStyle: {
    width: Dimensions.get("window").width,
    flex: 1,
  },
});

export default Map;
