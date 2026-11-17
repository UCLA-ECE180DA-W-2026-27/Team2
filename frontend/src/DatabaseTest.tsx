import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

export default function DatabaseTest() {
  const [message, setMessage] = useState('Connecting to Supabase...');

  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase
        .from('sensor_readings')
        .select('*')
        .limit(1);

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage(
          `Connected! Found ${data?.length ?? 0} reading(s).`
        );
      }
    }

    testConnection();
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h1>RootCause Database Test</h1>
      <p>{message}</p>
    </div>
  );
}