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

#### Step 1: Create Your MongoDB Account and Database/Cluster

- Create your own MongoDB account by visiting the MongoDB website and signing up for a new account.

- Create a new database or cluster by following the instructions provided in the MongoDB documentation. Remember to note down the "Connect to your application URI" for the database, as you will need it later. Also, make sure to change `<password>` with your own password

- add your current IP address to the MongoDB database's IP whitelist to allow connections (this is needed whenever your ip changes)

#### Step 2: Edit the Environment File

- Check a file named .env in the /backend directory.

  This file will store environment variables for the project to run.

#### Step 3: Update MongoDB URI

In the .env file, find the line that reads:

`DATABASE="your-mongodb-uri"`

Replace "your-mongodb-uri" with the actual URI of your MongoDB database.

#### Step 4: Install Backend Dependencies

In your terminal, navigate to the /backend directory

```bash
cd backend
```

the urn the following command to install the backend dependencies:

```bash
npm install
```

This command will install all the required packages specified in the package.json file.

#### Step 5: Run Setup Script

While still in the /backend directory of the project, execute the following command to run the setup script:

```bash
npm run setup
```

This setup script may perform necessary database migrations or any other initialization tasks required for the project.

#### Step 6: Run the Backend Server

In the same terminal, run the following command to start the backend server:

```bash
npm run dev
```

This command will start the backend server, and it will listen for incoming requests.
