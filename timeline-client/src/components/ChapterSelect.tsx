import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { StoryBatch } from '@backend/api-types';
import React from 'react';

interface ChapterSelectProps {
    storyBatches: StoryBatch[];
    onChapterIndexChange: (newChapterId: number) => void;
}

const renderBatchNames = (batches : StoryBatch[]) => {

    let chapterCount = 0;

    return batches.map(function(batch: StoryBatch, batchIndex){
        return [

            <ListSubheader key={"batch-" + batchIndex}>{batch.name}</ListSubheader>,

            batch.chapters.map((chapter: string) => {

                chapterCount++;
                // set the chapterCount to one less as can increment after return
                return <MenuItem key={"chapter" + chapter} value={chapterCount-1}>{chapter}</MenuItem>
            })
        ]
    })
}

export default function ChapterSelect(props: ChapterSelectProps) {

    const { storyBatches, onChapterIndexChange } = props;

    const onChange = (event: SelectChangeEvent<string>) => {

        let index = +event.target.value;

        onChapterIndexChange(index);
    }

    const batchMenuItems = React.useMemo(() => renderBatchNames(storyBatches), [storyBatches])

    return (
        <div>
            <FormControl sx={{ m: 1, minWidth: 150 }}>
                <InputLabel htmlFor="chapter-select">Chapter</InputLabel>
                <Select defaultValue="0" id="chapter-select" label="Chapter" onChange={onChange}>
                    {batchMenuItems}
                </Select>
            </FormControl>
        </div>
    );
}