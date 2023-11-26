import { useContext, useId } from "react";
import { NodeContext, OptionsContext } from "../../contexts";
import { useDroppable } from "@dnd-kit/core";
import { Plus } from "../../glyphs";
import { NodeComponent } from "./Node";
import { Group } from "@mantine/core";

const AdditionNode = () => {
    let [{ hidePlusIfNegated }] = useContext(OptionsContext);
    let { value, setValue } = useContext(NodeContext);
    // Dnd kit stuff
    let id = useId();
    const { isOver, setNodeRef } = useDroppable({
        id,
        data: {
            value,
        },
    });

    // Node stuff
    let elements = [];

    let prev;
    for (let idx = 0; idx < value.data.length; idx++) {
        let node = value.data[idx];

        if (prev && (hidePlusIfNegated ? node.type != "Negated" : true)) {
            elements.push(<Plus />);
        }

        //elements.push(<Gap visible={isOver} />);

        elements.push(<NodeComponent
            value={node}
            onChange={(v) => setValue({
                type: value.type,
                data: value.data.map((t, i) => i == idx ? v : t)
            })} />);

        prev = node;
    }

    return (
        <Group ref={setNodeRef} wrap="nowrap" bg={isOver ? "dark" : ""}>
            {elements.map((el, i) => (<div key={i}>{el}</div>))}
        </Group>
    );
};

export default AdditionNode;
