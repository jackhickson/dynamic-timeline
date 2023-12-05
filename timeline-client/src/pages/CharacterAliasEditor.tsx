import { useLocation } from "react-router-dom";
import { CharacterAliasList } from "@backend/api-types";
import { Paper, List, ListSubheader, ListItemText, MenuItem, Typography } from "@mui/material";

const stateToCharacterAliasList = (state: any): CharacterAliasList[] => {

    if(!state || !Array.isArray(state) || state.length === 0) {

        return [];
    }

    return  state.map(a => a)
}

interface CharacterAliasEditorProps {
    toggleMode: () => void;
}

export default function CharacterAliasEditor ({toggleMode}: CharacterAliasEditorProps): any {

    const state = useLocation().state;

    const characterAliasList: CharacterAliasList[] = stateToCharacterAliasList(state);

    return (

        <Paper sx={{maxWidth: '50vw', margin: '5vh auto'}}>
            <Typography > Character Alias Editor</Typography>
            <List>
                {characterAliasList.map(characterAlias => (
                    <li key={`section-${characterAlias.id}`}>
                        <ul>
                            <ListSubheader>{characterAlias.id}</ListSubheader>
                            {characterAlias.aliases.map((alias) => (
                                <MenuItem key={alias}>
                                    <ListItemText primary={alias} />
                                </MenuItem>
                            ))}
                        </ul>
                    </li>
                ))}
            </List>
        </Paper>
    );
};