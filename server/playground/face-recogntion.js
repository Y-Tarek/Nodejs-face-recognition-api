const fr = require('face-recognition');
const recongizer = fr.FaceRecognizer();
const os = require('os');

//Add faces in dataset to train_and_test
var add_faces = (faces)=> {
   faces.forEach(element => {
       var img_path = element.img;
       var image = fr.loadImage(os.platform() == 'win32' ? `../${img_path}` : `./${img_path}`);
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
    add_faces:add_faces,
    prdeict_results:prdeict_results
}