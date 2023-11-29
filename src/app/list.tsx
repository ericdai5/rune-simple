"use client";

import React, { useState } from "react";
import Column from "./column";
import { DragDropContext, DropResult, Droppable, Draggable } from "@hello-pangea/dnd";
import { ModeToggle } from "./modetoggle";
import { useDispatch, useSelector } from "react-redux";
import { moveBlock, addColumn, moveColumn } from "@/redux/blockSlice";
import { selectColumns, selectColumnOrder} from "@/redux/selectors";
import { nanoid } from "@reduxjs/toolkit";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import ContentEditable from "react-contenteditable";

const App: React.FC = () => {

  const dispatch = useDispatch();
  const columns = useSelector(selectColumns);
  const columnOrder = useSelector(selectColumnOrder);
  const [newColumn, setNewColumn] = useState("");

  const addColumnHandler = () => {
    if (columnOrder.length < 10) {
      const id = nanoid();
      dispatch(addColumn({ column: {id: id, title: "New ✎", blockIds: [], checkbox: false }}));
      setNewColumn("");
    }
    return;
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    if (type === "column") {
      dispatch(
      moveColumn({
        sourceIndex: source.index,
        destinationIndex: destination.index,
        draggableId,
      }),
      );
    } else {
      dispatch(
        moveBlock({
          sourceId: source.droppableId,
          destinationId: destination.droppableId,
          sourceIndex: source.index,
          destinationIndex: destination.index,
          draggableId,
        }),
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-row space-x-6 items-center justify-center p-6">

    <div className = "absolute space-x-2 top-6 right-6">
      <Button disabled={!(columnOrder.length < 4)} variant="neutral" size="icon" onClick={addColumnHandler} >
        <Plus className="h-5 w-5" />
      </Button> 
      <ModeToggle/>
    </div>
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="all-columns" direction="horizontal" type="column">
        {provided => (
          <div className = "flex" {...provided.droppableProps} ref={provided.innerRef}>
            {columnOrder.map((columnId, index) => {
              return <Column key={columns[columnId].id} columnId={columnId} index={index}/>;
            })}
        {provided.placeholder}
      </div>
        )}
      </Droppable>
    </DragDropContext>
    </div>
  );
};

export default App;
