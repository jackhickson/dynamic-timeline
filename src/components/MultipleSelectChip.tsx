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
import { CharacterAliasList, SelectedCharacterAlias } from '../api-types';
import { Accordion, AccordionDetails, AccordionSummary, FormControl, Grid, TextField, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';

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
  const { characterId, aliases } = characterAliases;

    // if there is atleast one alias then add id to list as when there are no alias the click to the toplevel Accordion will just set the id as the alias
  const alaisIdList = aliases.length > 0 ? [characterId].concat(aliases) : aliases

  const onExpandClick = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {

    // if there is only one alias it is the same as the id
    if(alaisIdList.length <= 1) {

      onSelectAlias(characterId, characterId)
    } else {

      handleAccordianChange(characterId)(event, isExpanded);
    }
  }

  const onAliasClick = (alias: string) => {

    onSelectAlias(characterId, alias)
  }

  return (
    <CustomAccordion key={characterId + "-accordion"} 
      expanded={expandedAccordion === characterId} 
      onChange={onExpandClick(characterId)}>
      <AccordionSummary
        expandIcon={alaisIdList.length !== 0 ? <ExpandMoreIcon />: null}
        aria-controls="panel1bh-content"
        id={characterId + "-header"}
        className={!!selectedAlias ? "selectedCharacter": undefined}
      >
        <Typography sx={{ width: '33%', flexShrink: 0 }}>
          {characterId}
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

const characterAliasRender = (characterAliasList: CharacterAliasList[], expandedAccordion: string | false,
  handleAccordianChange: (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => void,
  theme: any, handleChange: (characterId: string, incomingAlias: string) => void, selectedCharacterAliasMap: Map<string, string>) => {

  return characterAliasList.map((characterAliases) => (
    <CharacterAccordion
      key={characterAliases.characterId + "accordion"}
      expandedAccordion={expandedAccordion}
      handleAccordianChange={handleAccordianChange}
      theme={theme}
      characterAliases={characterAliases}
      onSelectAlias={handleChange}
      selectedAlias={selectedCharacterAliasMap.get(characterAliases.characterId)}/>
  ))
}

type MultipleSelectChipProps = SelectProps<string[]> & {
  allCharacterAliasList: CharacterAliasList[];
  map: Map<string, string>;
  onCharactersChange: (selectedAlias: SelectedCharacterAlias[]) => void;
}

export default function MultipleSelectChip(props: MultipleSelectChipProps) {

  const { id, allCharacterAliasList, map, onCharactersChange, ...rest } = props;

  const [searchString, setSearchString] = React.useState<string>('');
  const [characterAliasList, setCharacterAliasList] = React.useState<CharacterAliasList[]>(allCharacterAliasList);
  const [selectedCharacterAliasMap, setSelectedCharacterAliasMap] = React.useState<Map<string, string>>(map);
  const [expandedAccordion, setExpandedAccordion] = React.useState<string | false>(false);

  const handleAccordianChange = React.useCallback((panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {

    setExpandedAccordion(isExpanded ? panel : false);
  }, [setExpandedAccordion]);

  const theme = useTheme();

  /**
   * handler for the nested items to set the correct alias
   * @param id 
   * @param incomingAlias 
   */
  const handleChange = React.useCallback((id: string, incomingAlias: string) => {

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
  }, [selectedCharacterAliasMap, setSelectedCharacterAliasMap, onCharactersChange]);

  const searchCharacterIds = (event: React.ChangeEvent<HTMLInputElement>) => {

    const s = event.target.value;

    setSearchString(s);

    setCharacterAliasList(list => 
      list.filter((characterAlias) => {
        return characterAlias.characterId.toLowerCase().includes(s.toLowerCase());
      })
    )

    event.preventDefault();
  }

  const clearSearch = () => {

    setSearchString('')
    setCharacterAliasList(allCharacterAliasList)
  }

  const chracterAliasMenu = React.useMemo(() => characterAliasRender(characterAliasList, expandedAccordion,
    handleAccordianChange, theme, handleChange, selectedCharacterAliasMap)
    ,[characterAliasList, expandedAccordion, handleAccordianChange, theme, handleChange, selectedCharacterAliasMap]);

  const renderChipsCallBack = React.useCallback((selected: string[]) => 
    renderChips(selected, selectedCharacterAliasMap)
  ,[selectedCharacterAliasMap])

  return (
    <FormControl>
      <InputLabel id="multiple-chip-label">{id}</InputLabel>
      <Select
        labelId="-multiple-chip-label"
        multiple
        value={Array.from(selectedCharacterAliasMap.keys())}
        input={<OutlinedInput id="select-multiple-chip" label={id} />}
        renderValue={(selected) => (
          selected && renderChipsCallBack(selected)
        )}
        MenuProps={MenuProps}
        {...rest}
      >
        <div>
          <TextField id="item-input" 
                label="Search For Character" 
                variant="outlined"
                value={searchString}
                onChange={searchCharacterIds}
          />
          <Close onClick={clearSearch}/>
          {chracterAliasMenu}
        </div>
      </Select>
    </FormControl>
  );
}