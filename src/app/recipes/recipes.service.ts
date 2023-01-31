import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  private recipes: Recipe[] = [
    {
      id: 'r1',
      title: 'Schnitzel',
      imageUrl:
        'https://www.pequerecetas.com/wp-content/uploads/2021/01/wiener-schnitzel.jpg',
      ingredients: ['French fries', 'Pork meat', 'Salad'],
    },
    {
      id: 'r2',
      title: 'Spaghetti',
      imageUrl:
        'https://media.istockphoto.com/id/1144823591/photo/spaghetti-in-a-dish-on-a-white-background.jpg?s=612x612&w=0&k=20&c=SeEWmJfPQlX1zVUHPKjL-cgYeMs9cZ97-kdZMm7feA4=',
      ingredients: ['Spaghetti', 'Meat', 'Tomatoes'],
    },
  ];

  constructor() {}

  getAllRecipes() {
    return [...this.recipes];
  }

  getRecipe(recipeId: string) {
    return this.recipes.find((recipe) => recipe.id === recipeId);
  }

  deleteRecipe(recipeId: string) {
    this.recipes = this.recipes.filter((recipe) => recipe.id !== recipeId);
  }
}
