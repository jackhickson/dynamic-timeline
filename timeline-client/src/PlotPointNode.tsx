import React, { memo } from 'react';
import { Handle, useReactFlow, useStoreApi, Position, Node } from 'reactflow';
import { PlotPointData } from './Definitions';

function PlotPointNode({ data  }: { data: PlotPointData}) {

    /*if(!(plotInfo instanceof PlotPointInfo)) {
        throw new Error("PlotPointInfo in incorrect format found: " + JSON.stringify(plotInfo, undefined, 2) + "\nneed object of: ");
    }*/

    return (
        <>
            <Handle
                type="target"
                position={Position.Left}
                style={{ background: '#555' }}
                onConnect={(params) => console.log('handle onConnect', params)}
                isConnectable={true}
            />
            <div className="custom-node__header">
               {data.label}
            </div>
            <Handle
                type="source"
                position={Position.Right}
                id="b"
                style={{ bottom: 10, top: 'auto', background: '#555' }}
                isConnectable={false}
            />
        </>
    );
}
  
export default memo(PlotPointNode);