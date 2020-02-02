import Link from "next/link";
import { useRouter } from "next/router";
import theme from "utils/theme";

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
      <a style={{ color: selected ? theme.colors.font : theme.colors.link }}>
        {title}
      </a>
    </Link>
  );
};

const links: Array<{ href: string; title: string }> = [
  {
    href: "/playback",
    title: "Playback"
  },
  {
    href: "/playlists",
    title: "Playlists"
  },
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
          box-shadow: inset -2px 0px 2px ${theme.colors.dark0};
          padding: 20px;
          background-color: ${theme.colors.sidebar};
        }
      `}</style>
    </div>
  );
};

export default Sidepanel;
