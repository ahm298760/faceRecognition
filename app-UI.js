const showPersons = document.getElementById('showPersons');
const personsList = document.getElementById('personsList');
const buttons = document.querySelectorAll('.but');
const camVideo = document.getElementById('video');

buttons.forEach(element => {
    element.addEventListener('click', selectDriver)
});
function selectDriver() {
    for(let i=0;i< buttons.length; i++){
        buttons[i].classList.remove('active')
    }
    this.classList.add('active')
    camVideo.style.display = 'block';
}

function addPersons() {
    for(let i = 0; i < persons.length; i++){
        personsList.innerHTML +=`
        <div class="list">
            <img class="app-them" src="${persons[i].Img}" alt="Ahmed">
            <h2>${persons[i].name}</h2>
        </div>
        `;
        
    }

}
addPersons();

showPersons.addEventListener('click', () => {
    personsList.style.height = "100%";
})

function closePersonsList(){
    personsList.style.height = "0";
}
let myRe = new XMLHttpRequest();
myRe.open("GET", "https://api.github.com/users/elzerowebschool/repos");
myRe.send();
console.log(myRe);