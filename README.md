## Getting started

### Frontend
#### If you have `auto_build.sh`
  ```bash
  ./auto_build.sh
  ```
This command will build everything you need automatically. If you want to start the frontend server, please run the following command:
```bash
npm run dev
```

#### If you don't have `auto_build.sh`
1. Clone the repository
   ```bash
   git clone https://github.com/RinRainbow/Lab.git
   ```
   
2. Install nvm command and setting node(v20.10.0)
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
   ```
   To verify that nvm has been installed, do:
   ```bash
   command -v nvm
   ```
   which should output nvm if the installation was successful.
   
   To download, compile, and install a specific version of node(v20.10.0), do this:
   ```bash
   nvm install 20.10.0
   nvm use 20.10.0
   ```
   
   ⚠️ If you have any questions, please refer this: https://github.com/nvm-sh/nvm
   
3. Install npm dependencies
   ```bash
   cd frontend
   npm install
   ```
4. Run the Frontend Server
   ```bash
   npm run dev
   ```
   This command will start the frontend server, and you'll be able to access the website on localhost:3000 in your web browser.

🚨 Please refer idurar-epr-crm(https://github.com/idurar/idurar-erp-crm).

---

### Backend

#### Step 1:  Download and Install MongoDB Locally  
1. **Download MongoDB**:  
   - Visit the [MongoDB Download Center](https://www.mongodb.com/try/download/community) and download the latest version of MongoDB Community Server for your operating system.

2. **Install MongoDB**:  
   - Follow the installation instructions for your specific operating system:  
     - **Windows**: Use the installer and select the "Complete" installation option. Make sure to check the option to install MongoDB as a service.  
     - **macOS**: Use `brew install mongodb-community` if Homebrew is installed, or follow the manual installation steps from the MongoDB website.  
     - **Linux**: Add the MongoDB repository, update your package list, and install MongoDB using your package manager (e.g., `apt install mongodb` for Debian/Ubuntu).  

3. **Start MongoDB**:  
   - After installation, start the MongoDB server:  
     - **Windows**: Open the Services app and start the MongoDB service.  
     - **macOS/Linux**: Run `mongod` in the terminal.  


#### Step 2: Configure MongoDB
1. **Set the Data Directory**:  
   - By default, MongoDB stores data in `/data/db`. Ensure this directory exists and has the necessary permissions. You can specify a different path using the `--dbpath` option when starting `mongod`.

2. **Check the Connection**:  
   - Open a new terminal or command prompt and run `mongo` to connect to your local MongoDB server.


#### Step 3: Create a Local Database
1. Once connected to MongoDB through the `mongo` shell, you can create a database by switching to it:  
   ```bash
   use myLocalDatabase
   ```
   This command creates and switches to a database named `myLocalDatabase`.

2. Add some data to test the setup:  
   ```bash
   db.myCollection.insertOne({ name: "Test", value: 123 });
   ```

3. Verify the data was added:  
   ```bash
   db.myCollection.find();
   ```

Now you have MongoDB running locally and a database ready for use. No need for IP whitelisting or external URIs!

#### Step 4: Edit the Environment File

- Check a file named .env in the /backend directory.

  This file will store environment variables for the project to run.

#### Step 5: Update MongoDB URI

In the .env file, find the line that reads:

`DATABASE="your-mongodb-uri"`

Replace "your-mongodb-uri" with the actual URI of your MongoDB database.

#### Step 6: Install Backend Dependencies

In your terminal, navigate to the /backend directory

```bash
cd backend
```

the urn the following command to install the backend dependencies:

```bash
npm install
```

This command will install all the required packages specified in the package.json file.

#### Step 7: Run Setup Script

While still in the /backend directory of the project, execute the following command to run the setup script:

```bash
npm run setup
```

This setup script may perform necessary database migrations or any other initialization tasks required for the project.

#### Step 8: Run the Backend Server

In the same terminal, run the following command to start the backend server:

```bash
npm run dev
```

This command will start the backend server, and it will listen for incoming requests.
