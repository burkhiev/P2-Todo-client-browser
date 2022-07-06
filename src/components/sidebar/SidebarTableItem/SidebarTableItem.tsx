import React, { useState } from 'react';

import styles from './SidebarTableItem.css';

import { useAppSelector } from '../../../hooks/reduxHooks';
import { TodoTableId } from '../../../models/ITodoTable';
import { selectTableById, useDeleteTable } from '../../../store/api/apiSlice';
import InvalidArgumentError from '../../../service/errors/InvalidArgumentError';

interface ISidebarTableItemProps {
  tableId: TodoTableId,
  selectedTableId: TodoTableId | undefined,
  curDropdownTableId: TodoTableId | undefined,
  itsFirst: boolean,
  selectTable: (id: TodoTableId) => void,
  onDeleteTable: (tableId: TodoTableId) => void,
  setCurDropdownTableId: (tableId?: TodoTableId) => void
}

export default function SidebarTableItem(props: ISidebarTableItemProps) {
  const {
    tableId,
    selectedTableId,
    curDropdownTableId: curTableId,
    itsFirst,
    selectTable,
    onDeleteTable,
    setCurDropdownTableId,
  } = props;

  const table = useAppSelector((state) => selectTableById(state, tableId));

  if (!table) {
    throw new InvalidArgumentError('Non-existent "tableId" received.');
  }

  const [dropdownIsOpened, setDropdownIsOpened] = useState(false);
  const [deleteTable, { isLoading }] = useDeleteTable();

  function onSelect() {
    selectTable(tableId);
  }

  async function onDelete() {
    if (table) {
      try {
        await deleteTable({ id: table.id }).unwrap();
        onDeleteTable(table.id);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  }

  function onCloseDropdownMenu() {
    setDropdownIsOpened(false);
    document.body.removeEventListener('click', onCloseDropdownMenu);
  }

  function onOpenDropdownMenu(e: React.MouseEvent) {
    e.stopPropagation();
    setCurDropdownTableId(table?.id);

    setDropdownIsOpened(true);
    document.body.addEventListener('click', onCloseDropdownMenu);
  }

  let dropdownMenu: any;

  if (curTableId === table.id && dropdownIsOpened) {
    dropdownMenu = (
      <div className={`dropdown-menu d-block ${styles.sidebar_options_dropdown_menu}`}>
        <button
          type="button"
          className="dropdown-item"
          onClick={onDelete}
        >
          Удалить
        </button>
      </div>
    );
  }

  const margin = itsFirst ? '' : 'mt-1';
  const selected = selectedTableId === tableId ? 'bg-primary' : '';
  const selectedText = selectedTableId === tableId ? 'text-white' : '';
  const placeholder = (isLoading) ? 'placeholder' : '';
  const bgColor = (isLoading) ? 'bg-danger' : '';
  const textColor = (isLoading) ? 'text-white' : '';

  return (
    <div className={`
      d-flex
      px-3
      rounded
      placeholder-glow
      ${margin} 
      ${selected} 
      ${bgColor}
      ${styles.sidebar_table_item}
    `}
    >
      <button
        type="button"
        onClick={onSelect}
        className={`
          text-start
          text-truncate
          w-100
          ${textColor}
          ${placeholder}
          ${selectedText} 
          ${styles.sidebar_table_item_btn}
        `}
      >
        {table.name}
      </button>
      <div className="m-1 dropend">
        <button
          type="button"
          onClick={onOpenDropdownMenu}
          className={`
            ${styles.sidebar_table_item_btn} 
            ${styles.sidebar_table_item_options}
          `}
        >
          <span className="bi bi-three-dots" />
        </button>
        {dropdownMenu}
      </div>
    </div>
  );
}