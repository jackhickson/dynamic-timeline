import React from "react";
import { CharacterAliasList } from "@backend/api-types";

interface UseCharactersAliasList {
    initialChapterAliasList: CharacterAliasList[];
};

export const useCharactersAliasList = (props: UseCharactersAliasList) => {

    const [charactersAliasList, setCharactersAliasList] = React.useState(props.initialChapterAliasList);
    const [selectedCharacterId, setSelectedCharacterId] = React.useState<string>('');
    
    React.useEffect(()=> {

        // if the alias do not contain the id, reset the selected
        if(charactersAliasList.some(alias => alias.id == selectedCharacterId)) {
            setSelectedCharacterId('')
        }

    }, [charactersAliasList, selectedCharacterId, setSelectedCharacterId] );

  return { charactersAliasList, setCharactersAliasList, selectedCharacterId, setSelectedCharacterId };
};