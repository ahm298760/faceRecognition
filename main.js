const showPersons = document.getElementById('showPersons');
const personsList = document.getElementById('personsList');
const buttons = document.querySelectorAll('.but');
const videoArr = document.getElementById('video');
const videoScreen = document.getElementById('screen');
const usingCam = document.getElementById('usingCam');
let webCamUisng = false;
const glasseCam = document.getElementById('glasse-cam');
let webGlasseCam = false;
const loading = document.getElementById('loading');
const loadingIcon = document.getElementById('loading-icon');
const audioBox = document.getElementById('audio-box');


buttons.forEach(element => {
    element.addEventListener('click', selectDriver)
});
function selectDriver() {
    for(let i=0;i< buttons.length; i++){
        buttons[i].classList.remove('active')
    }
    this.classList.add('active')
}



for(let i =0; i < 12; i++){
    let addDiv = document.createElement('div');
    addDiv.style.transform = `rotate(${30*i}deg)`;
    addDiv.style.animationDelay = 100 + 100*i +'ms';
    loadingIcon.appendChild(addDiv);
}

for(let i = 0; i < persons.length; i++){
    personsList.innerHTML +=`
    <div class="list">
        <img class="app-them" src="${persons[i].Img}" alt="Ahmed">
        <h2>${persons[i].name}</h2>
    </div>
    `;            
}

usingCam.addEventListener('click', () => {
    if(webCamUisng == false) {
        startWebcam();
        webCamUisng = true;
        webGlasseCam = false;
        video.style.display = 'block';
    }
});

showPersons.addEventListener('click', () => {
    personsList.style.height = "100%";
})

function closePersonsList(){
    personsList.style.height = "0";
}

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
  ]).then(() => {loading.style.display = 'none';});
  

function startWebcam() {
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
    })
    .then((stream) => {
    video.srcObject = stream;
    })
    .catch((error) => {
    console.error(error);
    });
}

function getLabeledFaceDescriptions() {
    const labels = [/*"Ahmed_Mohamed", "Zaid_Mohamed",*/ "Hazem_Mohamed"];
    return Promise.all(
      labels.map(async (label) => {
        const descriptions = [];
        for (let i = 1; i <= 2; i++) {
          const img = await faceapi.fetchImage(`./data/image/${label}/${i}.jpg`);
          const detections = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();
          descriptions.push(detections.descriptor);
        }
        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      })
    );
  }
    
let personsName;

video.addEventListener('play', async () => {
    const labeledFaceDescriptors = await getLabeledFaceDescriptions();
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);





    const canvas = faceapi.createCanvasFromMedia(video);
    videoScreen.append(canvas);
    const displaySize = { width: video.width, height: video.height};
    faceapi.matchDimensions(canvas, displaySize);
    setInterval(async ()=>{
///////////////////////////////////////////////////////////////////////////////////
        const detections = await faceapi
            .detectAllFaces(video)
            .withFaceLandmarks()
            .withFaceDescriptors();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
        const detectionsBox = await faceapi.detectAllFaces(
            video,
            new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks().withFaceExpressions()
        const resizeDetections = faceapi.resizeResults(detectionsBox, displaySize);
        canvas.getContext('2d').clearRect(0,0, canvas.width, canvas.height);

        faceapi.draw.drawDetections(canvas, resizeDetections);
        ///////////////////////////////////////////////////////////////////////////////////
        const results = resizedDetections.map((d) => {
            return faceMatcher.findBestMatch(d.descriptor);
          });
          results.forEach((result, i) => {
            const box = resizedDetections[i].detection.box;
            // const drawBox = new faceapi.draw.DrawBox(box, {
            //   label: result,
            console.log(result.label);
            // if(result.label !== 'unknown') {}
            if(personsName !== result.label){
                audioBox.innerHTML = `<audio src="data/sounds/${result.label}.mp3" autoplay></audio> `;
                personsName = result.label;
            }
            
            // const sounds = `data/sounds/${result}.mp3`;
            });
    },500);
    setInterval(()=> {personsName = "";},5000);
})





function callPersonName() {
    for(let i=0; i< persons.length;i++){
        if(persons[i].name == personsName){
            audio.src = persons[i].callFunction;
            audio.play();
        }
    }
}

// document.body.innerHTML += `<audio src="data/sounds/Ahmed_Mohamed.mp3" autoplay></audio>`;
