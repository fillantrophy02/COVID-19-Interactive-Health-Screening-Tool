const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly',
                'https://www.googleapis.com/auth/script.projects'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';
const LANGUAGES_PATH = 'languages.json'

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), [callAppsScript, templateGeneration]);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback[0](oAuth2Client);
    callback[1](oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback[0](oAuth2Client);
      callback[1](oAuth2Client);
    });
  });
}

var template_files = []
fs.readFile('appsscript.json', 'utf8', (err, content) => {
  if (err) throw err;
  template_files.push({
    name: 'appsscript',
    type: 'JSON',
    source: content,    
  })
})
// Retrieve data from the Covid-19 Translations spreadsheet and generate template in other lanugages
function templateGeneration(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: '1MJFKvrmAXp6G2J386UtdZJFfxtYjkl01fN0rzxdFo80',
    range: 'Masterlist',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const df = res.data.values;
    const questions = df.map(x => x[4]); // 4th column should be the list of questions

    const chosen_langs = ["Vietnamese", "Myanmar"] || df[0].slice(4); 

    // In case there was a language added/modified, generate list of available languages
    fs.writeFile('languages.json', JSON.stringify(df[0].slice(4), null, 2), (err) => {
            if (err) return console.error(err);
            console.log('List of languages available stored to', 'languages.json');
          });

    /* The content of template1.txt is to be pushed to App Scripts editor and executed as a google script. 
    The following code translates the original template to other languages by using regex to identify 
    question titles.*/ 
    fs.readFile('./templates/template1.txt', 'utf8', (err, tp) => {
      if (err) throw err;
      template_files.push({
        name: 'template1',
        type: 'SERVER_JS',
        source: tp,
        })
  
      var function_names = [`template1()`]
      for (var lang of chosen_langs){
        var tmp_template = tp;
        var array = [...tp.matchAll(/\"[^\"]+\"/g)];
        const lang_id = df[0].findIndex((element) => element == lang);         

        tmp_template = tmp_template.replace("Original", `Language: ${lang}`)
        tmp_template = tmp_template.replace('template1', `template1_${lang}`)
        tmp_template = tmp_template.replace('Covid Response Template', `Covid Response Template (${lang} translation`)
        for (var i=0; i<array.length; i++) {
          let original_q = array[i][0].slice(1,-1);
          let q_id = questions.findIndex((element) => element.includes(original_q));
          let translated_q = df[q_id][lang_id]
          if (original_q.includes('How many days')) { 
            translated_q = translated_q.split(' (')[0] // Remove the unnecessary comment for this specific question 
          }
          tmp_template = tmp_template.replace(original_q, `${original_q} / ${translated_q}`);
          if (!translated_q) {
            console.log(`Warning: \'${original_q}\' does not have a(n) ${lang} translation.`)
          }
        }
        // Add the translated template to the list of files to be pushed to the App Scripts editor
        template_files.push({
          name: `template1_${lang}`,
          type: 'SERVER_JS',
          source: tmp_template,
        })
        function_names.push(`template1_${lang}();`)
      }
      // Add function to create all the chosen templates
      template_files.push({
        name: 'main',
        type: 'SERVER_JS',
        source: `function main() {\n  ${function_names.join("\n  ")}\n}`,
      })
    });
  });
}

function callAppsScript(auth) {
  const script = google.script({version: 'v1', auth});
  script.projects.create({
    resource: {
      title: 'Covid Response Template Translations',
    },
  }, (err, res) => {
    if (err) return console.log(`The API create method returned an error: ${err}`);
    script.projects.updateContent({
      scriptId: res.data.scriptId,
      auth,
      resource: {
        files: template_files
      },
    }, {}, (err, res) => {
      if (err) return console.log(`The API updateContent method returned an error: ${err}`);
      console.log(`Link to project: https://script.google.com/d/${res.data.scriptId}/edit`);
    });
  });
}

module.exports = {
  SCOPES,
  templateGeneration,
  callAppsScript,
};