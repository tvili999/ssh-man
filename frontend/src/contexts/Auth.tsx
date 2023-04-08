import React, { createContext, ReactNode } from "react";
import api from "@/api";

export type AuthContext = {
    loaded: boolean
    loggedIn: boolean,
    login: (username: string, password: string) => Promise<void>,
    logout: () => Promise<void>
}

const { Provider, Consumer } = createContext<AuthContext>({
    loaded: false,
    loggedIn: false,
    login: async (_username, _password) => {},
    logout: async () => {}
});

export class AuthProvider extends React.Component<{ children?: ReactNode }, AuthContext> {
    state = {
        loaded: false,
        loggedIn: false,
        login: async (username: string, password: string) => {
            await api.auth.login(username, password)
            this.setState({
                loggedIn: true
            })
        },
        logout: async () => {
            await api.auth.logout();
            this.setState({
                loggedIn: false
            })
        }
    };

    async componentDidMount() {
        const me = await api.auth.me();

        this.setState({
            loaded: true,
            loggedIn: me.loggedIn
        })
    }

    render() {
        return this.state.loaded && (
            <Provider value={this.state}>
                {this.props.children}
            </Provider>
        );
    }
}

export function withAuth<T extends JSX.IntrinsicAttributes>(Component: React.ComponentType<T & {auth: AuthContext}>) {
    const hoc: React.FC<T> = (props: T) => {
        return (
            <Consumer>
                {(value: AuthContext) => <Component {...props} auth={value} />}
            </Consumer>
        )
    }

    return hoc
}

export const AuthConsumer = Consumer