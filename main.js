const timeframes = document.getElementsByClassName("timeframe");
for(let i = 0; i < timeframes.length; i++) {
    timeframes[i].addEventListener("click", (e) => {
        //deselect all other timeframes
        for(let j = 0; j < timeframes.length; j++) {
            timeframes[j].classList.remove("selected-time-frame");
        }

        //select the clicked timeframe
        e.currentTarget.classList.toggle("selected-time-frame");

        redraw();
    });
}

//initially select the daily timeframe
const daily = document.getElementById("daily");
daily.classList.toggle("selected-time-frame")


let json = [];
//Load json from local file
async function loadJsonLocal(file) {
    json = JSON.parse(await file.text());
    buildHtmlFromJson();
}

//Fetch json file
async function loadJson() {
    const jsonObject = await fetch("./data.json");
    json = await jsonObject.json();
    buildHtmlFromJson();
}
// loadJson();

function buildHtmlFromJson() {
    const selectedTimeFrame = document.getElementsByClassName("selected-time-frame")[0].id;
    console.log(selectedTimeFrame);

    const main = document.getElementById("main");

    for (let i = 0; i < json.length; i++) {
        console.log(json[i]);

        const section = document.createElement("section");
        section.className = "stat-tile";
        section.id = json[i].title.toLowerCase().replace(' ', '-');

        const contentContainer = document.createElement("div");
        contentContainer.className = "stat-content";

        /* Tile Header */
        const tileHeader = document.createElement("div");
        tileHeader.className = "tile-header";

        const tileTitle = document.createElement("h2");
        tileTitle.className = "tile-title";
        tileTitle.innerHTML = json[i].title;

        const tileMoreButton = document.createElement("button");
        tileMoreButton.className = "btn-more";
        const tileMoreButtonImg = document.createElement("img");
        tileMoreButtonImg.src = "./images/icon-ellipsis.svg";
        tileMoreButtonImg.alt = "more options";
        tileMoreButton.appendChild(tileMoreButtonImg);

        tileHeader.appendChild(tileTitle);
        tileHeader.appendChild(tileMoreButton);

        /* Tile Content */
        const tileMain = document.createElement("div");
        tileMain.className = "tile-main";

        const time = document.createElement("div");
        time.className = "time";
        time.innerHTML = `${json[i].timeframes[selectedTimeFrame].current}hrs`;

        const lastWeek = document.createElement("div");
        lastWeek.className = "last-week";
        lastWeek.innerHTML = `Last Week - ${json[i].timeframes[selectedTimeFrame].previous}hrs`;

        /* append section to grid */
        tileMain.appendChild(time);
        tileMain.appendChild(lastWeek);
        
        contentContainer.appendChild(tileHeader);
        contentContainer.appendChild(tileMain);
        section.appendChild(contentContainer);

        main.appendChild(section);
    }    
}

let sections;
function redraw() {
    const selectedTimeFrame = document.getElementsByClassName("selected-time-frame")[0].id;
    console.log(selectedTimeFrame);

    if(!sections) {
        sections = document.getElementsByClassName("stat-tile");
    }

    for (let i = 0; i < sections.length; i++) {
        let sectionId = sections[i].id.replace('-', ' ');
        let s = sections[i].firstElementChild;
        let time;
        let lastWeek;

        //Get the child elements we need to update (current time and last week's time)
        for (let j = 0; j < s.children.length; j++) {
            if(s.children[j].className === "tile-main") {
                time = s.children[j].firstElementChild;
                lastWeek = s.children[j].lastElementChild;
            }
        }
        
        //find data for current section and update it
        for (let j = 0; j < json.length; j++) {
            if (json[j].title.toLowerCase() === sectionId) {
                
                time.innerHTML = `${json[j].timeframes[selectedTimeFrame].current}hrs`;
                lastWeek.innerHTML = `Last Week - ${json[j].timeframes[selectedTimeFrame].previous}hrs`

            }
        }
    }

}
