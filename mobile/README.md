# Mobile

This is the mobile application for puppysignal, built with react native, it works as a cross-platform solution for IOS and Android.

> [!NOTE]  
> Application was only tested with android, IOS performance was not tested properly given I don't have the necessary tools for it.

## Requirements

The requirements to install the applications are the same as the react native guide (https://reactnative.dev/docs/environment-setup)

- Android Studio Iguana | 2023.2.1
- Node 21.7.1
- NPM 10.5.0

## Install

1 - Install the packages

`npm install`

2 - Configure firebase

The mobile application depends on firebase for google authentication and messaging, prior to this step, we should go to firebase, create a project, add these products and download the `google-services.json` generated for us.

Once we already setted our firebase project and have our google-services.json, store it on `[PROJECT]/android/app/google-services.json`

3 - Generate a Google Maps Key

Follow the next guide to generate an api key to consume google maps services https://developers.google.com/maps/documentation/javascript/get-api-key

4 - Set environments variables

Assuming you already generated the needed keys for the different services, setted up your firebase project, and have the [backend](https://www.github.com/puppysignal/backend) project up and running, 
we need to create the .env.development file at the base path of our project:

[PROJECT]/.env.development
```sh
# Packages configuration
# @GOOGLE_MAPS_API_KEY (https://developers.google.com/maps/documentation/javascript/get-api-key)
# @GOOGLE_SIGN_IN_WEB_CLIENT_ID (https://stackoverflow.com/questions/50507877/where-do-i-get-the-web-client-secret-in-firebase-google-login-for-android)
GOOGLE_MAPS_API_KEY= INSERT HERE THE API KEY GENERATED ON STEP 3
GOOGLE_SIGN_IN_WEB_CLIENT_ID= INSERT HERE THE WEBCLIENT ID GENERATED IN FIRBASE IN THE STEP 2

# Project (services, api keys, etc...)
# @API_URL must be backend's api url (puppysignal/backend) [http://localhost:8000/api/v2]
# @FOUND_QR_PATH must be found web-app (puppysignal/found-webapp) [http://localhost:4000?qr=]
API_URL=
FOUND_QR_PATH=
```

5 - Run the project

Once everything is configured, we will run the next command to start our project in development mode (remember to have the android emulator open)

`npm run android:dev`

## Troubleshoot

- FETCH_ERROR - Network request failed]
  1. Remember to forward requests to your localhost: `adb forward tcp:8000 tcp:8000`
  2. Check API_URL is correct, it has to end with an "/": `http://…/api/v2/`

