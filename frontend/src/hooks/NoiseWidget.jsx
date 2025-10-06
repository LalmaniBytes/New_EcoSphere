import React, { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";
import useNoiseMeter from "./useNoiseMeter";
import { data } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function NoiseWidget() {
    const [level, setLevel] = useState(null);
    const [aiAdvice, setAiAdvice] = useState("");
    const latestLevelRef = useRef(null);
    const hasStartedRef = useRef(false);

    const API_BASE = "/noise"; // Change to full URL if backend is remote

    // Send noise data to backend
    const sendToBackend = async (dbspl) => {
        try {
            const payload = {
                ts: new Date().toISOString(),
                dbspl,
                location: "office", // Optional, use your own location tag
            };

            await axios.post(API_BASE, payload);
            console.log("Noise data sent:", payload);
        } catch (error) {
            console.error("Failed to send noise data:", error);
        }
    };

    // Fetch AI advice based on current data
    const fetchAiAdvice = async () => {
        try {
            const response = await axios.get(`${API_BASE}/current`, {
                params: { location: "office" }, // Optional
            });

            if (response.data && response.data.advice) {
                setAiAdvice(response.data.advice);
            }
        } catch (error) {
            console.error("Failed to fetch AI advice:", error);
        }
    };

    // Handle incoming noise from hook
    const handleNoiseData = useCallback((data) => {
        latestLevelRef.current = data.dbspl;

        if (!hasStartedRef.current) {
            setLevel(data.dbspl);
            sendToBackend(data.dbspl);
            fetchAiAdvice();

            const intervalId = setInterval(() => {
                const currentLevel = latestLevelRef.current;
                setLevel(currentLevel);
                sendToBackend(currentLevel);
                fetchAiAdvice();
            }, 30000); // 30 seconds

            hasStartedRef.current = true;
            window.__noiseIntervalId = intervalId;
        }
    }, []);

    useNoiseMeter(handleNoiseData);
    console.log("Data", level)
    // Cleanup interval on unmount
    useEffect(() => {
        return () => {
            if (window.__noiseIntervalId) {
                clearInterval(window.__noiseIntervalId);
            }
        };
    }, []);

    return (
        <div>
            {level === null ? (
                <div>Loading noise level...</div>
            ) : (
                <>
                    <div>Current Noise: {level.toFixed(1)} dB(A)</div>
                    <div style={{ margin: "100px", color: "#555" }} >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {aiAdvice || "Loading AI advice..."}
                        </ReactMarkdown>
                    </div>
                </>
            )}
        </div>

    );

}

export default NoiseWidget;
