import { MouseEventHandler, useRef, useState } from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { CharacterAliases, SelectedCharacterAlias, mapToSelectedCharacterAliases } from '../Definitions';
import Popper, { PopperProps } from '@mui/material/Popper';
import { MenuList, Paper } from '@mui/material';

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

function getStyles(option: string, selectedOptions: Map<string, string>, theme: Theme) {
  return {
    fontWeight:
      selectedOptions.get(option) === undefined
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function getStylesOfAliases(option: string, selectedOptions: string[], theme: Theme) {
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
  onSelectAlias: (id: string, alias: string) => void;
  selectedAlias: string | undefined;
  theme: Theme;
} & Pick<PopperProps, "placement">;

const NestedAliasMenuItem = (props: NestedAliasMenuItemProps) => {

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement | null>(null);

  const { characterAliases, button, label, onSelectAlias, selectedAlias, ...supProps } = props;
  const { id, aliases } = characterAliases;

  const onClick = (value: string) => {
    onSelectAlias(id, value)
  }

  return (
    <MenuItem
      {...supProps}
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
        style={{ zIndex: 10000 }}
      >
        <Paper>
          <MenuList>

            {aliases.map((alias) => (

              <MenuItem
                key={"character-" + id + alias}
                value={alias}
                style={getStylesOfAliases(alias, aliases, props.theme)}
                // calculate selected
                onClick={(() => onClick(alias))}
              >
                {alias}
              </MenuItem>
            ))}

          </MenuList>
        </Paper>


      </Popper>
    </MenuItem>
  );
};

interface MultipleSelectChipProps {
  id: string
  allCharacterAliases: CharacterAliases[];
  map: Map<string, string>;
  onCharactersChange: (selectedAlias: SelectedCharacterAlias[]) => void;
}

export default function MultipleSelectChip(props: MultipleSelectChipProps) {

  const { id, allCharacterAliases, map, onCharactersChange } = props;

  const [selectedCharacterAliasMap, setSelectedCharacterAliasMap] = useState<Map<string, string>>(map);

  let changeFromNested = false;

  const theme = useTheme();

  const handleChange = (newCharacterMap: Map<string, string>) => {

    setSelectedCharacterAliasMap(newCharacterMap);

    onCharactersChange(mapToSelectedCharacterAliases(newCharacterMap));
  }

  const handleRealNameChange = (event: SelectChangeEvent<string[]>) => {

    event.preventDefault();

    // if a click comes from the nested menu then it will bubble to here but that is not wanted
    if(changeFromNested) {

      changeFromNested = false;
      return;
    }

    let { target: { value } } = event;

    // incoming value can be csv
    if (typeof value === 'string') {

      value = value.split(',');
    }

    const newMap = new Map<string, string>();
    value.forEach((s) => newMap.set(s, s))

    handleChange(newMap);
  };

  /**
   * handler for the nested items to set the correct alias
   * @param id 
   * @param incomingAlias 
   */
  const handleNestedChange = (id: string, incomingAlias: string) => {

    const newMap = new Map<string, string>(selectedCharacterAliasMap);

    const currentAlias = newMap.get(id);

    if(currentAlias == incomingAlias) {

      // toggle if the same alias is clicked
      newMap.delete(id);

    } else {

      newMap.set(id, incomingAlias);
    }

    console.info("nested", id, incomingAlias, newMap)

    // let the select handle to ignore this event
    changeFromNested = true;

    handleChange(newMap);
  }

  return (
    <>
      <InputLabel id="multiple-chip-label">{id}</InputLabel>
      <Select
        labelId="-multiple-chip-label"
        id={id}
        multiple
        value={Array.from(selectedCharacterAliasMap.keys())}
        onChange={handleRealNameChange}
        input={<OutlinedInput id="select-multiple-chip" label={id} />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map(id => {

              const selectedAlias = selectedCharacterAliasMap.get(id);

              if (!selectedAlias) {

                console.error(`Selected character alias ${id} could not be found`)
                return "NotFound";
              }

              return selectedAlias

            }).map((chipString) => (

              <Chip key={chipString} label={chipString} />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {allCharacterAliases.map((characterAliases) => (
          // need to make this a custom menu item
          <NestedAliasMenuItem
            key={"character-" + characterAliases.id}
            value={characterAliases.id}
            style={getStyles(characterAliases.id, selectedCharacterAliasMap, theme)}
            theme={theme}
            label={characterAliases.id}
            characterAliases={characterAliases}
            onSelectAlias={handleNestedChange}
            selectedAlias={selectedCharacterAliasMap.get(characterAliases.id)}
          />
        ))}
      </Select>
    </>
  );
}