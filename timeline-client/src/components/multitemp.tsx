import { MouseEventHandler, useRef, useState } from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { CharacterAliases, SelectedCharacterAlias } from '../Definitions';
import Popper, { PopperProps } from '@mui/material/Popper';
import { MenuList } from '@mui/material';

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

function getStyles(option: string, selectedOptions: readonly string[], theme: Theme) {
  return {
    fontWeight:
      selectedOptions.indexOf(option) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

type NestedAliasMenuItemProps = MenuItemProps & {
  characterAliases: CharacterAliases;
  button?: true;
  label: string;
  onSelectAlias: (id:string, alias:string) => null;
  selectedValue: string;
  theme: Theme;
} & Pick<PopperProps, "placement">;

const NestedAliasMenuItem = (props: NestedAliasMenuItemProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement | null>(null);

  const { characterAliases, button, label, selectedValue} = props;
  const {id, aliases} = characterAliases;

  const onClick = ( event: any) => {
    event.preventDefault;
    console.info(event);
    //onSelectAlias
  }

  return (
    <MenuItem
      {...props}
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      // onFocus={() => setOpen(true)}
      // onBlur={() => setOpen(false)}
      onMouseLeave={() => setOpen(false)}
    >
      <span>{props.label}</span>
      <Popper
        anchorEl={ref.current}
        open={open}
        placement={props.placement ?? "right"}
      >
        
        <MenuList>

          {aliases.map((alias) => (
            
            <MenuItem
              key={"character-" + id + alias}
              value={alias}
              style={getStyles(alias, aliases, props.theme)}
              // calculate selected
              onClick={onClick}
              >
              {alias}
            </MenuItem>
          ))}

        </MenuList>
      </Popper>
    </MenuItem>
  );
};

interface MultipleSelectChipProps {
  id: string
  allCharacterAliases: CharacterAliases[];
  selectedCharacterAliases: SelectedCharacterAlias[];
}

export default function MultipleSelectChip(props: MultipleSelectChipProps) {

  const {id, allCharacterAliases} = props;

  const [selectedCharacterAliases, setSelectedCharacterAliases] = useState<SelectedCharacterAlias[]>([]);

  let selectedIds = selectedCharacterAliases.map(alias => alias.id);

  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    let {
      target: { value },
    } = event;

    // On autofill we get a stringified value.
    selectedIds = typeof value === 'string' ? value.split(',') : value

    if(typeof value === 'string') {

      value = value.split(',');
    } 

    setSelectedCharacterAliases(value.map(value => {return {id: value, alias: value}}));
  };

  /**
   * handler for the nested items to set the correct alias
   * @param id 
   * @param alias 
   */
  const handleNestedChange = (id: string, alias: string) => {

    let foundAndModified = false;

    for(let selectedCharacterAlias of selectedCharacterAliases) {

      if(selectedCharacterAlias.id == id) {

        selectedCharacterAlias.alias = alias;

        foundAndModified = true;
      }
    }

    // if there is no selected alias for this id then add one
    if(!foundAndModified) {

      selectedCharacterAliases.push({id, alias});
    }

    setSelectedCharacterAliases(selectedCharacterAliases);
  }

  // when selecting a character name or alias it will set a SelectedCharacterAlias in the selected[]
  // it will be mapped into just the alias ids for cunsumption by the select. This will work with the normal list as the normal will just be the ids
  // the custom MenuItem will have a hoverOn and will open a popover menu to select the aliases
  // the onClick will set the SelectedCharacterAlias
  // refernce the SelectedCharacterAlias[] by the id in the renderValue to get the alias

  return (
    <>
      <InputLabel id="multiple-chip-label">{id}</InputLabel>
      <Select
        labelId="-multiple-chip-label"
        id={id}
        multiple
        value={selectedIds}
        onChange={handleChange}
        input={<OutlinedInput id="select-multiple-chip" label={id} />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map(id => {

              const selectedAlias = selectedCharacterAliases.find(selectedAlias => selectedAlias.id == id)

              if(!selectedAlias) {

                console.error(`Selected character alias ${id} could not be found`)
                return "NotFound";
              }
  
              return selectedAlias.alias

          }).map((chipString) => (

              <Chip key={chipString} label={chipString} />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {allCharacterAliases.map((characterAliases) => (
          // need to make this a custom menu item
          <MenuItem
            key={"character-" + characterAliases.id}
            value={characterAliases.id}
            style={getStyles(characterAliases.id, selectedIds, theme)}
            >
            {characterAliases.id}
          </MenuItem>
        ))}
      </Select>
    </>
  );
}