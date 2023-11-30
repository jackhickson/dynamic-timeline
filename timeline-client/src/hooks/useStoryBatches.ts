import React from "react";
import { StoryBatch } from "@backend/api-types";
import { storyBatchesToChapterList } from "../Definitions";

interface UseStoryBatchesProps {
    initialStoryBatches: StoryBatch[];
};

export const useStoryBatches = (props: UseStoryBatchesProps) => {

  const [storyBatches, setStoryBatches] = React.useState<StoryBatch[]>(props.initialStoryBatches);
    
  const [allChapters, chapterNodeIdsMap] = React.useMemo(()=> {

      const chapters = storyBatchesToChapterList(storyBatches);

      const chapterNodeIdsMap: Map<number, number[]> = new Map();

      chapters.forEach((_, index) => {
          let nodeIDs: number[] = [];

          if(index === 0) {

              nodeIDs.push(0);
          }

          // need to make sure they are in order when doing it for real

          chapterNodeIdsMap.set(index, nodeIDs);
      })

      return [chapters, chapterNodeIdsMap];

  }, [storyBatches]);

  return { storyBatches, setStoryBatches, allChapters, chapterNodeIdsMap };
};