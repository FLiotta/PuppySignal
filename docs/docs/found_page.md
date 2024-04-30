---
sidebar_position: 5
---

# Found Page

The found page is basically the website where people is redirected when they scan our pet's codes, this site calls the backend to validate if given code exists, and displays pet's information, followed by its owners, also calls the backend to store the location if so the user wants.

## Requirements

- Node 21.7.1
- Yarn 1.22.19

## Installation

### Cloning the repository

First thing we need to do before starting to configurate our project is to clone the repository, for that we will open a terminal and run the following commands.

```
$ git clone git@github.com:PuppySignal/found-webapp.git
$ cd found-webapp
```

### Install the dependencies

Once inside the project's folder, we will continue to install its dependencies

```
$ yarn
```

### Set the environment variables

As described in the `.env.template` file, there's only one environment variable we need to set, and this is the backend api's path.

```
VITE_API_BASE_PATH=... (most of the time it would be http://localhost:8000/api/v2)
```

### Run the project

```
$ yarn run dev
```
