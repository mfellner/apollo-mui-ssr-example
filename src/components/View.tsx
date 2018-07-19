import React from 'react';

type Props = {
  title: string;
  author: string;
  description: string;
  apolloState: object;
  css: string;
  body: string;
};

function encodeJSON(data: object): string {
  return new Buffer(JSON.stringify(data)).toString('base64');
}

export default class View extends React.Component<Props> {
  public render() {
    const { title, author, description, apolloState, css, body } = this.props;
    return (
      <html lang="en">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <title>{title}</title>
          <meta name="author" content={author} />
          <meta name="description" content={description} />
          <meta name="apollo-state" content={encodeJSON(apolloState)} />
          <link rel="shortcut icon" href="/static/favicon.ico" />
          <style id="jss-server-side">{css}</style>
        </head>
        <body>
          <main id="main" dangerouslySetInnerHTML={{ __html: body }} />
          <script src="/static/bundle/main.js" defer />
        </body>
      </html>
    );
  }
}
