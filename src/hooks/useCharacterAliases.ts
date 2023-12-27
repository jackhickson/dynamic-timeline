import React from "react";
import { CharacterAliasList } from "../api-types";

interface UseCharactersAliasList {
    initialCharacterAliasList: CharacterAliasList[];
};

export const useCharactersAliasList = (props: UseCharactersAliasList) => {

    const [charactersAliasList, setCharactersAliasList] = React.useState(props.initialCharacterAliasList);
    const [selectedCharacterId, setSelectedCharacterId] = React.useState<string>('');
    
    React.useEffect(()=> {

        // if the alias do not contain the id, reset the selected
        if(!charactersAliasList.some(alias => alias.characterId === selectedCharacterId)) {

            setSelectedCharacterId('')
        }

    }, [charactersAliasList, selectedCharacterId, setSelectedCharacterId] );

  return { charactersAliasList, setCharactersAliasList, selectedCharacterId, setSelectedCharacterId };
};