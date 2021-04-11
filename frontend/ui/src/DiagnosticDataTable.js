import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import DiagnosticStore from './DiagnosticStore'
import { Tooltip } from 'primereact/tooltip';
import { confirmDialog } from 'primereact/confirmdialog';

// tabview nou cu predictii pacienti...
// coloane: id sex age chol trestbps ... predictie!
// id e cel din baza de date (unic)


class DiagnosticDataTable extends React.Component {
    constructor(props) {
        super(props);

        this.diagnosticStore = new DiagnosticStore(this.props.user);

        this.state = {
            data: [],
            diagnosticId: 0,
            patientId: 0
        };
    }

    componentDidMount() {
        this.diagnosticStore.getUserDiagnostics();

        this.diagnosticStore.emitter.addListener('GET_DIAGNOSTICS_SUCCESS', () => {
            this.setState({
                data: this.diagnosticStore.userDiagnostics
            })
        });
    }

    render() {

        const accept = () => {
            this.diagnosticStore.delete(this.state.diagnosticId, this.state.patientId)
        }

        const actionBodyTemplate = (rowData) => {
            return (
                <React.Fragment>
                    <Button icon="pi pi-trash" className="p-button-rounded  p-button-outlined"
                        onClick={() => {
                            this.setState({
                                diagnosticId: rowData.id,
                                patientId: rowData.patientId
                            })

                            confirmDialog({
                                message: 'Do you want to delete this record?',
                                header: 'Delete Confirmation',
                                icon: 'pi pi-info-circle',
                                acceptClassName: 'p-button-danger',
                                baseZIndex: 1000,
                                accept
                            });
                        }} />
                </React.Fragment>
            );
        }

        const cpBodyTemplate = (rowData) => {
            return (
                <div>
                    {
                        cpDropDownValues[rowData.cp].label
                    }
                </div>
            )   
        }

        const exangBodyTemplate = (rowData) => {
            return (
                <div>
                    {
                        exangDropDownValues[rowData.exang].label
                    }
                </div>
            )   
        }

        const slopeBodyTemplate = (rowData) => {
            return (
                <div>
                    {
                        slopeDropDownValues[rowData.slope].label
                    }
                </div>
            )   
        }

        const restecgBodyTemplate = (rowData) => {
            return (
                <div>
                    {
                        restecgDropDownValues[rowData.restecg].label
                    }
                </div>
            )   
        }

        const thalBodyTemplate = (rowData) => {
            return (
                <div>
                    {
                        thalDropDownValues[rowData.thal - 1].label
                    }
                </div>
            )   
        }

        const fbsBodyTemplate = (rowData) => {
            return (
                <div>
                    {
                        fbsDropDownValues[rowData.fbs].label
                    }
                </div>
            )   
        }

        const sexBodyTemplate = (rowData) => {
            return (
                <div>
                    {
                        sexDropDownValues[rowData.sex].label
                    }
                </div>
            )   
        }

        const diagnosticBodyTemplate = (rowData) => {
            return (
                <span className={`prediction-${rowData.prediction}`}>
                    {
                        rowData.prediction === 0 ?
                        <>DISEASE</>
                        :
                        <>HEALTHY</>
                    }
                </span>
            )
        }


        const cpDropDownValues = [
            { label: 'Asymptomatic', value: '0' },
            { label: 'Atypical angina', value: '1' },
            { label: 'Pain without relation to angina', value: '2' },
            { label: 'Typical angina', value: '3' }
        ];

        const fbsDropDownValues = [
            { label: 'Lower', value: '0' },
            { label: 'Higher', value: '1' },
        ]

        const exangDropDownValues = [
            { label: 'No', value: '0' },
            { label: 'Yes', value: '1' },
        ]

        const restecgDropDownValues = [
            { label: 'Probable left ventricular hypertrophy', value: '0' },
            { label: 'Normal', value: '1' },
            { label: 'Abnormalities - T wave or ST segment', value: '2' },
        ]

        const slopeDropDownValues = [
            { label: 'Descending', value: '0' },
            { label: 'Flat', value: '1' },
            { label: 'Ascending', value: '2' }
        ]

        const thalDropDownValues = [
            { label: 'Fixed defect', value: '1' },
            { label: 'Normal blood flow', value: '2' },
            { label: 'Reversible defect', value: '3' }
        ]

        const sexDropDownValues = [
            { label: 'F'},
            { label: 'M'},
        ];

        return (
            <div style={{ width: '90vw' }}>
                <div className="card">
                    <DataTable value={this.state.data} className={'p-mt-6'} autoLayout
                        paginator={this.state.data.length >= 11} rows={10}
                        columnResizeMode="expand" removableSort rowHover
                        dataKey="id">
                        <Column field="patientId" header="Patient ID" sortable></Column>
                        <Column field="prediction" header="Diagnostic"body={diagnosticBodyTemplate} sortable></Column>
                        <Column field="age" header="Age" sortable></Column>
                        <Column field="sex" header="Sex" sortable body={sexBodyTemplate}></Column>
                        <Column className='cp' field="cp" header="Chest pain type" body={cpBodyTemplate} sortable></Column>
                        <Column className='trestbps' field="trestbps" header="Trestbps" sortable></Column>
                        <Column className='chol' field="chol" header="Cholesterol (mg/dl)" sortable></Column>
                        <Column className='fbs' field="fbs" header="Fbs" body={fbsBodyTemplate} sortable></Column>
                        <Column className='restecg' field="restecg" header="Rest_ecg" body={restecgBodyTemplate} sortable></Column>
                        <Column className='thalach' field="thalach" header="Thalach" sortable></Column>
                        <Column className='exang' field="exang" header="Ex_angina" body={exangBodyTemplate} sortable></Column>
                        <Column className='oldpeak' field="oldpeak" header="Oldpeak" sortable></Column>
                        <Column className='slope' field="slope" header="Slope" body={slopeBodyTemplate} sortable></Column>
                        <Column className='ca' field="ca" header="CA" sortable></Column>
                        <Column className='thal' field="thal" header="Thal" body={thalBodyTemplate} sortable></Column>
                        <Column body={actionBodyTemplate}></Column>

                    </DataTable>
                </div>
                <Tooltip target='.trestbps' position='top'>
                    Resting blood pressure in millimeters of mercury (mm Hg) when the patient was admitted to the hospital
                </Tooltip>
                <Tooltip target='.chol' position='top'>
                </Tooltip>
                <Tooltip target='.fbs' position='top'>
                    Whether the level of sugar in the blood is higher than 120 mg/dl or not
                </Tooltip>
                <Tooltip target='.restecg' position='top'>
                    Electrocardiogram on rest results
                </Tooltip>
                <Tooltip target='.thalach' position='top'>
                    Maxium heart rate during the stress test
                </Tooltip>
                <Tooltip target='.exang' position='top'>
                    Angina during exercise
                </Tooltip>
                <Tooltip target='.oldpeak' position='top'>
                    Decrease of the ST segment during exercise according to the same one on rest
                </Tooltip>
                <Tooltip target='.slope' position='top'>
                    Slope of the ST segment
                </Tooltip>
                <Tooltip target='.ca' position='top'>
                    Number of main blood vessels coloured by the radioactive dye
                </Tooltip>
                <Tooltip target='.thal' position='top'>
                    Results of the blood flow observed via the radioactive dye. Fixed defect - no blood flow in some part of the heart; Reversible defect - a blood flow is observed but it is not normal
                </Tooltip>


            </div>
        );
    }
};

export default DiagnosticDataTable;