import api from "@/api";
import React from "react";

class Servers extends React.Component {
    state = {
        servers: [],
        name: '',
        host: '',
        user: '',
        key: ''
    }

    componentDidMount() {
        this.fetch();
    }

    fetch = async () => {
        this.setState({
            servers: await api.servers.list()
        })
    }

    add = async (e: any) => {
        e.preventDefault()
        await api.servers.add({
            name: this.state.name,
            host: this.state.host,
            user: this.state.user,
            key: this.state.key
        });
        await this.fetch();
    }

    delete = async (id: string) => {
        await api.servers.delete(id);
        await this.fetch();
    }

    render() {
        return (
            <div>
                <h1>Servers</h1>
                <h2>Add</h2>
                <form onSubmit={this.add}>
                    <input 
                        type="text" 
                        placeholder="Name"
                        value={this.state.name}
                        onChange={(e) => this.setState({ name: e.target.value })}
                    />
                    <input 
                        type="text" 
                        placeholder="Host"
                        value={this.state.host}
                        onChange={(e) => this.setState({ host: e.target.value })}
                    />
                    <input 
                        type="text" 
                        placeholder="User"
                        value={this.state.user}
                        onChange={(e) => this.setState({ user: e.target.value })}
                    />
                    <textarea 
                        placeholder="Public key"
                        value={this.state.key}
                        onChange={(e) => this.setState({ key: e.target.value })}
                    />
                    <button type="submit">Add</button>
                </form>
                <h2>List</h2>
                {this.state.servers.map((key: any) => (
                    <div key={key.id}>
                        <p>Name: {key.name}</p>
                        <p>Host: {key.host}</p>
                        <p>User: {key.user}</p>
                        <button onClick={() => this.delete(key.id)}>Delete</button>
                    </div>
                ))}
            </div>
        )

    }
}

export default Servers