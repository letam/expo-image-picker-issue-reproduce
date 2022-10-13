import React, { useState, useEffect } from "react";
import { Button, Image, View, Platform } from "react-native";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { LOCATION_TASK_NAME } from "../../Constants";

const LocationTrackingButtons = () => {
  const startLocationTracking = async () => {
    console.log("STTAAAAAAAAAAAAAAAAARTING");
    const locationTaskIsDefined = TaskManager.isTaskDefined(LOCATION_TASK_NAME);
    if (locationTaskIsDefined) {
      const hasStartedLocation = await Location.hasStartedLocationUpdatesAsync(
        LOCATION_TASK_NAME
      );
      if (!hasStartedLocation) {
        console.log(
          "TRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACKING"
        );
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 5000,
          pausesUpdatesAutomatically: false,
          showsBackgroundLocationIndicator: true,
          activityType: Location.ActivityType.AutomotiveNavigation,
          foregroundService: {
            notificationTitle: "Expo Go",
            notificationBody: "Tracking",
          },
        });
      }
    }
  };

  const stopLocationTracking = async () => {
    const hasStartedLocationTask = await TaskManager.isTaskDefined(
      LOCATION_TASK_NAME
    );
    if (hasStartedLocationTask) {
      const hasStartedLocation = await Location.hasStartedLocationUpdatesAsync(
        LOCATION_TASK_NAME
      );
      if (hasStartedLocation) {
        console.log("Stopping");
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      }
    }
  };

  return (
    <View style={{ marginTop: 100, marginBottom: 100 }}>
      <Button title="Start tracking" onPress={startLocationTracking} />
      <Button title="Stop tracking" onPress={stopLocationTracking} />
    </View>
  );
};

export default LocationTrackingButtons;
