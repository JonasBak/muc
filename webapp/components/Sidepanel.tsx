import Link from "next/link";

const Sidepanel = () => {
  return (
    <div className="wrapper">
      <Link href="/artists">
        <a>Artists</a>
      </Link>
      <Link href="/albums">
        <a>Albums</a>
      </Link>
      <Link href="/tracks">
        <a>Tracks</a>
      </Link>
      <style jsx>{`
        .wrapper {
          display: flex;
          flex-direction: column;
          box-shadow: inset -2px 0px 2px #0f0f0f;
          padding: 20px;
          background-color: #222222;
        }
      `}</style>
    </div>
  );
};

export default Sidepanel;
