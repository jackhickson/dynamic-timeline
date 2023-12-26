import { Add, ArrowDownward, ArrowUpward, Check, Close, Delete, Edit } from "@mui/icons-material";
import { ListItemText, MenuItem, TextField } from "@mui/material";
import React from "react";
import { Direction } from "../utils";
import styled from "styled-components";

interface CustomMenuItemProps {
    value: string;
    showIcons: boolean;
    handleStartEdit: () => void;
    onAddItem: (() => void) | null | undefined;
    onDeleteItem: () => void;
    onMove?: (direction: Direction) => void;
}

const CustomMenuItem = (props: CustomMenuItemProps) => {

    const {value, showIcons, handleStartEdit, onAddItem, onDeleteItem, onMove} = props

    return (
        <>
            <ListItemText primary={value} />
            {  
                showIcons && 
                <>
                    {!!onMove &&
                        <>
                            <ArrowUpward onClick={() => onMove(Direction.UP)}/>
                            <ArrowDownward onClick={() => onMove(Direction.DOWN)}/>
                        </>
                    }
                    {!!onAddItem && <Add  onClick={onAddItem}/>}
                    <Edit onClick={handleStartEdit}/>
                    <Delete onClick={onDeleteItem}/>
                </>
            }
        </>
    );
}

interface CustomInputProps {
    value: string;
    hadleSaveValue: (value: string) => void;
    handleStopEdit: () => void;
}

const CustomInput = (props: CustomInputProps) => {

    const {hadleSaveValue, handleStopEdit} = props;

    const [s, setS] = React.useState(props.value);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setS(event.target.value);
    }

    return (
        <>
            <TextField id="item-input" 
                label="Value" 
                variant="outlined" 
                defaultValue={s}
                onChange={onChange} 
                size="small"/>
            <Check onClick={() => {hadleSaveValue(s)}}/>
            <Close onClick={handleStopEdit}/>
        </>
    );
}

const Wrapper = styled(MenuItem)`
    &:focus {
        animation: focusing 2s;
    }
    
    @keyframes focusing {
        from {background-color: grey;}
        to {background-color: unset;}
    }
`

interface ItemInputSwitcherProps {
    value: string;
    nested?: boolean;
    onAddItem?: () => void;
    onChange: (newValue: string) => void;
    onDeleteItem: () => void;
    onMoveItem?: (direction: Direction) => void;
    autoFocus?: boolean;
}

export default function ItemInputSwitcher(props: ItemInputSwitcherProps) {

    const { autoFocus, nested, value, onAddItem, onChange, onDeleteItem, onMoveItem } = props;

    const [editing, setEditing] = React.useState<boolean>(false);
    const [showIcons, setShowIcons] = React.useState<boolean>(false);

    const hadleStartEdit = () => {
        setEditing(true);
    }

    const handleStopEdit = () => {
        setEditing(false);
    }

    const hadleSaveValue = (value: string) => {
        onChange(value);
        setEditing(false);
    }

    return (

        <Wrapper 
            onMouseEnter={() => setShowIcons(true)} 
            onMouseLeave={() => setShowIcons(false)} 
            sx={{marginLeft: !!nested ? "10px" : null}} 
            autoFocus={autoFocus}
        >
            {editing ?

                <CustomInput 
                    value={value}
                    hadleSaveValue={hadleSaveValue} 
                    handleStopEdit={handleStopEdit}
                /> :
    
                <CustomMenuItem 
                    value={value}
                    showIcons={showIcons}
                    handleStartEdit={hadleStartEdit}
                    onAddItem={onAddItem}
                    onDeleteItem={onDeleteItem} 
                    onMove={onMoveItem}
                />
            }
        </Wrapper>
    );
}