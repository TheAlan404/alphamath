import React, { PropsWithChildren, useState } from "react";
import { useUncontrolled } from "@mantine/hooks";
import { DefaultPosition, Position } from "../../types/scalar";
import { WithSetters } from "../../types/utils";
import { noop } from "@mantine/core";

export interface ITransform {
    position: Position;
}

const Transform = React.createContext<WithSetters<ITransform>>({
    position: DefaultPosition,
    setPosition: noop,
});

const TransformProvider = ({
    children,
    defaultValue,
    onChange,
    value,
}: {
    defaultValue?: Position,
    value?: Position,
    onChange?: (pos: Position) => void,
} & PropsWithChildren) => {
    let [position, setPosition] = useUncontrolled<Position>({
        value,
        defaultValue,
        finalValue: { x: 0, y: 0 },
        onChange,
    });
    
    return (
        <Transform.Provider value={{
            position,
            setPosition,
        }}>
            <div style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                position: "absolute"
            }}>
                {children}
            </div>
        </Transform.Provider>
    );
}

export {
    Transform,
    TransformProvider,
}