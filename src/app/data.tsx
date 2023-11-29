interface Block {
  id: string;
  content: string;
}

interface Column {
  id: string;
  title: string;
  blockIds: string[];
}

interface Data {
  blocks: { [blockId: string]: Block };
  columns: { [columnId: string]: Column };
  columnOrder: string[];
  newBlockId: string | null; // Add this line to track the newly added block ID
}

const Data: Data = {
  blocks: {
    "block-1": { id: "block-1", content: "take out the garbage" },
    "block-2": { id: "block-2", content: "do my homework" },
    "block-3": { id: "block-3", content: "clean my room" },
    "block-4": { id: "block-4", content: "cook dinner" },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "To Do",
      blockIds: ["block-1", "block-2", "block-3", "block-4"],
    },
    "column-2": {
      id: "column-2",
      title: "Done",
      blockIds: [],
    },
  },
  //facilitate reordering of the columns
  columnOrder: ["column-1", "column-2"],
  newBlockId: null, // Add this line to track the newly added block ID
};

export default Data;
