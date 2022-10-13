import * as ImagePicker from "expo-image-picker";
import * as TaskManager from "expo-task-manager";
import React, { useEffect, useState } from "react";
import { Alert, Button, Image, LogBox, Text, View } from "react-native";

import { LOCATION_TASK_NAME } from "./Constants";
import LocationTrackingButtons from "./src/hooks/LocationTrackingButtons";

// require("log-timestamp"); // only enable this in developmnent mode

const App = () => {
  const [image, setImage] = useState(null);
  console.log("App.TSX: RENDERING");

  // useEffect(() => {
  //   return () => {
  //     console.log("STOPPING ALL REGISTERED TASKS");
  //     TaskManager.unregisterAllTasksAsync();
  //   };
  // }, []);

  const pickCameraImage = async () => {
    console.log("Picking camera image");
    let result: any;

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

    if (result && !result.cancelled) {
      setImage(result.uri);
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

  TaskManager.defineTask(
    LOCATION_TASK_NAME,
    ({ data: { locations }, error }) => {
      if (error) {
        throw new Error(error.message);
      }
      console.log("Locations: ", locations);
      // if (locations) {

      //   const [location] = locations;
      //   updateDriverLocation(location);
      // }
    }
  );

  // TODO: add min version check also on this level, hence min version check should work via API KEY

  return (
    <View>
      <LocationTrackingButtons />
      <Button
        title="Pick an image from camera roll"
        onPress={pickCameraImage}
      />
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
    </View>
  );
};

export default App;
