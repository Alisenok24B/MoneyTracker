import { FlowType } from "./common.types";

export enum CategoryIcon {
  FOOD = 'food',
  TRANSPORT = 'transport',
  SHOPPING = 'shopping',
  SALARY = 'salary',
  RENT = 'rent',
  TRANSFER = 'transfer'
  // Добавьте остальные иконки здесь
}

export interface ICategory {
  _id?: string;
  name: string;
  type: FlowType;
  icon: CategoryIcon;
  isDefault: boolean;
  userId?: string | null;
  deletedAt?: Date;
}
