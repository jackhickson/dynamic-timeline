import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

interface ChapterSliderProps {
    chapters: string[];
}

interface Mark {
    value: number;
    label: string;
}

function chaptersToMarks(chapters: string[]) : Mark[] {

    let marks: Mark[] = [];

    for(let i = 0; i < chapters.length; i++) {
        marks.push({value: i, label: chapters[i]});
    }

    return marks;
}

export default function ChapterSlider( props : ChapterSliderProps) {

    let marks = chaptersToMarks(props.chapters);

    return (
        <Box sx={{ width: 300 }}>
        <Slider
            aria-label="Chapters"
            defaultValue={0}
            step={null}
            valueLabelDisplay="on"
            marks={marks}
        />
        </Box>
    );
}
