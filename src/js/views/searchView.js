import {element} from './base'
export const getInput = ()=> element.searchInput.value
export const clearInput = ()=>{
    element.searchInput.value = '';
};

export const clearResult = ()=>{
    element.searchList.innerHTML = '';
};

const limitReceipeTitle = (title,limit = 17)=>{
    const newTitle = [];
    if (title.length > limit){
        title = title.split(' ');
        title.reduce((acc,cur)=>{
            if(acc + cur.length <= limit){
                newTitle.push(cur)
            }
            return acc + cur.length;
        },0)
        return `${newTitle.join(' ')}...`;
    }
    return title
}
const renderReceipe = receipe =>{
    const markup = `
    <li>
        <a class="results__link" href=#${receipe.recipe_id}>
            <figure class="results__fig">
                <img src=${receipe.image_url} alt=${receipe.title}>
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitReceipeTitle(receipe.title)}</h4>
                <p class="results__author">${receipe.publisher}</p>
            </div>
        </a>
    </li>
    `
    element.searchList.insertAdjacentHTML('beforeend',markup);
}
const createButton = (page,type)=>{
return `
<button class="btn-inline results__btn--${type}" data-goto = ${type === 'prev'? (page-1):(page+1)}>
    <span>Page ${type === 'prev'? (page-1):(page+1)}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type ==='prev'?"left":"right"}"></use>
    </svg>
</button>
`}

const renderButton =(page,numRes,pageRes)=>{
    let button;
    const numPages = Math.ceil(numRes/pageRes)
    //  for first page need one next button
    if(page ===1 && numPages > 1){
        button = createButton(page,'next');
    }
    // for inbetween pages we need prev and next button
    else if(page < numPages){
        button = `${createButton(page,'prev')}
        ${createButton(page,'next')}`;
    }
    // for last page needs prev button
    else if(page === numPages && numPages > 1){
        button = createButton(page,'prev');
    }
    element.paginationButtonHolder.insertAdjacentHTML('afterbegin',button);
}
const clearRenderButton =()=>{
    element.paginationButtonHolder.innerHTML=""
}
export const renderReceipes = (receipes,page = 1,pageRes = 10) =>{
    // render results of current page
    const start = (page-1)*10;
    const end = page * pageRes;
    receipes.slice(start,end).forEach(renderReceipe);
    // render pagination button
    clearRenderButton();
    renderButton(page,receipes.length,pageRes);
}
export const highlightSelected = id =>{
    const resultArr = Array.from(document.querySelectorAll('.results__link'));
    resultArr.map(el=>{
        el.classList.remove('results__link--active');
    })
    document.querySelector(`a[href = "#${id}"]`).classList.add('results__link--active');
}