function template1() {
    var form = FormApp.create('Covid Response Template')
    Logger.log('Language: English')

    form.addTextItem()
        .setTitle("What's your name?")
    form.addTextItem()
        .setTitle("Which company are you employed under?")
    form.addTextItem()
        .setTitle("What is your supervisor's name and contact number?")
    form.addTextItem()
        .setTitle("In case of an emergency, who is the next-of-kin that I should contact? What is their contact number?")
    form.addTextItem()
        .setTitle("What is the name of the dorm you live in?")
    var item = form.addMultipleChoiceItem() // Set item to MultipleChoiceItem class for subsequent uses
                   .setTitle("Is it a covid-19 cluster? / Do you know if any infected patients are from your area?")
                   .setChoiceValues(['Yes','No'])
    form.addScaleItem()
        .setTitle("How many people are staying in the same room as you?")
        .setBounds(0,10)
    var item1 = form.addMultipleChoiceItem()
    
    var page2 = form.addPageBreakItem()
    form.addTextItem()
        .setTitle("Who? What is your relationship with them?")
    form.addTextItem()
        .setTitle("How many days ago did you meet them?")
    form.addDurationItem()
        .setTitle("How long were you with him/her?")
   
    var page3 = form.addPageBreakItem()
    form.addMultipleChoiceItem()
        .setTitle("In the last 14 days, did you travel out of Singapore? If yes, tell us the countries in English.")
        .setChoices([
            item.createChoice('No'),
         ])
        .showOtherOption(true)
    var item2 = form.addMultipleChoiceItem()
          
    var page4 = form.addPageBreakItem()    
    form.addTextItem()
        .setTitle("How many days?")
    form.addMultipleChoiceItem()
        .setTitle("Did you measure it with a thermometer? If you did, what was the highest reading?")
        .setChoices([
            item.createChoice('No'),
         ])    
        .showOtherOption(true)
    
    var page5 = form.addPageBreakItem()
    form.addMultipleChoiceItem()
        .setTitle("Runny nose?" + ' ' + "How many days?")
        .setChoices([
            item.createChoice('No'),
         ])    
        .showOtherOption(true)
    form.addMultipleChoiceItem()
        .setTitle("Cough?" + ' ' + "How many days?")
        .setChoices([
            item.createChoice('No'),
         ])    
        .showOtherOption(true)
    form.addMultipleChoiceItem()
        .setTitle("Difficulty breathing?" + ' ' + "How many days?")
        .setChoices([
            item.createChoice('No'),
         ])    
        .showOtherOption(true)
    form.addMultipleChoiceItem()
        .setTitle("Do you have diarrhea? How many times a day?")
        .setChoices([
            item.createChoice('No'),
         ])    
        .showOtherOption(true)    
    form.addMultipleChoiceItem()
        .setTitle("Anosmia (Loss of taste)" + ' ' + "How many days?")
        .setChoices([
            item.createChoice('No'),
         ])    
        .showOtherOption(true)
    form.addMultipleChoiceItem()
        .setTitle("Ageusia (Loss of smell)" + ' ' + "How many days?")
        .setChoices([
            item.createChoice('No'),
         ])    
        .showOtherOption(true)
    form.addMultipleChoiceItem()
        .setTitle("Rash?" + ' ' + "How many days?")
        .setChoices([
            item.createChoice('No'),
         ])    
        .showOtherOption(true)
    form.addMultipleChoiceItem()
        .setTitle("Any pain? Specifically, any chest pain?" + ' ' + "How many days?")
        .setChoices([
            item.createChoice('No'),
         ])    
        .showOtherOption(true)
    
    var page6 = form.addPageBreakItem()
    form.addCheckboxItem()
        .setTitle("Do you have any past medical history?")
        .setChoiceValues(["Asthma","Pneumonia","Hypertension","Hyperlipidemia","Diabetes","Heart problems","Kidney problems"])
        .showOtherOption(true)
    form.addMultipleChoiceItem()
        .setTitle("Do you have a drug allergy?")
        .setChoiceValues(['Yes','No'])
    form.addMultipleChoiceItem()
        .setTitle("Do you smoke? If yes, how many cigarettes a day?")
        .setChoices([
            item.createChoice('No'),
         ])
        .showOtherOption(true)         
    form.addMultipleChoiceItem()
        .setTitle("Do you drink? If yes, how much (number of bottles a week, type of alcohol)?")
        .setChoices([
            item.createChoice('No'),
         ])
        .showOtherOption(true)
    form.addTextItem()
        .setTitle("If you have any other problems, you can tell me in English.")    
  
    item1.setTitle("In the last 14 days, did you meet anyone who has coronavirus?")
         .setChoices([
            item1.createChoice('Yes', page2),
            item1.createChoice('No', page3),
         ])
    item2.setTitle("Do you have a fever?")
         .setChoices([
            item2.createChoice('Yes', page4),
            item2.createChoice('No', page5),
         ])
    
    Logger.log('Published URL: ' + form.getPublishedUrl())
    Logger.log('Editor URL: ' + form.getEditUrl())
}