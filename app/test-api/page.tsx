import { getProperties } from "@/lib/properties";

export default async function TestApiPage() {
  const properties = await getProperties();

  console.log(properties);

  return (
    <main>
      <h1>Test API : propriétés</h1>
      <pre>{JSON.stringify(properties, null, 2)}</pre>
    </main>
  );
}