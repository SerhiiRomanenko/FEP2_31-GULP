
function renderPagesPagination(button) {
    const allPuginButtons = $pagination.querySelectorAll(".main__paginationItem");
    allPuginButtons.forEach((item) => {
        item.classList.remove("pagin__active");
    });
    button.classList.add("pagin__active");

    async function renderPagin() {
        const response = await fetch(button.getAttribute("data-pageUrl"));

        if (!response.ok) {
            throw new Error(`Error HTTP: Status ${response.status}`);
        } else {
            const result = await response.json();
            if (button.getAttribute("data-pageUrl").includes("people")) {
                renderPeople(result);
            } else if (button.getAttribute("data-pageUrl").includes("planets")) {
                renderPlanets(result);
            } else if (button.getAttribute("data-pageUrl").includes("starships")) {
                renderStarships(result);
            }
        }
    }

    renderPagin();
}

//------------------------------------------------------------------------------EVENT DELEGATION------------------------------------------------//
$navigation.addEventListener("click", function (event) {
    event.preventDefault();

    //-------------------------------------------------------------------CLICK PERSONS (XML requests)------------------------------------------------//
    if (event.target.classList.contains("main__characters")) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", URL + "people");
        xhr.addEventListener("load", function () {
            if (xhr.status !== 200) {
                console.log(`HTTP error: status ${xhr.status}`);
            } else {
                const data = JSON.parse(xhr.response);
                renderPeople(data); // rendered People
                showPagination(data, "people");
            }
        });
        xhr.send();
    }

    //-----------------------------------------------------------------------CLICK PLANETS (FETCH)------------------------------------------------//
    else if (event.target.classList.contains("main__planets")) {
        const promise = fetch(URL + "planets");
        promise
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                } else {
                    return response.json();
                }
            })
            .then((data) => {
                renderPlanets(data); // rendered Planets
                showPagination(data, "planets");
            })
            .catch((error) => console.log(error));
    }

    //-------------------------------------------------------------CLICK TRANSPORT (async await FETCH)------------------------------------------------//
    else if (event.target.classList.contains("main__transport")) {
        async function getStarships() {
            const response = await fetch(URL + "starships");
            if (!response.ok) {
                throw new Error(`HTTP failed: ${response.status}`);
            } else {
                return await response.json();
            }
        }

        getStarships().then((starships) => {
            renderStarships(starships); // rendered Ships
            showPagination(starships, "starships"); // rendered pagination
        });
    }
});
