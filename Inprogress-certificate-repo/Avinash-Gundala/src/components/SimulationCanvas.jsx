import { useEffect, useRef } from "react";
import Engine from "../physics/Engine";

function SimulationCanvas({
    action,
    setProgress,
    setStatus,
    setWaterCount,
    setSaltCount
    ,onEvent
}) {

    const canvasRef = useRef(null);
    const engineRef = useRef(null);

    useEffect(() => {

        engineRef.current = new Engine(
            canvasRef.current,
            setProgress,
            setStatus,
            setWaterCount,
            setSaltCount
            ,onEvent
        );

        engineRef.current.start();

        return () => {

            if (engineRef.current) {
                engineRef.current.stop();
            }

        };

    }, []);

    useEffect(() => {

        if (!engineRef.current) return;

        switch (action) {

            case "start":
                engineRef.current.startReaction();
                break;

            case "pause":
                engineRef.current.pause();
                break;

            case "reset":
                engineRef.current.reset();
                break;

            default:
                break;

        }

    }, [action]);

    return (

        <section className="simulation">

            <canvas
                ref={canvasRef}
                width={1450}
                height={620}
            />

        </section>

    );

}

export default SimulationCanvas;