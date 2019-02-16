// Global app controller
import Search from './models/Search'
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as listView from './views/listView'
import * as likeView from './views/likeView'
import {element,renderLoader,clearRenderLoader} from './views/base'
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

/**
 * global state of the app
 * search object
 * current recipe object
 * shopping list object
 * liked receipes
 */
const state = {} 
/******************
* search controller
******************/
const controlSearch =async ()=>{
    // get query from the ui
    const query = searchView.getInput();
    console.log(query);
    if(query){
        // add new search object to state 
        state.search = new Search(query);
        // prepare ui for results
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(element.searchRes);
        // search for receipes
        try{
        await state.search.getResults()
        // render results on ui
        clearRenderLoader();
        searchView.renderReceipes(state.search.receipe);
        }catch(err){
            alert("something went wrong with your catch" + err);
            clearRenderLoader();
        }
        
    }
}
element.searchForm.addEventListener('submit',e=>{
    e.preventDefault();
    controlSearch();
})
element.paginationButtonHolder.addEventListener('click',e=>{
    const btn = e.target.closest('.btn-inline')
    if (btn){
        const gotoPage = parseInt(btn.dataset.goto,10);
        console.log(gotoPage);
        searchView.clearResult();
        searchView.renderReceipes(state.search.receipe,gotoPage);
    }
    
})
/**
 * Recipe controller
 */

// const r = new Recipe(21213)
// r.getRecipe();
// console.log(r);

const controlRecipe =async ()=>{
    // get id from url
    const id = window.location.hash.replace('#','');
    console.log(id);
    if(id){
        // prepare ui for changes
        recipeView.clearRenderRecipe();
        renderLoader(element.recipe);
        // highlight selected item
        if(state.search)searchView.highlightSelected(id);
        // create new receipe obj and add to state
        state.recipe = new Recipe(id);
        // get recipe data
        try{
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            
            // calculate time and servings
            state.recipe.calcTime();
            state.recipe.calcServings();
            // render recipe on ui
            clearRenderLoader();
            // console.log(state.recipe)
            recipeView.renderRecipe(state.recipe,state.likes.isLiked(id));
        }catch(err){
            console.log(err);
            alert('error processing this recipe')
        }
        
    }
}

/**
 * List controller
 */
window.state = state
const controlList =()=>{
    // if no list create new list
    if(!state.list)state.list = new List();
    console.log(state.recipe.ingredients);
    state.recipe.ingredients.forEach(el=>{
        const item = state.list.addItem(el.count,el.unit,el.ingredients)
        listView.renderList(item);
    })
}
// handle delete and update of list items
element.shopping.addEventListener('click',e=>{
    const id = e.target.closest('.shopping__item').dataset.itemid;
    console.log(id);
    if (e.target.matches('.shopping__delete, .shopping__delete *')){
        state.list.deleteItem(id);
        listView.deleteItem(id);
    }
    else if (e.target.matches('.shopping__item--value')){
        const val = parseFloat(e.target.value,10);
        state.list.updateCount(id,val);
    }
})
/**
 * Likes controller
 */
window.addEventListener('load',()=>{
    state.likes = new Likes();
    state.likes.readStorage()
    likeView.toggleLikeMenu(state.likes.getNumLikes());
    state.likes.likes.forEach(like=>likeView.renderLike(like));
})
const controlLike =()=>{
    if(!state.likes)state.likes = new Likes();
    // if not liked already add like
    const currentId = state.recipe.id
    if(!state.likes.isLiked(currentId)){
        // add like to state
        const newLike = state.likes.addLike(currentId,state.recipe.title,state.recipe.author,state.recipe.img);
        // toggle the like
        // add like to ui
        console.log(state.likes);
        likeView.toggleLikeBtn(true);
        likeView.renderLike(newLike);
    }
    
    //else don't
    else{
        // remove like from state
        // toggle like
        // remove like from ui
        console.log("i've been liked")
        state.likes.deleteLike(currentId)
        console.log(state.likes);
        likeView.toggleLikeBtn(false);
        likeView.deleteLike(currentId);
    }
    
    likeView.toggleLikeMenu(state.likes.getNumLikes());
}
element.recipe.addEventListener('click',e=>{
    
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateRecipeIngredients(state.recipe);
        }
    }
    
    
    else if(e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServings('inc');
        recipeView.updateRecipeIngredients(state.recipe);
    }
    else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList()
    }
    else if(e.target.matches('.recipe__love, .recipe__love *')){
        controlLike();
    }
    // console.log(state.recipe);
});
['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));
// https://www.food2fork.com/api/search 
// 465c57cf29863dbec4f47041b521bf45