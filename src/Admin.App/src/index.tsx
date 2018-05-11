import * as React from "react";
import * as ReactDOM from "react-dom";
import { HelloWorld } from "./HelloWorld";
import "../../Style/index.scss";
import "../Style/index.scss";

ReactDOM.render(
    <div>
      <h1>Admin App</h1>
      <HelloWorld />
    </div>,
    document.getElementById("root")
  );