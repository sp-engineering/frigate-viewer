# Viewer for Frigate

This is mobile application which has been written using React Native to easily browse camera events of Frigate NVR. This is not official app.

## Android developing

Follow the instructions of React Native docs to install Android Studio and the emulator.

Run `npm install` to install dependencies and `npm run android` to start the emulator, compile the app and install it on the emulator or a connected device.

`google-services.json` file should be placed in `./android/app` folder - it should contain credentials to Firebase for Crashlytics service.

## iOS developing

I've never run this application on iOS. It should work in theory, but probably needs some enhancements.



# Viewer for Frigate

A lightweight, unofficial mobile client for Frigate NVR, built with React Native. This app allows you to easily browse camera events and monitor your Frigate instance on the go.

## Support & Contact
If you encounter any issues or have questions regarding the app:
* **Issues:** Please open a [GitHub Issue](https://github.com/sp-engineering/frigate-viewer/issues) with a description of the problem.
* **Contact:** You can also reach out via email: [szymon@piwowarczyk.net](mailto:szymon@piwowarczyk.net)

## Platforms
* **Android:** Fully supported
* **iOS:**
  * No RTSP support yet

---
*Disclaimer: This is an unofficial application and is not affiliated with the official Frigate NVR project.*
