import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import styled from 'styled-components';

const Node = styled.div`
    padding: 10px 20px;
    border-radius: 5px;
    background: ${(props) => props.theme.nodeBg};
    color: ${(props) => props.theme.nodeColor};
    border: 1px solid ${(props) => props.theme.nodeBorder};

    .react-flow__handle {
        background: ${(props) => props.theme.primary};
        width: 8px;
        height: 10px;
        border-radius: 3px;
    }
`;

function PlotPointNode(props: NodeProps) {

    const { data } = props;

    return (
        <Node>
            <Handle
                type="target"
                position={Position.Left}
                style={{ background: '#555' }}
                isConnectable={true}
            />
            <div className="custom-node__header">
               {data.label}
            </div>
            <Handle
                type="source"
                position={Position.Right}
                style={{ background: '#555' }}
                isConnectable={true}
            />
        </Node>
    );
}
  
export default memo(PlotPointNode);