import { Category } from '../../src/category/category.entity';

export const createCategory = (
  categoryData: Partial<Category>,
): Promise<Category> => {
  const category = new Category();
  Object.assign(category, categoryData);
  return category.save();
};

export const createDefaultCategory = async (title: string): Promise<Category> =>
  createCategory({
    title: title,
  });
