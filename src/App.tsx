import { WorkspaceView } from "./components/workspace/WorkspaceView";
import { MainOverlay } from "./components/workspace/overlay/MainOverlay";
import { BackgroundGrid } from "./components/detail/BackgroundGrid";
import { ToolProvider } from "./components/workspace/ToolContext";
import { GlobalTransformProvider } from "./components/workspace/core/GlobalTransform";
import { WorkspaceContext, WorkspaceProvider } from "./components/workspace/WorkspaceContext";
import { useContext } from "react";
import { ItemRenderer } from "./components/workspace/items/ItemRenderer";
import { TransformProvider } from "./components/workspace/core/Transform";
import { IconCrosshair } from "@tabler/icons-react";
import { ContextStack } from "./components/util/ContextStack";
import { SelectionContextProvider } from "./components/math/select/SelectionContext";

const RootItemRenderer = () => {
    const { items, setItems } = useContext(WorkspaceContext);

    return (
        items.map((item) => (
            <ItemRenderer
                key={item.id}
                item={item}
                setItem={(data) => setItems(items.map((x) => x.id == item.id ? data : x))}
                onFocus={() => setItems([...(items.filter((x) => x.id !== item.id)), item])}
                onClose={() => setItems([...(items.filter((x) => x.id !== item.id))])}
            />
        ))
    )
}

const App = () => {
    return (
        <ContextStack providers={[
            GlobalTransformProvider,
            WorkspaceProvider,
            ToolProvider,
            SelectionContextProvider,
        ]}>
            <BackgroundGrid />
            <WorkspaceView>
                <TransformProvider defaultValue={{ x: -25, y: -25 }}>
                    <IconCrosshair size={50} />
                </TransformProvider>

                <RootItemRenderer />
            </WorkspaceView>
            <MainOverlay />
        </ContextStack>
    );
}

export default App
