import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, useTheme } from "@mui/material";
import React from "react";

interface CharacterSelectProps {
    allCharacters: string[];
    onCharacterIdChange: (event: SelectChangeEvent<string>) => void;
    selectedCharacterId: string;
}

const characterMenuRender = (allCharacters: string[], selectedCharacterName: string, theme: any) => {
    return allCharacters.map((characterName) => (
        <MenuItem
            key={"character-" + characterName}
            value={characterName}
            style={{fontWeight:
                characterName == selectedCharacterName
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium}}
        >
            {characterName}
        </MenuItem>
    ));
}

export default function CharacterSelect (props: CharacterSelectProps): any {

    const { allCharacters, onCharacterIdChange, selectedCharacterId } = props;

    const theme = useTheme()

    const characterMenu = React.useMemo(() => characterMenuRender(allCharacters, selectedCharacterId, theme),
        [allCharacters, selectedCharacterId, theme])

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