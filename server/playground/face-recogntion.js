const fr = require('face-recognition');
const recongizer = fr.FaceRecognizer();

//Add faces in dataset to train_and_test
var train_data = (faces)=> {
   faces.forEach(element => {
       var img_path = element.img;
       var image = fr.loadImage(`./${img_path}`);
       var images = [image];
       recongizer.addFaces(images,element.name)
   });
}

//predicting results
var prdeict_results = (search_image)=> {
  const prderctions = recongizer.predict(search_image);
   console.log("predictions",prderctions);
  const acc_predictions = prderctions.filter((p) => {return p.distance < 0.3});
   console.log("accurate predictions",acc_predictions);
  
    return acc_predictions;
}

module.exports = {
    train_data:train_data,
    prdeict_results:prdeict_results
}