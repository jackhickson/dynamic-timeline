import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import styled from "styled-components";
import React, { ChangeEvent } from "react";
import { FLOW, CHARACTERALIASES, STORYBATCHES, TIMELINE, addDBNode, addDBEdge, addDBStoryBatch, addDBCharacterAlias } from "../firebaseUtils";
import { readUploadedFileAsJson } from "../utils";

interface ImportTimelineProps {
    toggleMode: () => void;
}

async function addFlowData(timelineName: string, data: any) {

    const nodes = data.nodes;
    const edges = data.edges;

    if(!nodes || !Array.isArray(nodes)) {
        console.error("Data does not have nodes property")
        return;
    }

    if(!edges || !Array.isArray(edges)) {
        console.error("Data does not have edges property")
        return;
    }

    for(const node of nodes) {
        addDBNode(timelineName, node);
    }

    for(const edge of edges) {
        addDBEdge(timelineName, edge);
    }
}

async function addCharacterAliases(timelineName: string, data: any) {

    if(!data || !Array.isArray(data)) {
        console.error("Character alias data is not an array")
        return;
    }

    for(const characterAlias of data) {
        addDBCharacterAlias(timelineName, characterAlias);
    }
}

async function addStoryBatches(timelineName: string, data: any) {

    if(!data || !Array.isArray(data)) {
        console.error("Story batch data is not an array")
        return;
    }

    for(const storyBatch of data) {
        addDBStoryBatch(timelineName, storyBatch);
    }
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

export default function ImportTimeline ({toggleMode}: ImportTimelineProps): any {

    const [timelineName, setTimelineName] = React.useState<string>("TheWanderingInn");

    const onTimelineNameChanged = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
    
        setTimelineName(value);
    }, [setTimelineName]);

    const onFileUploaded = React.useCallback( async (event: ChangeEvent<HTMLInputElement>) => {

        const files = event.target.files;

        if(!files || files.length === 0) {
            console.error("File not found!")
            return;
        }

        if(!timelineName) {
            console.error("Timeline name not set!")
            return;
        }

        try {

            const data = await readUploadedFileAsJson(files[0])

            const id = event.target.id;

            if(FLOW === id) {

                addFlowData(timelineName, data);

            } else if (CHARACTERALIASES === id) {

                addCharacterAliases(timelineName, data);

            } else if (STORYBATCHES === id) {

                addStoryBatches(timelineName, data);

            } else if (TIMELINE === id) {

            }

        } catch (e: any) {

            console.warn(e.message)
        }
    
    }, [timelineName]);

    return (
        <Paper sx={{maxWidth: '50vw', margin: '5vh auto'}}>
            <Typography > Story Batch Editor</Typography>
            <form>
                <Stack direction="column" spacing={2}>
                    <TextField id="timeline-name" 
                        label="Timeline Name"
                        fullWidth={true} 
                        required={true} 
                        error={!timelineName}
                        value={timelineName} 
                        onChange={onTimelineNameChanged}
                    />
                    <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                        Upload Flow json file
                        <VisuallyHiddenInput type="file" onChange={onFileUploaded} id={FLOW}/>
                    </Button>
                    <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                        Upload CharacterAlias json file
                        <VisuallyHiddenInput type="file" onChange={onFileUploaded} id={CHARACTERALIASES}/>
                    </Button>
                    <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                        Upload StoryBatch json file
                        <VisuallyHiddenInput type="file" onChange={onFileUploaded} id={STORYBATCHES}/>
                    </Button>
                    <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                        Upload full json for timeline
                        <VisuallyHiddenInput type="file" onChange={onFileUploaded} id={TIMELINE}/>
                    </Button>
                </Stack>
            </form>
        </Paper>
    );
};