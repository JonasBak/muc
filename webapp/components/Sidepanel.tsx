import Link from "next/link";
import { useRouter } from "next/router";

const PanelLink = ({
  href,
  title,
  selected
}: {
  href: string;
  title: string;
  selected: boolean;
}) => {
  return (
    <Link href={href}>
      <a style={{ color: selected ? "#fdfffc" : "#828a95" }}>{title}</a>
    </Link>
  );
};

const links: Array<{ href: string; title: string }> = [
  {
    href: "/artists",
    title: "Artists"
  },
  {
    href: "/albums",
    title: "Albums"
  },
  {
    href: "/tracks",
    title: "Tracks"
  }
];

const Sidepanel = () => {
  const router = useRouter();
  return (
    <div className="wrapper">
      {links.map(link => (
        <PanelLink
          key={link.href}
          href={link.href}
          title={link.title}
          selected={link.href === router.pathname}
        />
      ))}
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
