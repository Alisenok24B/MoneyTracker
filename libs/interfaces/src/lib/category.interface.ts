export enum CategoryIcon {
  FOOD = 'food',
  TRANSPORT = 'transport',
  SHOPPING = 'shopping',
  SALARY = 'salary',
  RENT = 'rent',
  TRANSFER = 'transfer'
  // Добавьте остальные иконки здесь
}

export enum CategoryType {
  Income  = 'income',
  Expense = 'expense',
  Transfer = 'transfer'
}

export interface ICategory {
  _id?: string;
  name: string;
  type: CategoryType;
  icon: CategoryIcon;
  isDefault: boolean;
  userId?: string | null;
  deletedAt?: Date;
}
