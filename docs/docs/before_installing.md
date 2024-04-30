---
sidebar_position: 2
---

# Before installing

The projects (mobile & backend) depends on firebase for two core functionabilities, these are messagings and authentication. Also mobile depends on Google Maps, as the map we use to list all the locations.

-   **Firebase Messaging:** Is the one in charge to receive the push notifications on our phone when someone scans our pet's codes and/or share its location.
-   **Firebase Authentication:** Google authentication is the only implemented strategy at the moment, therefore we will need this service on our firebase project
-   **Google Maps:** We need Google maps as our map provider, we'll use it on our pet's profile to list all its locations.

Before you decide to continue the installation of the rest of the project, I invite you to **first clone the repositories (specially the mobile one)**, and set a firebase project, given you will use it later on.

## Firebase
### Creating the firebase project

First thing we'll need to do is to create a project, for that just go to firebase's console and click on `Create a project`.

### Adding the authentication product

We will look for the Authentication product and add it to our project, we will select the Google Authentication strategy, enable it, and save it.
