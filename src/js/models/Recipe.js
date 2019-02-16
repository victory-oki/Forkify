import axios from "axios";
import { key } from "../config";

export default class Recipe{
    constructor(id){
        this.id =  id;
    }
    async getRecipe(){
        try{
            const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url
            this.url = res.data.recipe.source_url
            this.ingredients=res.data.recipe.ingredients
        }
        catch(err){
            console.log(err);
            alert("something went wrong :(");
        }
    }
    calcTime(){
        // assuming we need 15mins for 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng/3);
        this.time = periods * 15;
    }
    calcServings(){
        this.servings = 4;
    }
    updateServings(type){
        // update servings
        const newServings = type === 'dec'? this.servings -1 : this.servings + 1;
        // update ingredients
        this.ingredients.map(ingredient =>{
            ingredient.count *= (newServings/this.servings);
        })
        this.servings = newServings
    }
    parseIngredients(){
        const unitLong = ['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds'];
        const unitShort = ['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];
        const units = [...unitShort,'kg','g'];
        const newIngredients = this.ingredients.map(el => {
            // uniform units
            let ingredients = el.toLowerCase();
            unitLong.forEach((unit,i)=>{
                ingredients = ingredients.replace(unit,unitShort[i]); 
            })
            // remove parenthesis
            ingredients = ingredients.replace("(",'');
            ingredients = ingredients.replace(")",'');
            // parse ingredient into count , unit and ingredient
            const arrIng = ingredients.split(' ');
            const unitInd = arrIng.findIndex(el2=>units.includes(el2));
            let ingObj 
            if(unitInd > -1){
                //there is a unit
                let count
                const countArr = arrIng.slice(0,unitInd);
                if(countArr.length === 1){
                    count = eval(arrIng[0].replace('-','+'));
                }else{
                    count = eval(arrIng.slice(0,unitInd).join('+'));
                }
                ingObj = {
                    count,
                    unit : arrIng[unitInd],
                    ingredients:arrIng.slice(unitInd + 1).join(' ')
                }
            }
            else if(parseInt(arrIng[0],10)){
                // there is count but no unit
                ingObj = {
                    count: parseInt(arrIng[0],10),
                    unit:'',
                    ingredients: arrIng.slice(1).join(' ')
                }
            }
            else if(unitInd === -1){
                // unit doesn't exist
                ingObj = {
                    count: 1,
                    unit:'',
                    ingredients
                }
            }
            return ingObj;
            // return ingredients
        })
        this.ingredients = newIngredients
    }
}