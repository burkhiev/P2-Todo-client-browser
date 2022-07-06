import React, { useEffect, useState } from 'react';

import styles from './TodoCard.css';

import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHooks';
import EditTodoForm from '../EditTodoForm/EditTodoForm';
import { curtainOff, curtainOn } from '../../../../store/style/curtainSlice';
import { TodoId } from '../../../../models/ITodo';
import { selectTodoById } from '../../../../store/todo/todoSlice';
import useTodoDrag from '../../../../hooks/dnd/useTodoDrag';
import useTodoDropInfo from '../../../../hooks/dnd/useTodoDropInfo';

export interface ITodoCardProps {
  todoId: TodoId,
  isOverList: boolean,
  setPlaceholder: (todoId: TodoId) => void,
  updateList: () => void
}

export default function TodoCard(props: ITodoCardProps) {
  const {
    todoId, isOverList, setPlaceholder, updateList,
  } = props;

  const todo = useAppSelector((state) => selectTodoById(state, todoId));

  if (!todo) {
    throw new Error('Invalid argument error. Specified "todoId" do not exist.');
  }

  const dispatch = useAppDispatch();

  const [showEditForm, setShowEditForm] = useState<any>(null);

  const [{ isDragging }, drag] = useTodoDrag(todo.id);
  const [{ todoIsOver }, drop] = useTodoDropInfo();

  useEffect(() => {
    if (todoIsOver) {
      setPlaceholder(todoId);
    }

  //   Вызов setPlaceholder обновляет список показываемых элементов, в следствие
  // чего обновляется функция setPlaceholder и снова вызывается useEffect.
  // Таким образом компонент впадает в бесконечный цикл.
  //   Но убрав setPlaceholder из списка зависимостей можно рискнуть
  // вызовом старой версии функции. В данном случае это не страшно,
  // т.к. функция setPlaceholder является частью props, и при её
  // изменении компонент создаст новый рендер.
  //
  // Использование useCallback c setPlaceholder ситуацию не спасает.
  //
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todoIsOver, todoId]);

  function onCloseEdit(this: HTMLElement) {
    dispatch(curtainOff());
    document.body.removeEventListener('click', onCloseEdit);
    setShowEditForm(false);
  }

  function onOpenEdit(e: React.MouseEvent) {
    e.stopPropagation();
    dispatch(curtainOn());
    document.body.addEventListener('click', onCloseEdit);
    setShowEditForm(true);
  }

  let editForm: any;

  if (showEditForm) {
    editForm = (
      <EditTodoForm
        todoId={todo.id}
        onClose={onCloseEdit}
        onRemove={updateList}
      />
    );
  }

  const truncateCss = isOverList ? 'text-truncate text-nowrap' : '';
  const btnCss = 'flex-grow-1 p-2 border rounded bg-white text-start text-break';

  return (
    <div ref={drop} className={`v-stack pb-1 ${isDragging ? 'd-none' : ''}`}>
      {editForm}
      <div ref={drag} className="d-flex rounded border-bottom">
        <button
          type="button"
          className={`${btnCss} ${truncateCss}`}
          onClick={onOpenEdit}
        >
          <div
            className={`d-flex ${styles.appearing_pen_container}`}
          >
            <span>{todo.title}</span>
            <span className={`ms-auto bi bi-pen text-muted fs-6 ${styles.appearing_pen}`} />
          </div>
        </button>
      </div>
    </div>
  );
}
