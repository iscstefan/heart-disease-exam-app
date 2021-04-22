import React from 'react';
import CustomMenuBar from './CustomMenuBar'
import { toggleWidget, Widget } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

class CovidPage extends React.Component {
 
    render() {
        return (
            <div>
                <CustomMenuBar user={this.props.user} />
                

            </div>
        )
    }
}

export default CovidPage;
