import ReactFlow, { MiniMap, Controls, ControlButton } from 'reactflow';
import styled from 'styled-components';

export const ReactFlowStyled = styled(ReactFlow)`
  background-color: ${(props) => props.theme.bg};
`;

export const MiniMapStyled = styled(MiniMap)`
  background-color: ${(props) => props.theme.bg};

  .react-flow__minimap-mask {
    fill: ${(props) => props.theme.minimapMaskBg};
  }
`;

const ControlsStyled = styled(Controls)`
  button {
    background-color: ${(props) => props.theme.controlsBg};
    color: ${(props) => props.theme.controlsColor};
    border-bottom: 1px solid ${(props) => props.theme.controlsBorder};

    &:hover {
      background-color: ${(props) => props.theme.controlsBgHover};
    }

    &.react-flow__controls-button {
      width: 68px;
    }

    path {
      fill: currentColor;
    }
  }
`;

interface ControlProps {
  onAddNode: () => void;
  onRedo:  () => void;
  onReset: () => void;
  onRestore: () => void;
  onSave: () => void;
  onUndo:  () => void;
}

// for some reason the style is not applying to this
export function CustomControls(props: ControlProps) {

  const {onAddNode, onRedo, onReset, onRestore, onSave, onUndo} = props;

  return (
    <ControlsStyled>
      <ControlButton onClick={onAddNode} title="Add new node" >
        <div>Add Node</div>
      </ControlButton>
      <ControlButton onClick={onRedo} title="Redo last change">
        <div>redo</div>
      </ControlButton>
      <ControlButton onClick={onUndo} title="Undo last change">
        <div>undo</div>
      </ControlButton>
      <ControlButton onClick={onReset} title="Reset graph">
        <div>reset</div>
      </ControlButton>
      <ControlButton onClick={onSave} title="Save graph">
        <div>save</div>
      </ControlButton>
      <ControlButton onClick={onRestore} title="Restore saved graph">
        <div>restore</div>
      </ControlButton>
    </ControlsStyled>
  );
}