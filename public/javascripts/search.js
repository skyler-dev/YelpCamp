
const searchInput = document.querySelector("[data-search]");
const cards = document.querySelectorAll(".card");
// const mapDiv = document.querySelector("#cluster-map");

// searchInput.addEventListener("focusin", e =>{
//     mapDiv.classList.add("hide");
// })

// searchInput.addEventListener("focusout", e =>{
//     if(!e.target.value){
//         mapDiv.classList.remove("hide");
//     }
// })

searchInput.addEventListener("input", e => {
    const value = e.target.value.toLowerCase();

    cards.forEach((card)=>{
        const title = card.querySelector(".card-title");
        const location = title.nextElementSibling.nextElementSibling;
        const isVisible = title.textContent.toLowerCase().includes(value)||location.textContent.toLowerCase().includes(value);
        card.classList.toggle("hide", !isVisible);
    })
  })