import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2 } from "lucide-react";
import { MoreVertical } from "lucide-react";
import { deleteBlock } from "@/redux/blockSlice";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { selectBlocks, selectColumns } from "@/redux/selectors";

interface BlockProps {
  blockId: string;
  content: string;
  index: number;
  columnId: string;
}

export const BlockOptions: React.FC<BlockProps> = ({ index, columnId }) => {
  const dispatch = useDispatch();
  const columns = useSelector(selectColumns);
  const deleteBlockHandler = () => {
      dispatch(deleteBlock({ columnId: columnId, blockId: columns[columnId].blockIds[index] }));
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MoreVertical className="opacity-0 group-hover:opacity-20 -mr-10" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={deleteBlockHandler}>
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
