import React from "react";
import { StoryBatch } from "@backend/api-types";
import { storyBatchesToChapterList } from "../Definitions";

interface UseStoryBatchesProps {
    initialStoryBatches: StoryBatch[];
};

export const useStoryBatches = (props: UseStoryBatchesProps) => {

  const [storyBatches, setStoryBatches] = React.useState<StoryBatch[]>(props.initialStoryBatches);
    
  const allChapters = React.useMemo(()=> {

      return storyBatchesToChapterList(storyBatches)
  }, [storyBatches]);

  return { storyBatches, setStoryBatches, allChapters };
};