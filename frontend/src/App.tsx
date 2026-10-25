import { useEffect, useState } from "react";

type Plant = {
  name: string;
  species: string;
  moisture: number;
  temperature: number;
  source: string;
};

export default function App() {
  const [plant, setPlant] = useState<Plant | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadPlant() {
      try {
        const response = await fetch("/api/plant", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const data: Plant = await response.json();
        setPlant(data);
      } catch (error) {
        if (controller.signal.aborted) return;

        setError(
          error instanceof Error ? error.message : "Could not load plant"
        );
      }
    }

    loadPlant();

    return () => controller.abort();
  }, []);

  if (error) {
    return <p role="alert">Could not load plant: {error}</p>;
  }

  if (!plant) {
    return <p>Loading plant...</p>;
  }

  return (
    <main>
      <h1>🌱 Plant Parenthood</h1>
      <h2>{plant.name}</h2>
      <p>Species: {plant.species}</p>
      <p>Soil moisture: {plant.moisture}%</p>
      <p>Temperature: {plant.temperature} °C</p>
      <small>Data source: {plant.source}</small>
    </main>
  );
}