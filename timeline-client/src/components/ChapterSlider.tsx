import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

interface ChapterSliderProps {
    chapters: string[];
    onChapterIdChange: (newChapterId: string) => void;
}

interface Mark {
    value: number;
    label: string;
}

function chaptersToMarks(chapters: string[]) : [Mark[], number] {

    let numChapters = chapters.length

    const delta = 100 / (numChapters - 1);

    let marks: Mark[] = [];

    for(let i = 0; i < numChapters; i++) {

        marks.push({value: i * delta, label: chapters[i]});
    }

    // incase of weird double math
    marks[numChapters-1].value = 100;

    return [marks, delta];
}

export default function ChapterSlider( props : ChapterSliderProps) {

    let [marks, delta] = chaptersToMarks(props.chapters);

    const onChange = (event: Event, newValue: number | number[]) => {

        let value: number = Array.isArray(newValue) ? newValue[0]: newValue;

        // scale value (0-100) to marker length
        let index = Math.floor(value / delta);

        props.onChapterIdChange(marks[index].label);
    }

    return (
        <Box sx={{ width: 300 }}>
            <Slider
                aria-label="Chapters"
                onChange={onChange}
                defaultValue={marks[0].value}
                step={null}
                valueLabelDisplay="on"
                marks={marks}
            />
        </Box>
    );
}
