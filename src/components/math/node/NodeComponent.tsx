import { Box, Group, Paper, Text } from "@mantine/core";
import { MathNode } from "../../../types/model/node";
import { WithSetters } from "../../../types/utils";
import { AdditionNode } from "./types/AdditionNode";
import { TransformProvider } from "@/components/workspace/core/Transform";
import { DragHandle } from "@/components/workspace/util/DragHandle";
import { useState } from "react";
import { DefaultPosition, Position } from "@/types/scalar";
import { useSortable } from "@dnd-kit/sortable";
import { match } from "@alan404/enum";
import { MultiplicationNode } from "./types/MultiplicationNode";
import { ErrorCard } from "@/components/debug/ErrorCard";

export const SortableNodeComponent = ({
    node,
    setNode,
}: WithSetters<{ node: MathNode }>) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transition,
        transform,
    } = useSortable({
        id: node.id,
    });

    return (
        <TransformProvider
            value={transform || DefaultPosition}
            style={{
                transition,
                position: "unset",
            }}
            ref={setNodeRef}
            {...attributes}
            {...listeners}
        >
            <NodeComponent
                {...{ node, setNode }}
            />
        </TransformProvider>
    )
}

export const NodeComponent = ({
    node,
    setNode,
}: WithSetters<{ node: MathNode }>) => {
    const [position, setPosition] = useState<Position>(DefaultPosition);

    return (
        <Paper withBorder shadow="md" px="sm" py="xs" radius="md">
            {match(node)({
                Number: (n) => <Text>{n.toString()}</Text>,
                Variable: (v) => <Text>{v}</Text>,
                Addition: (v) => (
                    <AdditionNode
                        data={v}
                        onChange={(n) => setNode({
                            ...MathNode.Addition(n),
                            id: node.id,
                        })}
                    />
                ),
                Multiplication: (v) => (
                    <MultiplicationNode
                        data={v}
                        onChange={(n) => setNode({
                            ...MathNode.Multiplication(n),
                            id: node.id,
                        })}
                    />
                ),
                _: () => (
                    <ErrorCard
                        message="TODO"
                        description={node.type}
                    />
                ),
            }) as React.ReactNode}
        </Paper>
    )
};