import { Box } from "@mantine/core";
import { PropsWithChildren, useContext, useRef, useState } from "react";
import { GlobalTransform } from "./core/GlobalTransform";
import { useRelativeDrag } from "../../hooks/useRelativeDrag";
import { BackgroundGrid } from "../detail/BackgroundGrid";
import { Position } from "../../types/scalar";
import { useMousePosition } from "../../hooks/useMousePosition";
import { DebugPoint } from "../debug/DebugPoint";
import { TransformProvider } from "./core/Transform";

export const WorkspaceView = ({
    children
}: PropsWithChildren) => {
    const mouse = useMousePosition();
    const { position, setPosition, scale, setScale } = useContext(GlobalTransform);
    const [lastPinchDistance, setLastPinchDistance] = useState<number | null>(null);
    const workspaceRef = useRef(null);

    const { isDragging: isPanning, props } = useRelativeDrag({
        value: position,
        onChange: setPosition,
        scale: 1,
    });

    const clientPosition = ({ clientX, clientY }: { clientX: number; clientY: number }) => ({
        x: Math.round((clientX - position.x) / scale),
        y: Math.round((clientY - position.y) / scale),
    });

    const getDistance = (touch1: React.Touch, touch2: React.Touch) => {
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const getMiddle = (a: Position, b: Position) => ({
        x: (a.x+b.x)/2,
        y: (a.y+b.y)/2,
    });

    const handleScaleChange = (scaleChange: number, point: Position) => {
        let newScale = Math.max(0.3, Math.min(2, scale + scaleChange));
        if (newScale == scale) return;
        //let newScale = scale + scaleChange
        setScale(newScale);
        setPosition({
            x: Math.round(position.x - (point.x * scaleChange)),
            y: Math.round(position.y - (point.y * scaleChange)),
        })
    };

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        e.preventDefault();
        const scaleChange = (e.deltaY < 0 ? 1 : -1) * 0.1;
        handleScaleChange(scaleChange, {
            x: ((window.innerWidth / 2) - position.x) / scale,
            y: ((window.innerHeight / 2) - position.y) / scale,
        });
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
        if (e.touches.length !== 2) return;
        
        const distance = getDistance(e.touches[0], e.touches[1]);

        if (lastPinchDistance !== null) {
            const scaleChange = (distance - lastPinchDistance) / 500;

            let point = getMiddle(clientPosition(e.touches[0]), clientPosition(e.touches[1]));

            handleScaleChange(
                scaleChange,
                point,
            );
        }

        setLastPinchDistance(distance);
    };

    const handleTouchEnd = () => {
        setLastPinchDistance(null);
    };

    return (
        <Box
            onWheel={handleWheel}
            onTouchMove={handleTouchMove}
            {...props}
            onTouchEnd={(e) => {
                props.onTouchEnd(e);
                handleTouchEnd();
            }}
            w="100vw"
            h="100vh"
            style={{
                overflow: "hidden",
                position: 'relative',
                cursor: isPanning ? "grabbing" : "all-scroll",
            }}
        >
            <Box
                ref={workspaceRef}
                style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transformOrigin: '0 0',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                }}
            >
                {children}
            </Box>
        </Box>
    )
}
