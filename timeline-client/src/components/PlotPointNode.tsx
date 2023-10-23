import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ChapterAction, PlotPointData } from '../Definitions';
import styled from 'styled-components';

const nodeBackGroundStyle = (action: ChapterAction, theme: any): string => {

    let backgroundColor = theme.nodeBg;

    if(action == ChapterAction.Added) {
        backgroundColor = theme.nodeAdded;
    } else if( action == ChapterAction.Modified) {
        backgroundColor = theme.nodeModified;
    } else if (action == ChapterAction.None) {
        backgroundColor = theme.nodeNone;
    }

    return backgroundColor;
}

const Node = styled.div<{ selected: boolean; action: ChapterAction, inCharacterTimeLine: boolean}>`
    padding: 10px 20px;
    border-radius: 5px;
    background: ${(props) => nodeBackGroundStyle(props.action, props.theme)};
    color: ${(props) => props.theme.nodeColor};
    border: 1px solid ${(props) => (props.selected ? props.theme.primary : props.theme.nodeBorder)};

    .react-flow__handle {
        background: ${(props) => props.theme.primary};
        width: 8px;
        height: 10px;
        border-radius: 3px;
    }
`;

function PlotPointNode(props: NodeProps<PlotPointData>) {

    const { data, selected } = props;

    const action = data.chapterAction;

    const inCharacterTimeLine = data.inCharacterTimeline;

    return (
        <Node selected={selected} action={action} inCharacterTimeLine={inCharacterTimeLine}>
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