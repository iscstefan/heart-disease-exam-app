import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';


class CustomMenuBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 0
        }
    }

    render() {

        const actionBodyTemplate = (rowData) => {
            return (
                <React.Fragment>
                    <Button icon="pi pi-angle-right" className="p-button-rounded  p-button-outlined"
                        onClick={() => this.props.setPatientDetailsEnabled(rowData)} />
                </React.Fragment>
            );
        }

        return (
            <div style={{ width: '70vw' }}>
                <div className="card">
                    <DataTable value={this.props.patients} className={'p-mt-6'} autoLayout
                        paginator={this.props.patients.length >= 11} rows={10}
                        resizableColumns columnResizeMode="expand" removableSort
                        selectionMode="single" dataKey="id">
                        <Column body={actionBodyTemplate}></Column>
                        <Column field="firstname" header="Firstname" sortable></Column>
                        <Column field="lastname" header="Lastname" sortable></Column>
                        <Column field="age" header="Age" sortable></Column>
                        <Column field="sex" header="Sex" sortable></Column>
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