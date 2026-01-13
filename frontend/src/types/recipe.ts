export type Recipe = {
  recipeId: number;
  recipeTitle: string;
  recipeUrl: string;
  foodImageUrl: string;
  mediumImageUrl: string;
  smallImageUrl: string;
  nickname: string;
  recipeMaterial: string[];
  recipeIndication: string;
  recipeCost: string;
  rank: string;
  recipeDescription: string;
};

export type RecipeCategory = {
  categoryId: string;
  categoryName: string;
  categoryUrl: string;
};
