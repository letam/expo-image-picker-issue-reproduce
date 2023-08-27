import { ConfigContext } from "@expo/config";

export default ({ config }: ConfigContext) => {
	return {
		name: process.env.APP_NAME,
		slug: "trans-it-camera-app",
		version: config?.version,
		owner: "transit",
		runtimeVersion: config?.version,
		splash: {
			image: "./src/assets/splashScreen.png",
			resizeMode: "contain",
			backgroundColor: "#ffffff",
		},
		extra: {
			eas: {
				projectId: "17790f01-562f-465a-be7e-8440d16ca638",
			},
		},
		androidStatusBar: {
			backgroundColor: "#304CB4",
			translucent: false,
		},
		userInterfaceStyle: "automatic",
		assetBundlePatterns: ["**/*"],
		ios: {
			supportsTablet: false,
			userInterfaceStyle: "automatic",
			icon: process.env.APP_VARIANT
				? `./src/assets/iosIcons/iosIcon${process.env.APP_VARIANT}.png`
				: `./src/assets/iosIcons/iosIconDev.png`,
			bundleIdentifier: process.env.PACKAGE_NAME
				? process.env.PACKAGE_NAME
				: "be.transit.camera.dev",
			buildNumber: config?.ios?.buildNumber,
			infoPlist: {
				NSCameraUsageDescription:
					"This app uses the camera to send pictures or create a new profile photo.",
				NSPhotoLibraryAddUsageDescription:
					"User can download documents that were previously uploaded by company",
				NSPhotoLibraryUsageDescription:
					"User can upload Photos/Documents to be seen by his/her company",
				NSLocationWhenInUseUsageDescription:
					"Location is shared with your company while you are completing an order.",
				NSLocationAlwaysUsageDescription:
					"Location is shared with your company while you are completing an order even when the app is in the background.",
				NSUserActivityTypes: ["INSendMessageIntent", "INStartCallIntent"],
				UIBackgroundModes: ["location", "fetch"],
				CFBundleAllowMixedLocalizations: true,
			},
		},
		locales: {
			nl: "./languages/nederlands.json",
			en: "./languages/english.json",
		},
		notification: {
			icon: "./src/assets/notificationIcon.png",
			color: "#ffffff",
			androidMode: "collapse",
			androidCollapsedTitle: "Trans-IT notifications",
		},
		android: {
			package: "process.env.PACKAGE_NAME",
			userInterfaceStyle: "automatic",
			useNextNotificationsApi: true,
			icon: process.env.APP_VARIANT
				? `./src/assets/androidLegacyIcons/androidIcon${process.env.APP_VARIANT}.png`
				: `./src/assets/androidLegacyIcons/androidIconDev.png`,
			adaptiveIcon: {
				foregroundImage: process.env.APP_VARIANT
					? `./src/assets/androidAdaptiveIcons/androidAdaptiveIcon${process.env.APP_VARIANT}.png`
					: `./src/assets/androidAdaptiveIcons/androidAdaptiveIconDev.png`,
				backgroundColor: "#ffffff",
			},
			versionCode: config?.android?.versionCode,
			permissions: [
				"CAMERA",
				"READ_EXTERNAL_STORAGE",
				"WRITE_EXTERNAL_STORAGE",
				"com.htc.launcher.permission.READ_SETTING",
				"ACCESS_COARSE_LOCATION",
				"ACCESS_FINE_LOCATION",
				"ACCESS_BACKGROUND_LOCATION",
				"RECEIVE_BOOT_COMPLETED",
			],
		},
		web: {
			favicon: "./src//assets/favicon.png",
		},
	};
};
