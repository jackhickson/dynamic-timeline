import React, { memo, useMemo } from 'react';
import { Handle, useReactFlow, useStoreApi, Position, Node, NodeProps } from 'reactflow';
import { ChapterAction, PlotPointData } from '../Definitions';

import './PlotPointNode.scss';

function PlotPointNode(props: NodeProps<PlotPointData>) {

    const { data } = props;

    const action = data.chapterAction;

    const colorClass = useMemo(
        () => {
            let colorClass = 'none';

            // for some reason the nodes dont update when the data changes so this isnt working right now
            /*if( data.chapterAction == ChapterAction.Added) {
                colorClass = 'added'
            } else if (data.chapterAction == ChapterAction.Modified) {
                colorClass = 'modified';
            }

            console.info(colorClass);*/

            return colorClass;
        },
        [action]
    );

    return (
        <div className={colorClass}>
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
        </div>
    );
}
  
export default memo(PlotPointNode);