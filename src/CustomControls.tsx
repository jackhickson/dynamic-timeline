import { Controls, ControlButton, Node } from 'reactflow';
import 'reactflow/dist/style.css';

export default function CustomControls(nodes: Node[]) {
  return (
    <Controls>
      <ControlButton onClick={() => console.log(nodes)} title="action">
        <div>Save</div>
      </ControlButton>
    </Controls>
  );
}