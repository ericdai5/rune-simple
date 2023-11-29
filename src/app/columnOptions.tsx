import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
  import { Trash2 } from "lucide-react";
  import { MoreHorizontal, Plus, Trash } from "lucide-react";
  import { deleteBlock, deleteColumn, updateCheckbox } from "@/redux/blockSlice";
  import { useDispatch, useSelector } from "react-redux";
  import React, { useEffect, useRef, useState } from "react";
  import { selectBlocks, selectColumns } from "@/redux/selectors";
  import { Button } from "@/components/ui/button";
  import { Diamond } from 'lucide-react';
  import { addBlock, addBlockEmptyBefore, updateColumn } from "@/redux/blockSlice";
  import { nanoid } from "@reduxjs/toolkit";
  
  interface ColumnProps {
    columnId: string;
  }

  type Checked = DropdownMenuCheckboxItemProps["checked"]
  
  export const ColumnOptions: React.FC<ColumnProps> = ({ columnId }) => {

    const dispatch = useDispatch();
    const columns = useSelector(selectColumns);
    const [newBlock, setNewBlock] = useState("");
    const [showStatusBar, setShowStatusBar] = React.useState<Checked>(columns[columnId].checkbox)

    const addBlockHandler = () => {
        dispatch(addBlockEmptyBefore({ sourceId: columnId }));
        setNewBlock("");
    };

    const deleteColumnHandler = () => {
        dispatch(deleteColumn({ columnId: columnId }));
    };

    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="none" size="iconsmall">
            <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
            checked={showStatusBar}
            //turns the checkbox value for the column into true
            onCheckedChange={(newStatus) => {
                setShowStatusBar(newStatus);
                dispatch(updateCheckbox({ columnId }));
              }}
            >
            Checkbox
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={deleteColumnHandler}>
            <Trash className="mr-2 h-4 w-4" />
              Delete Column
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
  };