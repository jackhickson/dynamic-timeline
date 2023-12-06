import { CharacterAliasList } from "@backend/api-types";
import { Paper, List, Typography } from "@mui/material";
import ItemInputSwitcher from "../components/ItemInputSwitcher";
import { Direction, moveItemAtIndex } from "../utils";
import React from "react";
import { api } from "../axiosApi";
import { initialCharacterAliasList } from "../initial-elements";
import { Add, Save } from "@mui/icons-material";

const NEW_CHARACTER = "New Character"
const NEW_ALIAS = "New Alias"

interface CharacterAliasEditorProps {
    toggleMode: () => void;
}

export default function CharacterAliasEditor ({toggleMode}: CharacterAliasEditorProps): any {

    const [autoFocusString, setAutoFocusString] = React.useState<string>('')
    const [characterAliasList, setCharacterAliasList] = React.useState<CharacterAliasList[]>(initialCharacterAliasList);

    React.useEffect(() => {

        api.get("/characters").then((response) => {

            const data = response.data;

            setCharacterAliasList(data || []);
        });

    }, [])

    const onSave = () => {

        api.post("/save/characters", characterAliasList).then((response) => {

            console.info(response);
        });
    }

    const onAddCharacter = () => {

        if(characterAliasList.some(characterAlias => characterAlias.id === NEW_CHARACTER)) {
            console.warn(NEW_CHARACTER + " already exist")
            return
        }

        setAutoFocusString(NEW_CHARACTER);

        setCharacterAliasList(oldList => [...oldList, {id: NEW_CHARACTER, aliases: []}]);
    }

    const updateCharacterId = (oldCharacterId: string, newCharacterId:string) => {

        setAutoFocusString(newCharacterId);

        setCharacterAliasList((characterAliases) =>

            characterAliases.map(characterAlias => {

                if(characterAlias.id !== oldCharacterId) { 
                    return characterAlias
                }

                characterAlias.id = newCharacterId;

                return characterAlias;
            }).sort((a,b) => a.id.localeCompare(b.id))
        );
    }

    const deleteCharacter = (characterId: string) => {

        setCharacterAliasList(characterAliasList.filter(aliasList => aliasList.id !== characterId))
    }

    const onAddAlias = (characterId: string) => {

        setAutoFocusString(NEW_ALIAS);

        setCharacterAliasList((characterAliases) =>

            characterAliases.map(characterAlias => {

                if(characterAlias.id !== characterId) { 
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

                if(characterAlias.id !== characterId) { 
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

                if(characterAlias.id !== characterId) {

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

                if(characterAlias.id !== characterId) {

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
            <List>
                {characterAliasList.map(characterAlias => (
                    <li key={`section-${characterAlias.id}`}>
                        <ul>
                            <ItemInputSwitcher
                                    autoFocus={characterAlias.id === autoFocusString}
                                    key={"switcher" + characterAlias.id}
                                    value={characterAlias.id}
                                    onAddItem={() => onAddAlias(characterAlias.id)}
                                    onChange={(newValue) => updateCharacterId(characterAlias.id, newValue)} 
                                    onDeleteItem={() => deleteCharacter(characterAlias.id)}
                                />
                            {characterAlias.aliases.map((alias) => (
                                <ItemInputSwitcher
                                    autoFocus={alias === autoFocusString}
                                    key={"switcher" + alias}
                                    nested
                                    value={alias}
                                    onChange={(newValue) => updateAlias(characterAlias.id, alias, newValue)} 
                                    onDeleteItem={() => deleteAlias(characterAlias.id, alias)}
                                    onMoveItem={(direction: Direction) => moveAlias(characterAlias.id, alias, direction)}
                                />
                            ))}
                        </ul>
                    </li>
                ))}
            </List>
        </Paper>
    );
};