// apps/transactions/src/app/categories/default-categories.ts
import { CategoryIcon } from '@moneytracker/interfaces';

export const DEFAULT_CATEGORIES = [
  { name: 'Продукты', type: 'expense', icon: CategoryIcon.FOOD },
  { name: 'Транспорт', type: 'expense', icon: CategoryIcon.TRANSPORT },
  { name: 'Развлечения', type: 'expense', icon: CategoryIcon.SHOPPING },
  { name: 'Аренда жилья', type: 'expense', icon: CategoryIcon.RENT },
  { name: 'Зарплата', type: 'income',  icon: CategoryIcon.SALARY },
  { name: 'Переводы', type: 'transfer', icon: CategoryIcon.TRANSFER }
  // ... ещё по необходимости
];