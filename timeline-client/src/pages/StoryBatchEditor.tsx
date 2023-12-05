import { useLocation } from "react-router-dom";
import { StoryBatch } from "@backend/api-types";
import { Paper, List, ListSubheader, ListItemText, MenuItem, Typography } from "@mui/material";

const stateToStoryBatches = (state: any): StoryBatch[] => {

    if(!state || !Array.isArray(state) || state.length === 0) {

        return [];
    }

    return state.map(a => a);
}
interface StoryBatchEditorProps {
    toggleMode: () => void;
}

export default function StoryBatchEditor ({toggleMode}: StoryBatchEditorProps): any {

    const state = useLocation().state;

    const storyBatches: StoryBatch[] = stateToStoryBatches(state);

    return (

        <Paper sx={{maxWidth: '50vw', margin: '5vh auto'}}>
            <Typography > Story Batch Editor</Typography>
            <List>
                {storyBatches.map(batch => (
                    <li key={`section-${batch.name}`}>
                        <ul>
                            <ListSubheader>{batch.name}</ListSubheader>
                            {batch.chapters.map((chapter) => (
                                <MenuItem key={chapter}>
                                    <ListItemText primary={chapter} />
                                </MenuItem>
                            ))}
                        </ul>
                    </li>
                ))}
            </List>
        </Paper>
    );
};