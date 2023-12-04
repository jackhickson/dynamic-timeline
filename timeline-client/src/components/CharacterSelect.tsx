import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, useTheme } from "@mui/material";
import { CharacterAliasList } from "@backend/api-types";

interface CharacterSelectProps {
    allCharactersAlias: CharacterAliasList[];
    onCharacterIdChange: (event: SelectChangeEvent<string>) => void;
    selectedCharacterId: string;
}

export default function CharacterSelect (props: CharacterSelectProps): any {

    const { allCharactersAlias, onCharacterIdChange, selectedCharacterId } = props;

    const theme = useTheme()

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
                {allCharactersAlias.map((alias) => (
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
                ))}
            </Select>
        </FormControl>
    );
}