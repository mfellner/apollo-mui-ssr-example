declare module 'serve-handler' {
  import { IncomingMessage, ServerResponse } from 'http';

  const serveHandler: (req: IncomingMessage, res: ServerResponse, options: object) => any;

  export = serveHandler;
}

declare module 'react-jss/lib/JssProvider' {
  import React = require('react');
  import { GenerateClassName } from 'jss';

  type Props = { registry: any; generateClassName: GenerateClassName<any> };

  export default class JssProvider extends React.Component<Props> {}
}

declare module 'react-jss/lib/jss' {
  export class SheetsRegistry {}
}
