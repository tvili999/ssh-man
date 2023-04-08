import Keys from "@/components/blocks/Keys"
import Servers from "@/components/blocks/Servers"
import { AuthContext, withAuth } from "@/contexts/Auth"
import React from "react"

type Props = {
    auth: AuthContext
}

class HomePage extends React.Component<Props> {
    state = {
        servers: []
    }
    
    render() {
        return (
            <div>
                <button onClick={this.props.auth.logout}>Logout</button>
                <Keys/>
                <Servers/>
            </div>
        )
    }
}

export default withAuth(HomePage)
