# COVID-19 Interactive Health Screening Tool

This project generates annotated google response forms based on the
questions and translations available at
[TranslateForSG](https://translatefor.sg/). A sample template is
available.

#### The complete step-by-step guide:
1. Visit [Google APIs &
   Services](https://console.developers.google.com/apis/credentials).
   Click "Create Credentials" and select "OAuth client ID". Select
   Desktop App for Application Type.
2. After creating the OAuth client ID, download the json file to the
   local project and rename it credentials.json
3. Run `node main.js`. You will be asked to enable Google Sheet API
   and Google App Scripts API as well as authorize Quickstart. Follow
   the instructions on the console.
4. Visit the link to the project. Run `main` to generate the desired
   templates.

#### [9/6/2020] Added clasp-support branch:
1. Visit [Node.js Quickstart](https://developers.google.com/apps-script/api/quickstart/nodejs) and enable Google Apps Script API. After creating the OAuth client ID, download the client configuration as credentials.json to local folder.
2. Visit [Apps Script Settings](https://script.google.com/home/usersettings) and enable Google Apps Script API
1. Run `clasp login` to login globally.
3. Run `clasp create {project-name}` and create a standalone script.
4. Run `clasp login --creds credentials.json` to login locally. Visit [Google Cloud Platform](https://console.cloud.google.com/home/dashboard) to retrieve the GCP project ID. Note the GCP project number.
5. Run `clasp open`. Go to *Resource > Cloud Platform Project > Change Project* and enter the GCP project number. Click *Set Project.
6. Run `clasp push`. Type 'Y' when asked if manifest file should be overwritten. 
7. Run `clasp run main`. Your google forms should have been created in your google drive even when there is no response.
