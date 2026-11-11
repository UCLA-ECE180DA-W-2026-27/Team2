
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

type Plant = {
  id: string;
  name: string;
  species: string | null;
};

type SensorReading = {
  id: number;
  plant_id: string;
  soil_moisture: number | null;
  temperature: number | null;
  humidity: number | null;
  light: number | null;
  soil_ph: number | null;
  timestamp: string;
};

export default function App() {
  const [plant, setPlant] = useState<Plant | null>(null);
  const [reading, setReading] = useState<SensorReading | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadData() {
      // Find the first plant
      const { data: plantData, error: plantError } = await supabase
        .from("plants")
        .select("id, name, species")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (!active) return;

      if (plantError) {
        setError(plantError.message);
        setLoading(false);
        return;
      }

      if (!plantData) {
        setError("No plants found in Supabase.");
        setLoading(false);
        return;
      }

      setPlant(plantData);

      // Find the newest sensor measurement
      const { data: readingData, error: readingError } = await supabase
        .from("sensor_readings")
        .select("*")
        .eq("plant_id", plantData.id)
        .order("timestamp", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!active) return;

      if (readingError) {
        setError(readingError.message);
      } else {
        setReading(readingData);
      }

      setLoading(false);
    }

    loadData();

    // Listen for new sensor measurements
    const channel = supabase
      .channel("plant-readings")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "sensor_readings",
        },
        () => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return <p>Loading plant data...</p>;
  }

  if (error) {
    return <p role="alert">Error: {error}</p>;
  }

  if (!plant) {
    return <p>No plant found.</p>;
  }

  return (
    <main style={{ maxWidth: 420, margin: "auto", padding: 24 }}>
      <h1>🌱 RootCause</h1>

      <h2>{plant.name}</h2>
      <p>Species: {plant.species ?? "Unknown"}</p>

      <h3>Current Conditions</h3>

      {reading ? (
        <>
          <p>
            Soil moisture: {reading.soil_moisture ?? "--"}%
          </p>
          <p>
            Temperature: {reading.temperature ?? "--"} °C
          </p>
          <p>
            Humidity: {reading.humidity ?? "--"}%
          </p>
          <p>
            Light: {reading.light ?? "--"} lux
          </p>
          <p>
            Soil pH: {reading.soil_ph ?? "--"}
          </p>

          <small>
            Last updated:{" "}
            {new Date(reading.timestamp).toLocaleString()}
          </small>
        </>
      ) : (
        <p>No sensor measurements yet.</p>
      )}

      <p>
        <small>Data source: Supabase</small>
      </p>
    </main>
  );
}
