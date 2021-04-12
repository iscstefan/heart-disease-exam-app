import React from 'react';
import { Button } from 'primereact/button';
import { withRouter } from 'react-router';
import authStore from './AuthStore.js';
import CustomMenuBar from './CustomMenuBar'
import { TabView, TabPanel } from 'primereact/tabview';
import PatientDataTable from './PatientDataTable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import classNames from 'classnames';
import { InputTextarea } from 'primereact/inputtextarea';
import { Inplace, InplaceDisplay, InplaceContent } from 'primereact/inplace';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { confirmDialog } from 'primereact/confirmdialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import DiagnosticStore from './DiagnosticStore.js';
import Graphs from './Graphs.js';

class GraphsPage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
            <div>
                <CustomMenuBar user={this.props.user} />
                {/* <div className='title-bar p-d-flex p-flex-column p-jc-center p-ai-center'>
                    <span>General graphs</span>
                </div> */}
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
