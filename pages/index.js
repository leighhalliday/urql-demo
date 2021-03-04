import { useQuery } from "urql";
import { client, ssrCache } from "../src/urqlClient";

const WeatherQuery = `
query TorontoWeather($city: String!) {
  getCityByName(name: $city) {
    id
    name
    weather {
      summary {
        title
        description
      }
      temperature {
        min
        max
        actual
      }
    }
  }
}
`;

export default function Home() {
  const [result] = useQuery({
    query: WeatherQuery,
    variables: { city: "Toronto" },
  });
  const { data, loading, error } = result;

  if (loading) return <div>Loading</div>;
  if (error) return <div>Error</div>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

// export async function getServerSideProps() {
//   await client.query(WeatherQuery, { city: "Toronto" }).toPromise();
//   return { props: { urqlState: ssrCache.extractData() } };
// }

export async function getStaticProps() {
  await client.query(WeatherQuery, { city: "Toronto" }).toPromise();
  return { props: { urqlState: ssrCache.extractData() }, revalidate: 60 };
}
