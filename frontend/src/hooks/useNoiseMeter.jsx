// React Hook to capture sound and compute dB
import { useEffect } from "react";

function useNoiseMeter(onData) {
    useEffect(() => {
        let audioCtx, analyser, buf;
        let calibrationOffset = 90; // <-- set this after calibration

        async function init() {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 2048;
            buf = new Float32Array(analyser.fftSize);
            const source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);

            setInterval(() => {
                analyser.getFloatTimeDomainData(buf);
                const rms = Math.sqrt(buf.reduce((a, v) => a + v * v, 0) / buf.length);
                const dbfs = 20 * Math.log10(rms || 1e-12);
                const dbspl = dbfs + calibrationOffset; // after calibration
                onData({
                    ts: new Date().toISOString(),
                    dbfs,
                    dbspl,
                });
            }, 1000); // every 1s
        }

        init();
    }, [onData]);
}

export default useNoiseMeter;