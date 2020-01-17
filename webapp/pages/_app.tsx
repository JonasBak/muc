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
      </Container>
    );
  }
}

export default CustomApp;
