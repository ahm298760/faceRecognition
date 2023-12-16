const showPersons = document.getElementById('showPersons');
const personsList = document.getElementById('personsList');
const buttons = document.querySelectorAll('.but');
const video = document.getElementById('video');
const usingCam = document.getElementById('usingCam');
let webCamUisng = false;
const glasseCam = document.getElementById('glasse-cam');
let webGlasseCam = false;
const loading = document.getElementById('loading');
const loadingIcon = document.getElementById('loading-icon');

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
    faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
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

function loadLabeledImages() {
    const labels = ["Ahmed_Mohamed"/*, "Zaid_Mohamed", "Ahmed_Sameih"*/]
    return Promise.all(
      labels.map(async label => {
        const descriptions = []
        for (let i = 1; i <= 2; i++) {
          const img = await faceapi.fetchImage(`data/image/${label}/${i}.jpeg`)
          const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
          descriptions.push(detections.descriptor)
        }
  
        return new faceapi.LabeledFaceDescriptors(label, descriptions)
      })
    )
}
  









let personsName = "Ahmed Mohamed";
function callPersonName() {
    for(let i=0; i< persons.length;i++){
        if(persons[i].name == personsName){
            audio.src = persons[i].callFunction;
            audio.play();
        }
    }
}
