import { nanoid } from '@reduxjs/toolkit';

import { ITodo } from '../../models/ITodo';
import { getTitle, getSentence } from '../Lorem';
import random from '../random';

const mockTodos: Array<ITodo> = [];
const todosCount = 12;
const date = new Date();

for (let i = 0; i < todosCount; i += 1) {
  date.setSeconds(i);

  const item: ITodo = {
    todoId: nanoid(),
    listId: '',
    title: getTitle(),
    description: '',
    addedAt: date.toISOString(),
  };

  if (random.bool()) {
    item.description = getSentence();
  }

  mockTodos.push(item);
}

export default mockTodos;