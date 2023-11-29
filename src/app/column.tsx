import React, { useEffect, useRef, useState } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import Block from "./block";
import { selectColumns, selectFocusBlockId, selectBlocks, selectColumnOrder} from "@/redux/selectors";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Diamond } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { addBlock, addBlockEmptyBefore, updateColumn } from "@/redux/blockSlice";
import { nanoid } from "@reduxjs/toolkit";
import { ScrollArea } from "@/components/ui/scroll-area";
import ContentEditable from "react-contenteditable";
import { ColumnOptions } from "./columnOptions";

interface Block {
  id: string;
  content: string;
  complete: boolean;
}

interface ColumnProps {
  columnId: string;
  index: number;
}

const Column: React.FC<ColumnProps> = ({ columnId, index }) => {

  const dispatch = useDispatch();
  const focusBlockId = useSelector(selectFocusBlockId);
  const blocks = useSelector(selectBlocks);
  const columns = useSelector(selectColumns);
  const blockRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [newBlock, setNewBlock] = useState("");
  const [newColumn, setNewColumn] = useState("");

  useEffect(() => {
    if (focusBlockId) {
      blockRefs.current[focusBlockId]?.focus();
    }
  }, [focusBlockId]);

  useEffect(() => {
    return () => {
      columns[columnId].blockIds.forEach(blockId => {
        if (!blocks[blockId]) {
          delete blockRefs.current[blockId];
        }
      });
    };
  }, [columns[columnId].blockIds, blocks]);

  const handleChange = (e: any) => {
    dispatch(updateColumn({ text: e.target.value, columnId: columnId }));
  };

  const addBlockHandler = () => {
    dispatch(addBlockEmptyBefore({ sourceId: columnId }));
    setNewBlock("");
  };

  return (

    <Draggable draggableId={columns[columnId].id} index={index}>
      {(provided) => (
    <Card className="group/card m-2 flex flex-col" {...provided.draggableProps} ref={provided.innerRef}>

      <CardHeader {...provided.dragHandleProps}>
        <div className="h-8 flex w-[280px] items-center justify-between">

          <ContentEditable
                className="truncate text-xl font-semibold leading-none tracking-tight w-full pl-1 pt-2 pb-1 overflow-hidden cursor-text outline-none caret-black dark:caret-white"
                html={columns[columnId].title}
                disabled={false}
                onChange={(e) => handleChange(e)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                     e.preventDefault();
                  }
                }}
          />
          {/** on hover over the parent card a button appears*/}
          <div className="opacity-30 group-hover/card:opacity-100">
            <div className="flex flex-row space-x-1">
          <Button variant="ghost" size="iconsmall"
            onClick={addBlockHandler}
            >
            <Plus className="h-5 w-5" />
          </Button>
            <ColumnOptions columnId={columnId}/>
            </div>
          </div>
        </div>
      </CardHeader>

      <ScrollArea className="flex">
      <CardContent className="h-[60vh]">
      <Droppable droppableId={columns[columnId].id} type="block">
        {(provided) => (
          <div
            className="flex flex-grow flex-col items-center h-full"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {columns[columnId].blockIds.map((blockId, index) => (
              <Block
                key={blockId}
                content={blocks[blockId].content}
                index={index}
                columnId={columnId}
                complete={blocks[blockId].complete}
                ref={(el) => (blockRefs.current[blockId] = el)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      </CardContent>
      </ScrollArea>
    </Card>
    )}
    </Draggable>
  );
};

export default Column;
