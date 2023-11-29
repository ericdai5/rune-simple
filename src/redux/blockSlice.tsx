import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";

interface Block {
  id: string;
  content: string;
  complete: boolean;
}

interface Column {
  id: string;
  title: string;
  blockIds: string[];
  checkbox: boolean;
}

interface Data {
  id: string;
  blocks: { [blockId: string]: Block };
  columns: { [columnId: string]: Column };
  columnOrder: string[];
  focusBlockId: string | null;
}
  
const initialState: Data = {
  id: nanoid(),
  blocks: {},
  columns: {
    "column-1": { id: "column-1", title: "To Do", blockIds: [] , checkbox: false},
  },
  columnOrder: ["column-1"],
  focusBlockId: null,
}

const blockSlice = createSlice({
  name: "blocks", // A name, used in action types
  initialState, // The initial state for the reducer
  reducers: { 

    adjustFocusBlockId: (state, action: PayloadAction<{
      blockId: string; 
      command: string;
      columnId: string;
    }>,
    ) => {
      const {
        blockId,
        command,
        columnId,
      } = action.payload;
      state.focusBlockId = action.payload.blockId;
      const currentIndex = state.columns[columnId].blockIds.indexOf(state.focusBlockId);

      if (command === "click") {
        const focusBlockId =  state.columns[columnId].blockIds[currentIndex];
         state.focusBlockId = focusBlockId;
      } 

      if (command === "previous" && currentIndex > 0 ) {
        const focusBlockId =  state.columns[columnId].blockIds[currentIndex - 1];
         state.focusBlockId = focusBlockId;
      } 

      if (command === "next" && currentIndex <  state.columns[columnId].blockIds.length - 1) {
        const focusBlockId =  state.columns[columnId].blockIds[currentIndex + 1];
         state.focusBlockId = focusBlockId;
      }

      //find the nearest column that has a block, if a block exists in the same index, use that, otherwise use the last block in the column
      if (command === "left" &&  state.columnOrder.indexOf(columnId) > 0) {
        //loop through the columnOrder array starting at the adjacent index of the current column
        const startIndex =  state.columnOrder.indexOf(columnId) - 1;
        for (let i = startIndex; i >= 0; i--) {
          //for each column, check if it has any blocks
          if ( state.columns[ state.columnOrder[i]].blockIds.length > 0) {
            let destinationColumn =  state.columns[ state.columnOrder[i]];
            //if it has blocks, check if the current index is a block
            if (destinationColumn.blockIds[currentIndex]) {
              const focusBlockId = destinationColumn.blockIds[currentIndex];
               state.focusBlockId = focusBlockId;
            } else {
              //if the current index is not a block, use the last block in the column
              const focusBlockId = destinationColumn.blockIds[destinationColumn.blockIds.length - 1];
               state.focusBlockId = focusBlockId;
            } 
            break; 
          }
        }
      }

      //find the nearest column that has a block, if a block exists in the same index, use that, otherwise use the last block in the column
      if (command === "right" &&  state.columnOrder.indexOf(columnId) <  state.columnOrder.length - 1) {
        //loop through the columnOrder array starting at the adjacent index of the current column
        const startIndex =  state.columnOrder.indexOf(columnId) + 1;
        for (let i = startIndex; i <  state.columnOrder.length; i++) {
          //for each column, check if it has any blocks
          if ( state.columns[ state.columnOrder[i]].blockIds.length > 0) {
            let destinationColumn =  state.columns[ state.columnOrder[i]];
            //if it has blocks, check if the current index is a block
            if (destinationColumn.blockIds[currentIndex]) {
              const focusBlockId = destinationColumn.blockIds[currentIndex];
               state.focusBlockId = focusBlockId;
            } else {
              //if the current index is not a block, use the last block in the column
              const focusBlockId = destinationColumn.blockIds[destinationColumn.blockIds.length - 1];
               state.focusBlockId = focusBlockId;
            } 
            break; 
          }
        }
      }

    },

    addColumn: (state, action: PayloadAction<{
      column: Column;
    }>) => {
      const { column } = action.payload;
      state.columns[column.id] = column;
      state.columnOrder.push(column.id);
    },

    addBlock: (state, action: PayloadAction<{
      block: Block;
    }>) => {
      const { block } = action.payload;
      state.blocks[block.id] = block;
      state.columns["column-1"].blockIds.push(block.id);
    },

    deleteColumn: (state, action: PayloadAction<{
      columnId: string;
    }>) => {
      const { columnId } = action.payload;
      //for each block in thhe colomn being deleted, delete the block
      state.columns[columnId].blockIds.forEach(blockId => {
        delete  state.blocks[blockId];
      });
      const columnIndex =  state.columnOrder.indexOf(columnId);
      const originalColumnIds = Array.from( state.columnOrder);
      originalColumnIds.splice(columnIndex, 1);
      state.columnOrder = originalColumnIds;
      delete  state.columns[columnId];
    },

    deleteBlock: (state, action: PayloadAction<{
        columnId: string; // id of the column where the block is
        blockId: string; //index of the block in column
    }>,
    ) => {
        const {
        columnId,
        blockId,
      } = action.payload;
          // Fetch the specific Data object
        const blockIdIndex =  state.columns[columnId].blockIds.indexOf(blockId);
        const originalblockIds = Array.from( state.columns[columnId].blockIds);
        originalblockIds.splice(blockIdIndex, 1);
         state.columns[columnId].blockIds = originalblockIds;
        delete  state.blocks[blockId];
        let newFocusIndex;
           if (blockIdIndex === 0) {
              newFocusIndex = 0;
           } else {
             newFocusIndex = blockIdIndex - 1;
           }
        const newFocusId =  state.columns[columnId].blockIds[newFocusIndex];
        state.focusBlockId = newFocusId;
    },


    addBlockEmptyAfter: (state, action: PayloadAction<{
        sourceId: string; // ID of the source column
        blockId: string; // ID of the block after which a new block will be added
      }>,
    ) => {
      const {   sourceId, blockId } = action.payload;
        // Fetch the specific Data object
      const focusBlockId = nanoid(); // Generate a new unique ID for the new block
      const focusBlock: Block = { id: focusBlockId, content: "", complete: false }; // Create a new block with the generated ID and an empty content 
       state.blocks[focusBlockId] = focusBlock; // Add the new block to the blocks object
      const newIndex =  state.columns[sourceId].blockIds.indexOf(blockId) + 1; // Find the index of the block after which the new block should be added
      const newblockIds = Array.from( state.columns[sourceId].blockIds);
      newblockIds.splice(newIndex, 0, focusBlockId); // Add the new block ID into the column's blockIds array
       state.columns[sourceId].blockIds = newblockIds; // Update the column's blockIds array in the state
       state.focusBlockId = focusBlockId; // Set the newBlockId in the state
    },

  addBlockEmptyBefore: (state, action: PayloadAction<{
    sourceId: string;
  }>,
  ) => {
    const {  sourceId} = action.payload;
      // Fetch the specific Data object
    const focusBlockId = nanoid(); // Generate a new unique ID for the new block
    const focusBlock: Block = { id: focusBlockId, content: "", complete: false }; // Create a new block with the generated ID and an empty content 
     state.blocks[focusBlockId] = focusBlock; // Add the new block to the blocks object
    const newblockIds = Array.from( state.columns[sourceId].blockIds);
    // Add the new block ID into the column's blockIds array at the beginning and move the rest of the ids down one
    newblockIds.splice(0, 0, focusBlockId);
    // newblockIds.splice(0, 0, focusBlockId); // Add the new block ID into the column's blockIds array
    state.columns[sourceId].blockIds = newblockIds; // Update the column's blockIds array in the state
    state.focusBlockId = focusBlockId; // Set the newBlockId in the state
  },

    moveBlock: (state, action: PayloadAction<{
        sourceId: string; // id of the source column
        destinationId: string; // id of the destination column
        sourceIndex: number; // index of the item in the source column
        destinationIndex: number; // index where the item should be inserted in the destination column
        draggableId: string; // id of the draggable item
      }>,
    ) => {
      const {
        sourceId,
        destinationId,
        sourceIndex,
        destinationIndex,
        draggableId,
      } = action.payload;
      if (sourceId === destinationId) {
        const startblockIds = Array.from( state.columns[sourceId].blockIds);
        startblockIds.splice(sourceIndex, 1);
        startblockIds.splice(destinationIndex, 0, draggableId);
         state.columns[sourceId].blockIds = startblockIds;
      } else {
        const startblockIds = Array.from( state.columns[sourceId].blockIds);
        startblockIds.splice(sourceIndex, 1);
        const finishblockIds = Array.from( state.columns[destinationId].blockIds);
        finishblockIds.splice(destinationIndex, 0, draggableId);
         state.columns[sourceId].blockIds = startblockIds;
         state.columns[destinationId].blockIds = finishblockIds;
      }
    },

    updateCheckbox: (state, action: PayloadAction<{
      columnId: string; 
      }>,
    ) => {
      const { 
        columnId, 
      } = action.payload;
       state.columns[columnId].checkbox = !state.columns[columnId].checkbox;
    },

    updateComplete: (state, action: PayloadAction<{
      blockId: string; 
      }>,
    ) => {
      const { 
        blockId, 
      } = action.payload;
      state.blocks[blockId].complete = !state.blocks[blockId].complete;
    },

    updateBlock: (state, action: PayloadAction<{
      text: string; 
      blockId: string;
      columnId: string;}>,
    ) => {
      const { 
        text,
        blockId,
        columnId, 
      } = action.payload;
       state.blocks[blockId].content = text;
       state.focusBlockId = blockId;
    },

    updateColumn: (state, action: PayloadAction<{
      text: string; 
      columnId: string;}>,
    ) => {
      const { 
        text,
        columnId, 
      } = action.payload;
       state.columns[columnId].title = text;
    },

    moveColumn: (state, action: PayloadAction<{
      sourceIndex: number;
      destinationIndex: number;
      draggableId: string; // index of the item in the source column
    }>,
    ) => {
      const {
        sourceIndex,
        destinationIndex,
        draggableId
      } = action.payload;
      const newColumnOrder = Array.from( state.columnOrder);
      newColumnOrder.splice(sourceIndex, 1);
      newColumnOrder.splice(destinationIndex, 0, draggableId);
       state.columnOrder = newColumnOrder;
    },
  },
});

export const { 
  addBlock, 
  moveBlock, 
  updateBlock, 
  addBlockEmptyAfter, 
  addBlockEmptyBefore, 
  deleteBlock, 
  adjustFocusBlockId, 
  addColumn, 
  moveColumn,
  deleteColumn,
  updateCheckbox,
  updateComplete,
  updateColumn} =
  blockSlice.actions;
export default blockSlice.reducer;
