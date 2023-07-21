# Stackclique-

A tech Community Project

This is the backend API for the Stackclique mobile application.

---

Installation and Test of the API

download the Backend branch of this repo as zip file, extract it into a folder and run the following scripts on you terminal in this order

create a .env file on the root of your folder and add the following environment variables to the .env file

```env
PORT=500
DATABASE_URL="file:./db.sqlite"
DEV_ENV=true
HASH_SECRET= # any random hash string
NODEMAILER_USER= # your email
NODEMAILER_PASSWORD= # your email password
NODEMAILER_HOST= # your email host
```

```cmd
npm install
npx prisma migrate dev
npm run start

```

then visit `http://localhost:3000/dev/api-docs` to see the `swagger` API documentation.

more endpoints are comming
