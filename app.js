
// Ading Elements===================================================

let input = document.querySelector("#input");
let searchBtn = document.querySelector("#search");
let apiKey = "a818778f-5691-49b7-abb5-40b4bcf29a9e";
let notFoundBox = document.querySelector(".not_found");
let output = document.querySelector(".output");
let audioBox = document.querySelector(".audio");
let loading = document.querySelector(".loading");
let resultWrapper = document.querySelector(".wrapper");
let resultHeading = document.createElement("h3");


// starting script===================================================


searchBtn.addEventListener("click", function (e) {
  e.preventDefault();

  // clear old data
  notFoundBox.innerHTML = "";
  output.innerText = "";
  audioBox.innerHTML = "";
  resultHeading.innerHTML = "";
  resultHeading.style.border = "none";

  let word = input.value;

  if (word === "") {
    return;
  }
  getData(word);
});

async function getData(word) {

  loading.style.display = "block";

  // AJAX call===================================================

  const response = await fetch(
    `https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apiKey}`
  );
  const data = await response.json();

  // If empty result===================================================

  if (!data.length) {
    loading.style.display = "none";
    notFoundBox.innerHTML = "<p>No Result Found</p>";

    return;
  }

  // if result in suggestions===================================================

  if (typeof data[0] === "string") {
    loading.style.display = "none";

    const heading = document.createElement("h2");
    heading.classList.add("heading");
    heading.innerText = "Did you mean?";
    notFoundBox.appendChild(heading);

    data.forEach((element) => {
      let suggestion = document.createElement("span");
      suggestion.classList.add("suggested");
      suggestion.innerText = element;
      notFoundBox.appendChild(suggestion);
    });
    return;
  }

  // if result was got===================================================

  let defination = data[0].shortdef[0];
  output.innerText = defination;

  let soundName = data[0].hwi.prs[0].sound.audio;
  loading.style.display = "none";
  

  if (defination.length >= 1) {
      resultWrapper.style.display = "block"
    resultHeading.innerHTML = '<i class="fas fa-angle-double-right"  style="margin-right: 10px;"></i>' +'"' + word + '"' + " Results Are Here";
    resultHeading.style.border = "";
    resultWrapper.insertAdjacentElement("afterbegin", resultHeading)
    input.value = "";
  }

  // sound script here===================================================

  if (soundName) {
    renderSound(soundName);
  }

  function renderSound(soundName) {
    let subFolder = soundName.charAt(0);
    let soundSrc = `https://media.merriam-webster.com/soundc11/${subFolder}/${soundName}.wav?key=${apiKey}`;

    let aud = document.createElement("audio");
    aud.src = soundSrc;
    aud.controls = true;
    let audioHeading = document.createElement("h3");
    audioHeading.innerHTML ='<i class="fas fa-volume-up" style="margin-right: 10px;"></i>'+'"' + word + '"' + " Audio Here";
    audioBox.appendChild(audioHeading);
    audioBox.appendChild(aud);
  }

}
