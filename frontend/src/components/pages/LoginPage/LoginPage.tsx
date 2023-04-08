import { AuthContext, withAuth } from "@/contexts/Auth";
import React from "react";

import "./LoginPage.css"

class LoginPage extends React.Component<{auth: AuthContext}> {
    state = {
        username: "",
        password: "",
        error: null
    }

    handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            await this.props.auth.login(this.state.username, this.state.password)
        }
        catch(e: any) {
            if(e?.message) {
                this.setState({error: e.message})
            }
            else {
                this.setState({ error: "Unknown error" })
            }
        }
    }

    render() {
        return (
            <div className="LoginPage">
                <form className="LoginPage__form" onSubmit={this.handleSubmit}>
                    <input
                        value={this.state.username}
                        onChange={(e) => this.setState({ username: e.target.value })}
                        placeholder="Username"
                    />
                    <input
                        value={this.state.password}
                        onChange={(e) => this.setState({ password: e.target.value })}
                        placeholder="Password"
                        type="password"
                    />
                    {this.state.error && (
                    <p>{this.state.error}</p>
                    )}
                    <input 
                        type="submit"
                        value="Login"
                    />
                </form>
            </div>
        )
    }
}

export default withAuth(LoginPage)