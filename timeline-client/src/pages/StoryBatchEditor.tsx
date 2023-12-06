import { StoryBatch } from "@backend/api-types";
import { Paper, List, Typography, Button } from "@mui/material";
import ItemInputSwitcher from "../components/ItemInputSwitcher";
import { Direction, moveItemAtIndex } from "../utils";
import { Add, Home, Save } from "@mui/icons-material";
import { initialStoryBatches } from "../initial-elements";
import React from "react";
import { api } from "../axiosApi";
import { Link } from "react-router-dom";

const NEW_BATCH = "New Batch"
const NEW_CHAPTER = "New Chapter"

interface StoryBatchEditorProps {
    toggleMode: () => void;
}

export default function StoryBatchEditor ({toggleMode}: StoryBatchEditorProps): any {

    const [autoFocusString, setAutoFocusString] = React.useState<string>('')
    const [storyBatches, setStoryBatches] = React.useState<StoryBatch[]>(initialStoryBatches);

    React.useEffect(() => {

        api.get("/storyBatches").then((response) => {

            const data = response.data;

            setStoryBatches(data || []);
        });

    }, [])

    const onSave = () => {

        api.post("/save/storyBatches", storyBatches).then((response) => {

            console.info(response);
        });
    }

    const onAddBatch = () => {

        if(storyBatches.some(batch => batch.name === NEW_BATCH)) {
            console.warn(NEW_BATCH + " already exist")
            return
        }

        setAutoFocusString(NEW_BATCH);

        setStoryBatches(oldBatches => [...oldBatches, {name: NEW_BATCH, chapters: []}]);
    }

    const moveBatch = (batchName: string, direction: Direction) => {

        const index = storyBatches.findIndex(batch => batch.name === batchName);

        const newBatches = moveItemAtIndex(storyBatches, index, direction);

        if(!!newBatches) {

            setAutoFocusString(batchName);
            setStoryBatches([...newBatches]);
        }
    }

    const updateBatchName = (oldBatchName: string, newBatchName:string) => {

        const index = storyBatches.findIndex(batch => batch.name === oldBatchName);

        storyBatches[index].name = newBatchName;

        setStoryBatches([...storyBatches]);
    }

    const deleteBatch = (batchName: string) => {

        setStoryBatches(storyBatches.filter(batch => batch.name !== batchName))
    }

    const onAddChapter = (batchName: string) => {

        setAutoFocusString(NEW_CHAPTER);

        setStoryBatches((batches) =>

            batches.map(batch => {

                if(batch.name !== batchName) { 
                    return batch
                }

                if(batch.chapters.some(chapter => chapter === NEW_CHAPTER)) {

                    console.warn(NEW_CHAPTER + " already exist")

                } else {

                    batch.chapters.push(NEW_CHAPTER)
                }

                return batch;
            })
        );
    }

    const moveChapter = (batchName: string, chapterName: string, direction: Direction) => {

        setAutoFocusString(chapterName);

        setStoryBatches((batches) =>

            batches.map(batch => {

                if(batch.name !== batchName) {

                    return batch;
                }

                const index = batch.chapters.findIndex(chapter => chapter === chapterName);

                const chapters = moveItemAtIndex(batch.chapters, index, direction);

                if(!!chapters) {
                    batch.chapters = chapters;
                }

                return batch;
            })
        );
    }

    const updateChapterName = (batchName: string, oldChapterName:string, newChapterName: string) => {

        setAutoFocusString(newChapterName);

        setStoryBatches((batches) =>

            batches.map(batch => {

                if(batch.name !== batchName) {

                    return batch;
                }

                const index = batch.chapters.findIndex(chapter => chapter === oldChapterName);

                batch.chapters[index] = newChapterName

                return batch;
            })
        );
    }

    const deleteChapter = (batchName: string, chapterName: string) => {

        setStoryBatches((batches) =>

            batches.map(batch => {

                if(batch.name !== batchName) {

                    return batch;
                }

                batch.chapters = batch.chapters.filter(chapter => chapter !== chapterName);

                return batch
            })
        );
    }

    return (

        <Paper sx={{maxWidth: '50vw', margin: '5vh auto'}}>
            <Typography > Story Batch Editor</Typography>
            <Add  onClick={onAddBatch}/>
            <Save  onClick={onSave}/>
            <Button>
                <Link to={'/timeline'}>
                    <Home />
                </Link>
            </Button>
            <List>
                {storyBatches.map(batch => (
                    <li key={`section-${batch.name}`}>
                        <ul>
                            <ItemInputSwitcher
                                    autoFocus={batch.name === autoFocusString}
                                    key={"switcher" + batch.name}
                                    value={batch.name}
                                    onAddItem={() => onAddChapter(batch.name)}
                                    onChange={(newValue) => updateBatchName(batch.name, newValue)} 
                                    onDeleteItem={() => deleteBatch(batch.name)}
                                    onMoveItem={(direction: Direction) => moveBatch(batch.name, direction)}
                                />
                            {batch.chapters.map((chapter) => (
                                <ItemInputSwitcher
                                    autoFocus={chapter === autoFocusString}
                                    key={"switcher" + chapter}
                                    nested
                                    value={chapter}
                                    onChange={(newValue) => updateChapterName(batch.name, chapter, newValue)} 
                                    onDeleteItem={() => deleteChapter(batch.name, chapter)}
                                    onMoveItem={(direction: Direction) => moveChapter(batch.name, chapter, direction)}
                                />
                            ))}
                        </ul>
                    </li>
                ))}
            </List>
        </Paper>
    );
};