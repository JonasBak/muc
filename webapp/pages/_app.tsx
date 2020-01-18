import App from "next/app";
import Container from "components/Container";
import Player from "components/Player";

class CustomApp extends App {
  public render() {
    const { Component, pageProps } = (this as any).props;
    return (
      <Container>
        <Player />
        <Component {...pageProps} />
        <style jsx global>{`
          html {
            background-color: #2d2e2e;
            color: #fdfffc;
            font-family: sans;
          }
          body {
            margin: 0px;
          }
          a {
            color: #828a95;
            font-weight: bold;
            text-decoration: none;
          }
        `}</style>
      </Container>
    );
  }
}

export default CustomApp;
