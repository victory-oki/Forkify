export const element = {
    searchForm : document.querySelector('.search'),
    searchInput : document.querySelector('.search__field'),
    searchRes: document.querySelector('.results'),
    searchList: document.querySelector('.results__list'),
    paginationButtonHolder:document.querySelector('.results__pages'),
    recipe:document.querySelector('.recipe'),
    shopping:document.querySelector('.shopping__list'),
    likeMenu:document.querySelector('.likes__field'),
    likeList:document.querySelector('.likes__list')
}
const elementStrings = {
    loader : 'loader'
}
export const renderLoader = parent =>{
    const loader =`
    <div class=${elementStrings.loader}>
        <svg>
            <use href = 'img/icons.svg#icon-cw'></use>
        </svg>
    </div>
    `;
    parent.insertAdjacentHTML('afterbegin',loader);
}
export const clearRenderLoader =()=>{
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if(loader){
        loader.parentNode.removeChild(loader);
    }
};