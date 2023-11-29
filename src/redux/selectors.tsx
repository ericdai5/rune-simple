import { RootState } from "@/redux/store";

export const selectColumns = (state: RootState) => state.blocks.columns;
export const selectColumnOrder = (state: RootState) => state.blocks.columnOrder;
export const selectBlocks = (state: RootState) => state.blocks.blocks;
export const selectFocusBlockId = (state: RootState) => state.blocks.focusBlockId;
