import React from 'react';
import Workspace from "./ui/Workspace.jsx";
import Projects from "./ui/projects/Index.jsx";



class Index extends React.Component {
    render() {
        return (
            <div style={{width: "100%", height: "100%"}}>
                <Workspace/>
                <Projects/>
            </div>
        )
    }
}

export default Index;
