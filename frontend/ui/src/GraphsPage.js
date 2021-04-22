import React from 'react';
import CustomMenuBar from './CustomMenuBar'
import Graphs from './Graphs.js';

class GraphsPage extends React.Component {
    render() {
        return (
            <div>
                <CustomMenuBar user={this.props.user} />
                <div className={'p-d-flex p-flex-column p-jc-center p-ai-center p-mt-4'}>
                    <div style={{ width: '80vw' }}>
                        <Graphs data={this.props.data} />
                    </div>
                </div>

            </div>
        )
    }
}

export default GraphsPage;
