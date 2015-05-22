// Write your package code here!

var plantsArray = [
  [
    "Savory","Summer","Satureja hortensis","annual","after last frost","10 - 15 days","6 seeds x 6\" - 12\""],
    ["Kale","Dwarf Blue Curled","Braccica oleracea (Acephala)","55 days","early spring / late summer","5 - 10 days","4 seeds x 10\""],
    ["Cucumber","Baby Persian","Cucumis sativus","48 days","after last frost","5 - 10 days","1'"],
    ["Thyme","English","Thymus vulgaris","perennial","after last frost","10 - 15 days","5 seeds x 10\""],
    ["Shiso","Green and Red","Perilla frutescens","annual","after last frost","5 - 15 days","5 seeds x 12\""],
    ["Leek","American Flag","Allium ampeloprasum","120 days","spring or late summer","7 - 14 days","4 seeds x 4\""],
    ["Cherry Tomato","Rainbow Blend","Lycopersicon lycopersicum","65 days","after last frost","5 - 10 days","3 seeds x 24\""],
    ["Chamomile","German","Matricaria recitita","annual","early spring","10 - 15 days","3 seeds x 6\""],
    ["Chile Pepper","Ancho/Poblano","Capsicum annum","80 days","after last frost","10 - 25 days",""],
    ["Lovage","","Levisticum official ","perennial","spring or fall","10 - 20 days","6 seeds x 3'"],
    ["Moonflower","","Ipomoea alba","annual","","10 - 20 days","4 seeds x 6\""],
    ["Purslane","Golden","Portulaca oleracea sativa","annual","after last frost","5 - 10 days","6\""],
    ["Pepper","Pepperoncini","Capsicum annum","65 days","after last frost","10 - 25 days",""],
    ["Cress","Upland","Barbarea verna","","before last frost","5 - 15 days","3 seeds x 4\""],
    ["Pepper","Ancho/Poblano ","Capsicum annum ","80 day","after last frost","10 - 25 days",""],
    ["Cucumber","Marketmore ","Cucumis sativus","60 days","after last frost ","5 - 10 days","6 seeds per mound"
  ]
]


Meteor.startup(function(){
  if(Plants.find().count() == 0){
    plantsArray.forEach(function(plant){
      var newPlant = {
        commonName: plant[0],
        variety: plant[1],
        latinName: plant[2],
        growCycle: {
          duration: plant[3],
          germination: plant[5]
        },
        whenToPlant: plant[4],
        spacing: plant[6]
      }
      Plants.insert(newPlant);
    });
  }
});
