# ForReal

ForReal is a cloud-enabled and machine learning-supported real estate prediction system.

### File
1. web_server.js
2. folder<public>
--index.html
--function.js
--avg_per.csv
--style.css
--update.json
--project.py
--kc_house_data.csv
--date_origin.csv
--prediction_sample.csv


### Installation

ForReal requires [Node.js](https://nodejs.org/), [MongDB](https://www.mongodb.com/download-center#enterprise) to run. We also need to install Express and Body-Parser. Meanwhile, python 2.7, pandas and xgboost package is needed.

Install the dependencies and devDependencies and start the server.

```sh
$ cd app
$ npm install mongodb -g
$ npm install Express
$ npm install Body-Parser
$ node web_server.js
```

Derive the data from model training

```sh
$ cd <path-public>
$ python project.py
```

Import the JSON to the Database

```sh
$ cd <path-to-mongo-bin>
$ ./mongod
$ ./mongoimport --db mydb --collection customers --file updated.jso>
```

run the web server
```sh
$ cd app
$ node web_server.js
```

Then go to the browser and type in "localhost:8000".

