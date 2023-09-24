import { useState } from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface MultipleSelectChipProps {
  id: string
  optionsList: string[];
  intialValues: string[];
}

function getStyles(option: string, selectedOptions: readonly string[], theme: Theme) {
  return {
    fontWeight:
      selectedOptions.indexOf(option) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelectChip(props: MultipleSelectChipProps) {

  const {id, optionsList, intialValues} = props;

  const theme = useTheme();
  const [selectedValues, setSelectedValues] = useState<string[]>(intialValues);

  const handleChange = (event: SelectChangeEvent<typeof selectedValues>) => {
    const {
      target: { value },
    } = event;
    setSelectedValues(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <>
      <InputLabel id="multiple-chip-label">{id}</InputLabel>
      <Select
        labelId="-multiple-chip-label"
        id={id}
        multiple
        value={selectedValues}
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
        {optionsList.map((option) => (
          <MenuItem
            key={option}
            value={option}
            style={getStyles(option, selectedValues, theme)}
          >
            {option}
          </MenuItem>
        ))}
      </Select>
    </>
  );
}