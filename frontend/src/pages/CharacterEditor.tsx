import { Paper, List, Typography, Button } from "@mui/material";
import ItemInputSwitcher from "../components/ItemInputSwitcher";
import React from "react";
import { initialCharacters } from "../initial-elements";
import { Add, Home, Save } from "@mui/icons-material";
import { Link } from "react-router-dom";
import EditorPage from "../components/EditorPage";

const NEW_CHARACTER = "New Character"

interface CharacterEditorProps {
    toggleMode: () => void;
}

export default function CharacterEditor({ toggleMode }: CharacterEditorProps): any {

    const [autoFocusString, setAutoFocusString] = React.useState<string>('')
    const [allCharacters, setAllCharacters] = React.useState<string[]>(initialCharacters);

    React.useEffect(() => {

    }, [])

    const onSave = () => {

    }

    const onAddCharacter = () => {

        if (allCharacters.some(character => character === NEW_CHARACTER)) {
            console.warn(NEW_CHARACTER + " already exist")
            return
        }

        setAutoFocusString(NEW_CHARACTER);

        setAllCharacters(oldList => [...oldList, NEW_CHARACTER]);
    }

    const updateCharacterId = (oldCharacterId: string, newCharacterId: string) => {

        const upperCasedCharacterId =   newCharacterId.split('').map((char, index) =>
            index === 0 ? char.toUpperCase() : char).join('')
        
        setAutoFocusString(upperCasedCharacterId);

        setAllCharacters((characters) =>

            characters.map(character => {

                if (character !== oldCharacterId) {
                    return character
                }

                return upperCasedCharacterId;

            }).sort()
        );
    }

    const deleteCharacter = (characterId: string) => {

        setAllCharacters(allCharacters.filter(character => character !== characterId))
    }

    return (

        <EditorPage>
            <Paper sx={{ maxWidth: '50vw', margin: '5vh auto' }}>
                <Typography >Character Editor</Typography>
                <Add onClick={onAddCharacter} />
                <Save onClick={onSave} />
                <Button>
                    <Link to={'/timeline'}>
                        <Home />
                    </Link>
                </Button>
                <List>
                    {allCharacters.map(character => (
                        <li key={`section-${character}`}>
                            <ul>
                                <ItemInputSwitcher
                                    autoFocus={character === autoFocusString}
                                    key={"switcher" + character}
                                    value={character}
                                    onChange={(newValue) => updateCharacterId(character, newValue)}
                                    onDeleteItem={() => deleteCharacter(character)}
                                />
                            </ul>
                        </li>
                    ))}
                </List>
            </Paper>
        </EditorPage>
    );
};