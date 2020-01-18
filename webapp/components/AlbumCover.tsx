const AlbumCover = ({ url, size = 300 }: { url: string; size?: number }) => {
  return <img src={url} width="300" height="300" />;
};

export default AlbumCover;
