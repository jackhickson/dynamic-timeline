import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, useTheme } from "@mui/material";
import { CharacterAliasList } from "../api-types";
import React from "react";

interface CharacterSelectProps {
    allCharacterAliasList: CharacterAliasList[];
    onCharacterIdChange: (event: SelectChangeEvent<string>) => void;
    selectedCharacterId: string;
}

const characterMenuRender = (allCharacterAliasList: CharacterAliasList[], selectedCharacterId: string, theme: any) => {
    return allCharacterAliasList.map((alias) => (
        <MenuItem
            key={"alias-" + alias.id}
            value={alias.id}
            style={{fontWeight:
                alias.id == selectedCharacterId
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium}}
        >
            {alias.id}
        </MenuItem>
    ));
}

export default function CharacterSelect (props: CharacterSelectProps): any {

    const { allCharacterAliasList, onCharacterIdChange, selectedCharacterId } = props;

    const theme = useTheme()

    const characterMenu = React.useMemo(() => characterMenuRender(allCharacterAliasList, selectedCharacterId, theme),
        [allCharacterAliasList, selectedCharacterId, theme])

    return (

        <FormControl>
            <InputLabel htmlFor="character-select">Character</InputLabel>
            <Select
                labelId="character-select"
                id="character-select"
                value={selectedCharacterId}
                label="Character Select"
                onChange={onCharacterIdChange}
                sx={{ width: '15vw'}}
                >
                {characterMenu}
            </Select>
        </FormControl>
    );
}