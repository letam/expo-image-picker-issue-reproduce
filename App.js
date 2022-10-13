import React, { useState, useEffect } from "react";
import { Button, Image, View, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import useLocationPermissions from "./src/hooks/useLocationPermissions";

const LOCATION_TASK_NAME = "background-location-task";

export default function ImagePickerExample() {
  const [image, setImage] = useState(null);
  const [pickingImage, setPickingImage] = useState(false);
  useLocationPermissions();

  TaskManager.defineTask(
    LOCATION_TASK_NAME,
    ({ data: { locations }, error }) => {
      if (error) {
        throw new Error(error.message);
      }
      console.log("Locations: ", locations);
    }
  );

  useEffect(() => {
    return () => {
      console.log("STOPPING ALL UNREGISTERED TASKS");
      TaskManager.unregisterAllTasksAsync();
    };
  }, []);

  const pickCameraImage = async () => {
    console.log("Picking camera image");
    setPickingImage(true); // TODO: we should separate thes two to only block or show loading on the correct button and not on all of them
    let result;

    try {
      const permissionsAreGranted = await checkAndGetCameraPermissions();
      if (permissionsAreGranted) {
        console.log("Opening camera");
        result = await ImagePicker.launchCameraAsync({
          base64: true,
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.2,
        });
      } else {
        displayCameraPermissionsNotGrantedAlert();
      }
    } catch (error) {
      console.log(error);
    }

    if (!result.cancelled) {
      setImage(result.uri);
    }

    try {
      // if (result && !result.cancelled) {
      //   setVisibleModal(true);
      //   setResultToUpload(result);
      // }
    } finally {
      setPickingImage(false);
    }
  };
  const checkAndGetCameraPermissions = async () => {
    const res = await ImagePicker.getCameraPermissionsAsync();
    console.log("camera permissions", res);
    let granted = res.granted;
    if (!granted && res.canAskAgain) {
      console.log("Asking permissions");
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      console.log("Asked en received permissions", permission);
      if (permission.granted) {
        granted = true;
      }
    }
    return granted;
  };
  const displayCameraPermissionsNotGrantedAlert = () => {
    Alert.alert(
      "Failed",
      "Something went wrong opening the camera. Check permissions or try again.",
      [{ text: "OK" }]
    );
  };

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
          // distanceInterval: 500,
          timeInterval: 5000,
          pausesUpdatesAutomatically: false,
          showsBackgroundLocationIndicator: true,
          activityType: Location.ActivityType.AutomotiveNavigation,
          foregroundService: {
            notificationTitle: "Expo Go",
            notificationBody: "Tracking",
            notificationColor: "red",
          },
        }).then((res) => {
          console.log(res);
        });
      }
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button
        title="Pick an image from camera roll"
        onPress={pickCameraImage}
      />
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
      <Button title="Start tracking" onPress={startLocationTracking} />
    </View>
  );
}
