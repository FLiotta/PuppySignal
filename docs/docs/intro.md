---
sidebar_position: 1
slug: /
---

# PuppySignal

The idea behind Puppysignal is to have a way to keep track of our pets through the use of QR Codes. We live in a time where we change phone numbers and relocate from our homes very often, and normal pet tags cannot keep on track with that, while a QR Tag whom opens a website and requests a server can.

When we create a profile for our pets on our accounts, a small code will be generated and associated to them, and a QR code will be available for printing. When someone scan this code, the person will have the contact information we provide to get in contact with us, and at the same time, we will receive a push notification with the location of where our pet was scanned (in case the person wanted to share it).

### Project structure

The project is divided in a few repositories, such as the backend, the mobile application, and the web-app.

- [Backend](https://github.com/FLiotta/PuppySignal/tree/master/backend): The backend is the one in charge of handling the logic, authentication, tracking, image procesing, etc.
- [Mobile](https://github.com/FLiotta/PuppySignal/tree/master/mobile): As the name suggest, is where the mobile application is stored, here is where we manage our accounts, create pets, receive notifications, check the locations, etc.
- [Found Page](https://github.com/FLiotta/PuppySignal/tree/master/found-webapp): Is the website where the person who scans the code is taken and receives the information about the pet who had just scanned.
