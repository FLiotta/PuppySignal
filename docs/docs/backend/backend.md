---
sidebar_position: 4
---

# Backend

### Requirements

- Python >=3.8
- Redis
- PostgreSQL
- Docker

### Create an S3 Bucket
Pet's photos are stored on an S3 Bucket, project uses boto3 for it, so you could go ahead with another boto3-supported alternative if you prefeer, but maybe it'd require a bit more of configuration from your side.

[Create S3 Bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/creating-bucket.html)

### Firebase
In the [Before installing](./before_installing#creating-the-firebase-project) section, we created a firebase project that would be used later on this guide.

We will go to our firebase console, get into the project settings, click on Firebase Admin SDK and **Generate a new private key** (firebase > project settings > generate new private key).

It will be saved on the project root path under the name `firebase_admin_key.json` (/backend/firebase_admin_key.json)

## Installation

### Cloning the repository

First thing we need to do before starting to configurate our project is to clone the repository, for that we will open a terminal and run the following commands.

```
$ git clone git@github.com:PuppySignal/backend.git
$ cd Backend
```

### Set the environment variables
Create an .env file at project root using `.env.template` and set the next environment variables

```
# JSON WEB TOKEN Variable
JWT_SECRET=Can be any passphrase for our JWT Tokens

# S3 Bucket variables
aws_application_key_id=
aws_application_key=
s3_bucket=
```

*Database and redis related variables won't be setted on this case, given we are just preparing the backend for a development environment, and these variables are default setted on docker-compose.yml*

### Starting docker

Inside the project directory, we will run the docker image to bootstrap our entire project without extra configurations.

```
$ docker-compose build
$ docker-compose up -d
```

and that's it, check on your docker daemon everything is working fine, backend should be up at port `8000`