import { CharacterAliasList, StoryBatch } from "@backend/api-types";
import { Edit } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

interface EditLinkButtonProps {
    link: string;
}

export default function EditLinkButton ({link}: EditLinkButtonProps): any {
    return (
        <Button>
            <Link to={link}>
                <Edit />
            </Link>
        </Button>
    );
}