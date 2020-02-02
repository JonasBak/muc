import App from "next/app";
import Container from "components/Container";
import Player from "components/Player";
import Sidepanel from "components/Sidepanel";
import Audio from "components/Audio";
import theme from "utils/theme";

class CustomApp extends App {
  public render() {
    const { Component, pageProps } = (this as any).props;
    return (
      <Container>
        <Player />
        <Audio />
        <div className="bodyWrapper">
          <Sidepanel />
          <div className="mainBody">
            <Component {...pageProps} />
          </div>
        </div>
        <style jsx global>{`
          html {
            background-color: ${theme.colors.background};
            color: ${theme.colors.font};
            font-family: sans;
            height: 100%;
          }
          body {
            margin: 0px;
            height: 100%;
          }
          #__next {
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          a {
            color: ${theme.colors.link};
            font-weight: bold;
            text-decoration: none;
          }
        `}</style>
        <style jsx>{`
          .bodyWrapper {
            display: flex;
            flex: 1;
            overflow-y: hidden;
          }
          .mainBody {
            flex: 1;
            padding: 20px;
            overflow-y: scroll;
          }
        `}</style>
      </Container>
    );
  }
}

export default CustomApp;
