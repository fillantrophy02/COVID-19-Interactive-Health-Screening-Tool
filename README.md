*Covid Response Template Translations*

This project generates annotated google response forms based on the questions and translations available at [TranslateForSG](https://translatefor.sg/). A sample template is available. 

The complete step-by-step guide:
1. Visit [Google APIs & Services](https://console.developers.google.com/apis/credentials?project=silicon-pattern-270501). Click Create Credentials and select OAuth client ID. Select Desktop App for Application Type. 
2. After creating the OAuth client ID, download the json file to the local project and rename it credentials.json
3. Run `node main.js`. You will be asked to enable Google Sheet API and Google App Scripts API as well as authorize Quickstart. Follow the instructions on the console.
4. Visit the link to the project. Run `main` to generate the desired templates.
