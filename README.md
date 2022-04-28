# React + NodeJS Example

This is a simple example of an implementation of the /send and /verify API's from EZiD, using React and NodeJS. 

## Installation

### 1: Get API Keys
Head over to [app.ezid.io](https://app.ezid.io) to get your API keys. You will need these to call the EZiD API's in step 5.

### 2: Clone
To run this example, first, open a terminal and clone this repository onto your computer. You can do this with ```git clone```. 

### 3: Install Node
Open a terminal on your computer, and run ```brew install node```. Feel free to skip this step if you have already installed node, or prefer to use yarn

### 4: Install the client and server
Once you have cloned the repository, navigate to the 'client' folder. Then, run ```npm install``` in your terminal (or ```yarn start``` if you are using yarn)

Next, navigate to the 'server' folder. Then, run ```npm install``` again. 

### 5: Configure your .env file
In the ```.env``` file in the server directory, add the ```client_id``` and ```client_secret``` keys that you generated in step 1 under the predefined headers. This will ensure that your keys are used in each call to EZiD's API's. Note that they are currently just defined as empty strings in the provided ```.env``` file in the server directory. This must be updated with your own keys in order for the app to function

### 6: Configure your email branding at [app.ezid.io](https://app.ezid.io)
Set your app name and URL under the 'email branding' header 

### 7: Start the server and client
To start the application, first, navigate to the 'server' folder and run ```npm start```. A message should appear in your terminal indicating that the server is running on a port. Then, navigate to the 'client' folder and run ```npm start```. 

That's all! The application should open in a new browser tab. Note that you can configure the callback URL's in the request itself! This is the URL that the user will be redirected to once the verification is successful.

## License
[MIT](https://choosealicense.com/licenses/mit/)


