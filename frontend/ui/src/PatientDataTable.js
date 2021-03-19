import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

class CustomMenuBar extends React.Component {
    render() {
        return (
            <div style={{ width: '70vw' }} className={'datatable-responsive-demo'} >
                <div className="card">
                    <DataTable value={this.props.patients} className={'p-mt-4'} autoLayout
                        paginator={this.props.patients.length >= 10} rows={10} first={this.props.page} onPage={(e) => this.props.setPage(e.first)}
                        resizableColumns columnResizeMode="expand">
                        <Column field="firstname" header="Firstname"></Column>
                        <Column field="lastname" header="Lastname"></Column>
                        <Column field="identification_number" header="ID number"></Column>
                        <Column field="telephone" header="Telephone"></Column>
                        <Column field="email" header="Email"></Column>
                    </DataTable>
                </div>
            </div>
        );
    }
};

export default CustomMenuBar;