import { CharacterAliasList, StoryBatch } from "@backend/api-types";
import { Edit } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

interface EditLinkButtonProps {
    link: string;
    state: CharacterAliasList[] | StoryBatch[];
}

export default function EditLinkButton ({link, state}: EditLinkButtonProps): any {
    return (
        <Button>
            <Link to={link} state={state}>
                <Edit />
            </Link>
        </Button>
    );
}