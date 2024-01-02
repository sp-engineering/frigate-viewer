# Frigate Viewer

This is mobile application which has been written using React Native to easily browse camera events of Frigate NVR. This is not official app.

## Android Development

Follow the instructions of [React Native docs](https://reactnative.dev/docs/environment-setup) to install [Android Studio](https://developer.android.com/studio) and the emulator.

Run `npm install` to install dependencies and `npm run android` to start the emulator, compile the app and install it on the emulator or a connected device.

`npm install --save react-native-svg-charts --force` fixes old dependancy issue on install.

`npx react-native doctor` a few times to fix any sort of path or envrioment issues.

Probably need to add this too: `yarn add react-native-asset`

## iOS Development

I've never run this application on iOS. It should work in theory, but probably needs some enhancements.
