/* eslint-disable @typescript-eslint/no-unused-vars */
import { TodoId } from '../models/ITodo';
import { TodoListId } from '../models/ITodoList';
import { TodoTableId } from '../models/ITodoTable';

export const POSITION_STEP = 2 ** 16;
export const MIN_POSITION = 0;
export const MAX_POSITION = (2 ** 32) - 1;
export const MAX_POSITION_FRACTION_DIGITS_NUMBER = 3;

export const INVALID_TABLE_ID: TodoTableId = 'INVALID_TABLE_ID';
export const INVALID_LIST_ID: TodoListId = 'INVALID_LIST_ID';

export const NEW_TODO_ID: TodoId = 'NEW_TODO_ID';

// console.log('document.defaultView?.location.origin', document.defaultView?.location.origin);
// console.log('document.URL', document.URL);

export const SITE_URL = document.defaultView?.location.origin ?? document.URL;

const mainProductionPath = '/';
const mainDevelopmentPath = '/build';

let path = mainDevelopmentPath;

if (process.env.NODE_ENV === 'production') {
  path = mainProductionPath;
}

export const MAIN_PATH = path;
