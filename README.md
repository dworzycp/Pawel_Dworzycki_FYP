# Should I Stay or Should I Go? (Frontend)
*Pawel Dworzycki 2018, Final Year Project at Aston University*

## Description
This part of the project is responsible for gathering user’s GPS data and sending it to a cloud hosted database and 
displaying relevant information back to the user.

## Building and running the project
### System Dependencies
```
Ionic-CLI - 3.20.0
Cordova   - 8.0.0
Ionic     - 3.9.2
Node      - 8.9.4
NPM       - 5.6.0
```
The system was developed using an environment with the above versions of required dependencies.

### Cloning
1. Install the above system dependencies
2. Using `git clone https://github.com/dworzycp/Pawel_Dworzycki_FYP/` clone the project into a directory of your choice
3. Move into the cloned directory
4. Run `npm install` to install project dependencies (not to be confused with system dependencies)

### Running in a browser
Ionic allows for projects to be ran in a web browser. Due to Ionic Native plugins used in the development of this project, this is not recommended as majority of the features will not work as intended.

### Building for mobile devices - ANDROID
For Ionic's documentation for deploying to a device, see: https://ionicframework.com/docs/intro/deploying/ 

**Dependencies**
```
Java JDK
Android Studio
Updated Android SDK tools, platform and component dependencies. Available through Android Studio’s SDK Manager.
```

**Generating an APK file**
1. Add the desired platform, for Android: `cordova platform add android --save`
2. Create a build `ionic cordova build --release android` add `--prod` flag for production
3. Navigate to: project/platforms/android/build/outputs/apk/
4. Locate a file named `android-release-unsigned.apk`, this file needs to be signed
5. Generate a private key using the keytool command provided by the JDK `keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-alias`
6. Sign the previously generated .apk `jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.jks android-release-unsigned.apk my-alias`
7. Using the zip align tool, which can be found `/path/to/Android/sdk/build-tools/VERSION/zipalign`, optimise the .apk `zipalign -v 4 android-release-unsigned.apk HelloWorld.apk`
8. Move the optimised .apk onto an Android device either with the use of a USB cable or Internet.
9. Install .apk (this requires you to allow installation of apps from 'Unknown Sources' in the phone's settings)

### Building for mobile devices - iOS
*This project has not been tested on iOS devices. Android recommended.*

For Ionic's documentation for deploying to a device, see: https://ionicframework.com/docs/intro/deploying/ 
