let courseSection = document.querySelector('#course_section');
let courseTemplate = document.querySelector('#course__template');
let Details = document.querySelector('.details');

// Checking user IP Address
$.ajax({
    url:'https://api.ipify.org?format=jsonp&callback=getIP',
    dataType: 'jsonp',
    success: function(json) {
        console.log("test");
    }
})

currency = "";

function getIP(json) {
    console.log(json.ip);
    var ip = json.ip;
    var access_key = '48ed23404544e674ec78b8fa27359b39';
    // get the API result via jQuery.ajax
    $.ajax({
        url: 'http://api.ipstack.com/' + ip + '?access_key=' + access_key,
        dataType: 'jsonp',
        success: function(json) {

            // Get continent based on IP Address
            console.log(json);
            if(json.continent_code == "EU"){
                // assign value to currency if inside EU
                currency = "EU";
                displayCurrency(currency);
                return currency;
            } else if (json.continent_code != "EU") {
                // assign value to currency if outside EU
                currency = "US";
                displayCurrency(currency);
                return currency;
            }
        }
    });
}   

// Call the function to assign currency.
// I created this to test the global variable.
function displayCurrency(currency) {
    console.log("the currency is " + currency);
}


// Call the courses to be displayed.
getCourses()
// Async Function to access API and display data on screen.
async function getCourses() {
    const coursesStream = await fetch("https://private-e05942-courses22.apiary-mock.com/courses");
    const courses = await coursesStream.json();

    console.log(courses)

    let i = 0;

    courses.forEach(course => {
        i++;
        if(i < 10) {
            
            slug = course.slug;
            const title = course.title;
            const date = course.next_start;
            const dateWritten = course.next_start_formatted;

            const newCourse = document.importNode(courseTemplate.content, true);

            const courseTitle = newCourse.querySelector('.course__title');
            const courseSubtitle = newCourse.querySelector('.sub__title');
            const courseStart = newCourse.querySelector('.start__date');
            const moreInfo =  newCourse.querySelector('.more_info');
            const moreDetails = newCourse.querySelector('.starting-dates');

            courseTitle.innerText = title;
            courseSubtitle.innerText = slug;
            moreDetails.className = slug;
            courseStart.innerText = dateWritten;
            moreInfo.innerHTML = "<button onClick=getInfo('"+ slug +"') class='button is-primary'>View Details</button>"
            courseSection.appendChild(newCourse);

        }
    });

}

// Function called after clicking on More info Button to display courses data.
async function getInfo(slug) {

    let newUrl = "https://private-e05942-courses22.apiary-mock.com/courses/";
    
    const detailCourse = await fetch(newUrl + slug);
    const details = await detailCourse.json();

    // console.log(details);

    const courseDesc = details.description;
    // Check for currency
    if(currency == "EU") {
        price = details.prices[1];
    } else {
        price = details.prices[0];
    }

    // Add starting Dates in separated divs
    // console.log(slug);

    var datesContainer = document.querySelector('.' + slug);
    datesContainer.innerHTML = "";

        for(var i=0; i < details.start_dates.length; i++){
            dateStart = details.start_dates[i];
            // Converting Date
            dateStart = dateStart.split('-').map(e => e[0] == '0' ? e.slice(1) : e);
            dateStart = dateStart[1] + '/' + dateStart[2] + '/' + dateStart[0];
            divDate = document.createElement('span');
            divDate.className = "dates";
            divDate.innerHTML += dateStart;
            datesContainer.appendChild(divDate);
        }
 
    const parentDiv = datesContainer.parentNode;
    const detailDesc = parentDiv.querySelector(".description");
    const detailPrice = parentDiv.querySelector(".price");

    detailDesc.innerText = courseDesc;
    detailPrice.innerText = price.currency + " " + price.amount;

    parentDiv.style="display:block";

    this.style= "display:none";
  
};


