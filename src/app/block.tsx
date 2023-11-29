import React, { forwardRef, useState, useRef, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Draggable } from "@hello-pangea/dnd";
import { GripVertical } from "lucide-react";
import ContentEditable from "react-contenteditable";
import { useDispatch, useSelector } from "react-redux";
import { updateBlock, addBlockEmptyAfter, deleteBlock, adjustFocusBlockId, updateComplete } from "@/redux/blockSlice";
import { BlockOptions } from "./blockOptions";
import { selectColumns, selectBlocks } from "@/redux/selectors";
import { setCaretToEnd } from "./setCaretToEnd";
import { CheckboxProps } from "@radix-ui/react-checkbox"

interface BlockProps {
  content: string;
  index: number
  columnId: string;
  complete: boolean;
}

type Complete = CheckboxProps["checked"]

const Block = React.forwardRef<HTMLDivElement, BlockProps>(
  ({content, index, columnId, complete}, ref) => {
    const dispatch = useDispatch();
    const contentEditableRef = useRef(null);
    const blocks = useSelector(selectBlocks);
    const columns = useSelector(selectColumns);
    const blockId = columns[columnId].blockIds[index];
    const checkbox = columns[columnId].checkbox;
    const [showComplete, setComplete] = React.useState<Complete>(blocks[blockId].complete)

    const handleChange = (e: any) => {
      dispatch(updateBlock({ text: e.target.value, blockId: blockId, columnId: columnId }));
    };

      useEffect(() => {
       if (typeof ref === "function") {
         ref(contentEditableRef.current);
       } else if (ref) {
         ref.current = contentEditableRef.current;
       }
     }, [ref]);

    const handleEnterAdd = (e: any) => {
      e.preventDefault();
      dispatch(addBlockEmptyAfter({ 
        sourceId: columnId, 
        blockId: blockId }));
    };

    const deleteBlockHandler = (e: any) => {
      e.preventDefault();
      dispatch(deleteBlock({ 
        columnId: columnId, 
        blockId: blockId }));
    };

    const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
      dispatch(adjustFocusBlockId({ blockId: blockId, command: "click", columnId: columnId}));
      setCaretToEnd(e.target);
    }

    const insertTextAtCursor = (text: string) => {
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) return;
      selection.deleteFromDocument();
      selection.getRangeAt(0).insertNode(document.createTextNode(text));
    };

    const pasteAsPlainText = (event: React.ClipboardEvent) => {
      event.preventDefault();
      const text = event.clipboardData.getData("text/plain");
      insertTextAtCursor(text);
    };


    return (
      <Draggable draggableId={columns[columnId].blockIds[index]} index={index}>
        {(provided) => (
          <div
            {...provided.draggableProps}
            // {...provided.dragHandleProps}
            ref={provided.innerRef}
            className="group flex w-[280px] overflow-visible flex-row rounded-sm items-start my-1 space-x-1 px-1 py-2 hover:bg-accent drag:bg-accent"
          >
            <div {...provided.dragHandleProps}>
              <GripVertical className="opacity-0 group-hover:opacity-20 -mx-7" />
            </div>

            {checkbox && (
            <div className="flex pr-1">
              <Checkbox 
                checked={showComplete}
                onCheckedChange={(newComplete) => {
                  setComplete(newComplete);
                  dispatch(updateComplete({ blockId }));
                }}
                id={blockId} 
              />
              </div>
            )}

            <div className="w-full min-w-0">
              <ContentEditable
                className="break-words text-base outline-none caret-black dark:caret-white"
                html={content}
                disabled={false}
                innerRef={contentEditableRef}
                onPaste={pasteAsPlainText}
                onFocus={(e) => handleFocus(e)}
                onChange={(e) => handleChange(e)}
                onKeyDown={(e) => {
                  const realTimeContent = (e.target as HTMLDivElement).innerHTML
                  if (e.key === "Enter" && realTimeContent !== "<br>") {
                    handleEnterAdd(e);
                  }
                  if (e.key === "Backspace" && (realTimeContent === "<br>" || realTimeContent === "")) {
                    deleteBlockHandler(e);
                  }
                  if (e.key === "ArrowUp") {
                     e.preventDefault();
                     dispatch(adjustFocusBlockId({ blockId: blockId, command: "previous", columnId: columnId}));
                  }
                  if (e.key === "ArrowDown") {
                     e.preventDefault();
                     dispatch(adjustFocusBlockId({ blockId: blockId, command: "next", columnId: columnId}));
                  }
                  if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    dispatch(adjustFocusBlockId({ blockId: blockId, command: "left", columnId: columnId}));
                  }
                  if (e.key === "ArrowRight") {
                    e.preventDefault();
                    dispatch(adjustFocusBlockId({ blockId: blockId, command: "right", columnId: columnId}));
                  }
                }}
              />
            </div>

            <div>
              <BlockOptions blockId={blockId} content={content} index={index} columnId={columnId} />
            </div>
          </div>
        )}
      </Draggable>
    );
  },
);


Block.displayName = 'Block';
export default Block;
