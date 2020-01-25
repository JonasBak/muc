const AlbumCover = ({ url, size = 300 }: { url: string; size?: number }) => {
  return <img src={url} width={size} height={size} />;
};

export default AlbumCover;
