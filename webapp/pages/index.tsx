import Link from "next/link";

const Home = () => {
  return (
    <div>
      <Link href="/albums">
        <h1>Albums</h1>
      </Link>
    </div>
  );
};

export default Home;
