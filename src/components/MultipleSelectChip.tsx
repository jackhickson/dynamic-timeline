import React from 'react';
import { Theme, styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select';
import Chip from '@mui/material/Chip';

import { FormControl, Grid, TextField, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: '40vh',
    },
  },
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

type MultipleSelectChipProps = SelectProps<string[]> & {
  allCharacters: string[];
  selectedCharacters: string[];
  onCharactersChange: (selectedCharacters: string[]) => void;
}

export default function MultipleSelectChip(props: MultipleSelectChipProps) {

  const { id, allCharacters, selectedCharacters, onCharactersChange } = props;

  //const [searchString, setSearchString] = React.useState<string>('');
  //const [characterList, setCharacterList] = React.useState<string[]>(allCharacters);

  const theme = useTheme();

  /**
   * add the character to the list
   * @param id 
   */
  const handleChange = React.useCallback((event: SelectChangeEvent<typeof selectedCharacters>) => {

    let value = event.target.value
    let newValue = typeof value === 'string' ? value.split(',') : value

    onCharactersChange(newValue);
  }, [selectedCharacters, onCharactersChange]);

  /*const searchCharacterIds = (event: React.ChangeEvent<HTMLInputElement>) => {

    const s = event.target.value;

    setSearchString(s);

    setCharacterList(characterList => 
      characterList.filter((character) => {
        return character.toLowerCase().includes(s.toLowerCase());
      })
    )

    event.preventDefault();
  }

  const clearSearch = () => {

    setSearchString('')
    setCharacterList(allCharacters)
  }*/

  return (
    <FormControl>
      <InputLabel id="multiple-chip-label">{id}</InputLabel>
      <Select
          labelId="multiple-chip-label"
          id="multiple-chip"
          multiple
          value={selectedCharacters}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label={id} />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {allCharacters.map((character) => (
            <MenuItem
              key={character}
              value={character}
              style={getStyles(character, selectedCharacters, theme)}
            >
              {character}
            </MenuItem>
          ))}
        </Select>
    </FormControl>
  );
}