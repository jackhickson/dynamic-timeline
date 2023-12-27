import { CharacterAliasList } from "../api-types";
import { Paper, List, Typography, Button } from "@mui/material";
import ItemInputSwitcher from "../components/ItemInputSwitcher";
import { Direction, moveItemAtIndex } from "../utils";
import React from "react";
import { initialCharacterAliasList } from "../initial-elements";
import { Add, Home, Save } from "@mui/icons-material";
import { Link } from "react-router-dom";

const NEW_CHARACTER = "New Character"
const NEW_ALIAS = "New Alias"

interface CharacterAliasEditorProps {
    toggleMode: () => void;
}

export default function CharacterAliasEditor ({toggleMode}: CharacterAliasEditorProps): any {

    const [autoFocusString, setAutoFocusString] = React.useState<string>('')
    const [characterAliasList, setCharacterAliasList] = React.useState<CharacterAliasList[]>(initialCharacterAliasList);

    React.useEffect(() => {

    }, [])

    const onSave = () => {

    }

    const onAddCharacter = () => {

        if(characterAliasList.some(characterAlias => characterAlias.characterId === NEW_CHARACTER)) {
            console.warn(NEW_CHARACTER + " already exist")
            return
        }

        setAutoFocusString(NEW_CHARACTER);

        setCharacterAliasList(oldList => [...oldList, {characterId: NEW_CHARACTER, aliases: []}]);
    }

    const updateCharacterId = (oldCharacterId: string, newCharacterId:string) => {

        setAutoFocusString(newCharacterId);

        setCharacterAliasList((characterAliases) =>

            characterAliases.map(characterAlias => {

                if(characterAlias.characterId !== oldCharacterId) { 
                    return characterAlias
                }

                characterAlias.characterId = newCharacterId;

                return characterAlias;
            }).sort((a,b) => a.characterId.localeCompare(b.characterId))
        );
    }

    const deleteCharacter = (characterId: string) => {

        setCharacterAliasList(characterAliasList.filter(aliasList => aliasList.characterId !== characterId))
    }

    const onAddAlias = (characterId: string) => {

        setAutoFocusString(NEW_ALIAS);

        setCharacterAliasList((characterAliases) =>

            characterAliases.map(characterAlias => {

                if(characterAlias.characterId !== characterId) { 
                    return characterAlias
                }

                if(characterAlias.aliases.some(alias => alias === NEW_ALIAS)) {

                    console.warn(NEW_ALIAS + " already exist")

                } else {

                    characterAlias.aliases.push(NEW_ALIAS)
                }

                return characterAlias;
            })
        );
    }

    const moveAlias = (characterId: string, aliasName: string, direction: Direction) => {

        setCharacterAliasList((characterAliases) =>

            characterAliases.map(characterAlias => {

                if(characterAlias.characterId !== characterId) { 
                    return characterAlias
                }

                const index = characterAlias.aliases.findIndex(alais => alais === aliasName);

                const aliases = moveItemAtIndex(characterAlias.aliases, index, direction);

                if(!!aliases) {
                    characterAlias.aliases = aliases;
                }

                return characterAlias;
            })
        );
    }

    const updateAlias = (characterId: string, oldAlias: string, newAlias: string) => {

        setAutoFocusString(newAlias);

        setCharacterAliasList((characterAliases) =>

            characterAliases.map(characterAlias => {

                if(characterAlias.characterId !== characterId) {

                    return characterAlias;
                }

                const index = characterAlias.aliases.findIndex(alais => alais === oldAlias);

                characterAlias.aliases[index] = newAlias

                return characterAlias;

            })
        );  
    }

    const deleteAlias = (characterId: string, alias: string) => {

        setCharacterAliasList((characterAliases) =>

            characterAliases.map(characterAlias => {

                if(characterAlias.characterId !== characterId) {

                    return characterAlias;
                }

                characterAlias.aliases = characterAlias.aliases.filter(alias => alias !== characterId);

                return characterAlias
            })
        );
    }

    return (

        <Paper sx={{maxWidth: '50vw', margin: '5vh auto'}}>
            <Typography > Story Batch Editor</Typography>
            <Add  onClick={onAddCharacter}/>
            <Save  onClick={onSave}/>
            <Button>
                <Link to={'/timeline'}>
                    <Home />
                </Link>
            </Button>
            <List>
                {characterAliasList.map(characterAlias => (
                    <li key={`section-${characterAlias.characterId}`}>
                        <ul>
                            <ItemInputSwitcher
                                    autoFocus={characterAlias.characterId === autoFocusString}
                                    key={"switcher" + characterAlias.characterId}
                                    value={characterAlias.characterId}
                                    onAddItem={() => onAddAlias(characterAlias.characterId)}
                                    onChange={(newValue) => updateCharacterId(characterAlias.characterId, newValue)} 
                                    onDeleteItem={() => deleteCharacter(characterAlias.characterId)}
                                />
                            {characterAlias.aliases.map((alias) => (
                                <ItemInputSwitcher
                                    autoFocus={alias === autoFocusString}
                                    key={"switcher" + alias}
                                    nested
                                    value={alias}
                                    onChange={(newValue) => updateAlias(characterAlias.characterId, alias, newValue)} 
                                    onDeleteItem={() => deleteAlias(characterAlias.characterId, alias)}
                                    onMoveItem={(direction: Direction) => moveAlias(characterAlias.characterId, alias, direction)}
                                />
                            ))}
                        </ul>
                    </li>
                ))}
            </List>
        </Paper>
    );
};