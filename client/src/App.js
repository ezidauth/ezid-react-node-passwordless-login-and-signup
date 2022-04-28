import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Login from "./Login";
import Auth from "./Auth";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route
          path="/login"
          render={(props) => <Login {...props} wsc={"testing"} />}
        />
        <Route
          path="/auth"
          render={(props) => <Auth {...props} wsc={"testing"} />}
        />
        <Redirect to="/login" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
