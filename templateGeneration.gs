function templatesGeneration() {
  var ss = SpreadsheetApp.openById('1MJFKvrmAXp6G2J386UtdZJFfxtYjkl01fN0rzxdFo80')
  var sh = ss.getSheetByName('Masterlist')
  const df = sh.getDataRange().getValues()

  const chosen_langs = ["Vietnamese"] || df[0].slice(4); 
  const avoid_words = ['Yes', 'No', ' ', 'Published URL: ', 'Editor URL: ', "What is your supervisor's name and contact number?", "How many days?"]

  /* The following code translates the original template to other languages by using regex to identify 
question titles.*/ 
  var tp = template1.toString()
  tp = tp.slice(tp.indexOf('form.addTextItem()'), -2)
  var templates = []

  for (var lang_num in chosen_langs){
    var lang_id = sh.createTextFinder(chosen_langs[lang_num]).findNext().getA1Notation().match(/[a-zA-Z]+/g)[0]
    var tmp_template = tp
        
    // Search for questions written in the template
    var q_regex = /\"[^\"]+\"/g
    var qs_included = tmp_template.match(q_regex, 'g')
    var unique = {}
    qs_included.forEach(function(i) {
      if(!unique[i]) {
        unique[i] = true
      }
    })
    qs_included = Object.keys(unique)
    
    // Naming the google form
    tmp_template = "Logger.log('Language: " + chosen_langs[lang_num] + "') \n " + tmp_template
    tmp_template = " var form = FormApp.create('Covid Response Template (" + chosen_langs[lang_num] + ")') \n " + tmp_template
    
    // Manual fix
    var q = "What is your supervisor's name and contact number?"
    tmp_template = tmp_template.replace(q, q + ' / ' + sh.getRange(lang_id+'6').getValue())
    var q = "How many days?"
    tmp_template = tmp_template.split(q).join(q + ' / ' + sh.getRange(lang_id+'17').getValue()) 
    
    // Automatic translation        
    for (var q_num in qs_included){
      q_included = qs_included[q_num].slice(1,-1).toString()
          
      if (!(avoid_words.indexOf(q_included)+1)){
        var q_range = sh.createTextFinder(q_included).findNext()
        if (q_range){
          q_row = q_range.getA1Notation().match(/\d+/g)[0]
          q_translated = sh.getRange(lang_id + q_row).getValue().trim()
          tmp_template = tmp_template.replace(q_included, q_included + ' / ' + q_translated)              
        } else {
          Logger.log("Warning: '" + q_included + "' does not have a(n) " + chosen_langs[lang_num] + " translation.")
        }
      }
    }    
    templates.push(tmp_template)
  }
  return templates
} 