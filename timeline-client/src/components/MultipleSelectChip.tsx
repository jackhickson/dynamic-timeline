import React from 'react';
import { Theme, styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectProps } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { mapToSelectedCharacterAliases } from '../Definitions';
import { CharacterAliasList, SelectedCharacterAlias } from '@backend/api-types';
import { Accordion, AccordionDetails, AccordionSummary, FormControl, Grid, Typography } from '@mui/material';

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: '40vh',
    },
  },
};

function renderChips(selected: string[], selectedCharacterAliasMap: Map<string, string>) {

  return (<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
    {
      selected.map(id => {

        const selectedAlias = selectedCharacterAliasMap.get(id);

        if (!selectedAlias) {

          console.error(`Selected character alias ${id} could not be found`)
          return undefined;
        }

        return selectedAlias

      }).map((chipString) => (

        <Chip key={chipString + "chip"} label={chipString} />
      ))
    }
  </Box>
  )
}

type CharacterAccordionProps = {
  expandedAccordion: string | false;
  handleAccordianChange: (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
  characterAliases: CharacterAliasList;
  onSelectAlias: (id: string, alias: string) => void;
  selectedAlias: string | undefined;
  theme: Theme;
};

const CustomAccordion = styled(Accordion)`

  .MuiAccordionSummary-root.selectedCharacter {
    background-color: grey
  }

  .MuiMenuItem-root.selectedAlias {
    background-color: grey
  }
`;

const CharacterAccordion = (props: CharacterAccordionProps) => {

  const { expandedAccordion, handleAccordianChange, characterAliases, onSelectAlias, selectedAlias } = props;
  const { id, aliases } = characterAliases;

    // if there is atleast one alias then add id to list as when there are no alias the click to the toplevel Accordion will just set the id as the alias
  const alaisIdList = aliases.length > 0 ? [id].concat(aliases) : aliases

  const onExpandClick = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {

    // if there is only one alias it is the same as the id
    if(alaisIdList.length <= 1) {

      onSelectAlias(id, id)
    } else {

      handleAccordianChange(id)(event, isExpanded);
    }
  }

  const onAliasClick = (alias: string) => {

    onSelectAlias(id, alias)
  }

  return (
    <CustomAccordion key={id + "-accordion"} expanded={expandedAccordion === id} onChange={onExpandClick(id)}>
      <AccordionSummary
        expandIcon={alaisIdList.length !== 0 ? <ExpandMoreIcon />: null}
        aria-controls="panel1bh-content"
        id={id + "-header"}
        className={!!selectedAlias ? "selectedCharacter": undefined}
      >
        <Typography sx={{ width: '33%', flexShrink: 0 }}>
          {id}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container direction="column">
          {alaisIdList.map((alias) => (
            <MenuItem key={alias} onClick={() => onAliasClick(alias)} className={selectedAlias === alias? 'selectedAlias': undefined}>
              <Typography >{alias}</Typography>
            </MenuItem>
          ))}
        </Grid>
      </AccordionDetails>
  </CustomAccordion>
  );
};

type MultipleSelectChipProps = SelectProps<string[]> & {
  allCharacterAliases: CharacterAliasList[];
  map: Map<string, string>;
  onCharactersChange: (selectedAlias: SelectedCharacterAlias[]) => void;
}

export default function MultipleSelectChip(props: MultipleSelectChipProps) {

  const { id, allCharacterAliases, map, onCharactersChange, ...rest } = props;

  const [selectedCharacterAliasMap, setSelectedCharacterAliasMap] = React.useState<Map<string, string>>(map);
  const [expandedAccordion, setExpandedAccordion] = React.useState<string | false>(false);

  const handleAccordianChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {

    setExpandedAccordion(isExpanded ? panel : false);
  };

  const theme = useTheme();

  /**
   * handler for the nested items to set the correct alias
   * @param id 
   * @param incomingAlias 
   */
  const handleChange = (id: string, incomingAlias: string) => {

    const newCharacterMap = new Map<string, string>(selectedCharacterAliasMap);

    const currentAlias = newCharacterMap.get(id);

    if (currentAlias == incomingAlias) {

      // toggle if the same alias is clicked
      newCharacterMap.delete(id);

    } else {

      newCharacterMap.set(id, incomingAlias);
    }

    setSelectedCharacterAliasMap(newCharacterMap);

    onCharactersChange(mapToSelectedCharacterAliases(newCharacterMap));
  }

  return (
    <FormControl>
      <InputLabel id="multiple-chip-label">{id}</InputLabel>
      <Select
        labelId="-multiple-chip-label"
        multiple
        value={Array.from(selectedCharacterAliasMap.keys())}
        input={<OutlinedInput id="select-multiple-chip" label={id} />}
        renderValue={(selected) => (
          selected && renderChips(selected, selectedCharacterAliasMap)
        )}
        MenuProps={MenuProps}
        {...rest}
      >
        <div>
          {allCharacterAliases.map((characterAliases) => (
            <CharacterAccordion
              key={characterAliases.id + "accordion"}
              expandedAccordion={expandedAccordion}
              handleAccordianChange={handleAccordianChange}
              theme={theme}
              characterAliases={characterAliases}
              onSelectAlias={handleChange}
              selectedAlias={selectedCharacterAliasMap.get(characterAliases.id)}/>
          ))}
        </div>
      </Select>
    </FormControl>
  );
}