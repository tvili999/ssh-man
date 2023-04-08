import api from "@/api";
import React from "react";

class Keys extends React.Component {
    state = {
        keys: [],
        name: '',
        key: ''
    }

    componentDidMount() {
        this.fetch();
    }

    fetch = async () => {
        this.setState({
            keys: await api.keys.list()
        })
    }

    add = async (e: any) => {
        e.preventDefault()
        await api.keys.add({
            name: this.state.name,
            key: this.state.key
        });
        await this.fetch();
    }

    delete = async (id: string) => {
        await api.keys.delete(id);
        await this.fetch();
    }

    render() {
        return (
            <div>
                <h1>Imported keys</h1>
                <h2>Add</h2>
                <form onSubmit={this.add}>
                    <input 
                        type="text" 
                        placeholder="Name"
                        value={this.state.name}
                        onChange={(e) => this.setState({ name: e.target.value })}
                    />
                    <textarea 
                        placeholder="Public key"
                        value={this.state.key}
                        onChange={(e) => this.setState({ key: e.target.value })}
                    />
                    <button type="submit">Add</button>
                </form>
                <h2>List</h2>
                {this.state.keys.map((key: any) => (
                    <div key={key.id}>
                        <p>Name: {key.name}</p>
                        <button onClick={() => this.delete(key.id)}>Delete</button>
                    </div>
                ))}
            </div>
        )

    }
}

export default Keys