import * as Location from "expo-location";
import i18n from "i18n-js";
import { useContext, useEffect, useState } from "react";
import { Alert, AppState, Platform } from "react-native";

const getPermissions: (() => Promise<any>)[] = [
  Location.getForegroundPermissionsAsync,
  Location.getBackgroundPermissionsAsync,
];

const requestPermissions: (() => Promise<any>)[] = [
  Location.requestForegroundPermissionsAsync,
  Location.requestBackgroundPermissionsAsync,
];

const useLocationPermissions = () => {
  const [locationPermissionsAreGranted, setLocationPermissionsAreGranted] =
    useState<boolean>(false);

  useEffect(() => {
    requestPermission(2000);
  }, []);

  async function checkAllPermissions(): Promise<(() => Promise<any>)[]> {
    const results = await Promise.all(getPermissions.map((fn) => fn()));
    console.log("Check all permissions results: ", results);

    const requestUnaccepted: (() => Promise<any>)[] = [];
    results.forEach((result, idx) => {
      if (!result?.granted) {
        requestUnaccepted.push(requestPermissions[idx]);
      }
    });
    if (results.every((result) => result?.granted)) {
      setLocationPermissionsAreGranted(true);
    }
    return requestUnaccepted;
  }

  async function requestPermission(WAIT_MS = 0) {
    try {
      const permissionRequired = await checkAllPermissions();
      if (permissionRequired.length === 0) {
        return;
      }

      setTimeout(async () => {
        const statuses: any = [];
        for (const request of permissionRequired) {
          console.log("Requesting permission", request.name, request);
          const status = await request();
          statuses.push(status);
        }
        if (statuses.every((status) => status.granted)) {
          setLocationPermissionsAreGranted(true);
        }
      }, WAIT_MS);
    } catch (e) {
      console.error("Permission Error", e);
    }
  }

  return {
    locationPermissionsAreGranted,
    requestPermission,
  };
};

// source: https://github.com/expo/expo/discussions/16454

export default useLocationPermissions;
