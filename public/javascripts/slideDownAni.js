// const searchInput = document.querySelector("[data-search]");
const container = document.querySelector('.cluster-map-container');
const clusterMap = container.querySelector('#cluster-map');
const title = document.querySelector("#idex-title");
const savedTitle = title.innerHTML;
const subTitle = document.querySelector("#search-label");
const savedSub = subTitle.innerHTML;

searchInput.addEventListener("focusin", e =>{
    // 애니메이션
    container.classList.remove('show');
    clusterMap.classList.remove('show');
    // 안내
    title.innerHTML = '검색된 캠핑장들';
    subTitle.innerHTML = '지도를 다시 보시려면, 입력 내용을 지운 후 입력창 밖을 클릭해주세요.';
})

searchInput.addEventListener("focusout", e =>{
    if(!e.target.value){
        // 애니메이션
        container.classList.add('show');
        clusterMap.classList.add('show');
        // 안내
        title.innerHTML = savedTitle;
        subTitle.innerHTML = savedSub;
    }
})

