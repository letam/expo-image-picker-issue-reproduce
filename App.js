import React, { useState, useEffect } from "react";
import { Button, Image, View, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function ImagePickerExample() {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const permissionsAreGranted = await checkAndGetCameraPermissions();
    console.log(permissionsAreGranted);
    let result;
    if (permissionsAreGranted) {
      console.log("Opening camera");
      result = await ImagePicker.launchCameraAsync({
        base64: true,
        // allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.2,
      });
    } else {
      displayCameraPermissionsNotGrantedAlert();
    }

    // console.log(result);

    if (!result.cancelled) {
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

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
    </View>
  );
}
