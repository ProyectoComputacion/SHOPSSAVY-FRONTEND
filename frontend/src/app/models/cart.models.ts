export interface CartItem {
    id: number;
    user_id: number;
    recipe_id: number;
    recipe_type: string;
    quantity: number;
    recipe?: Recipe;
  }
  
  export interface Recipe {
    id: number;
    name: string;
    ingredients: Ingredient[];
  }
  
  export interface Ingredient {
    name: string;
    quantity: number;
  }
  
  export interface CartComparison {
    recipe_name: string;
    comparison: SupermarketComparison[];
  }
  
  export interface SupermarketComparison {
    supermarket: string;
    total_cost: number;
    breakdown: IngredientComparison[];
  }
  
  export interface IngredientComparison {
    ingredient: string;
    quantity: number;
    price: number;
  }
  