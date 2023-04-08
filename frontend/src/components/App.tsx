import LoginPage from "@components/pages/LoginPage";

import { AuthContext, withAuth } from "@/contexts/Auth";
import "./App.css";
import HomePage from "./pages/HomePage";

type Props = {
    auth: AuthContext;
};

function App({ auth }: Props) {
    return auth.loggedIn ? <HomePage/> : <LoginPage />;
}

export default withAuth(App);
