import React from 'react';
import { Chart } from 'primereact/chart';
import { ScrollTop } from 'primereact/scrolltop';

class Graphs extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: []
        }
    }

    componentDidMount() {
        if (this.props.store) {
            this.props.store.getUserDiagnostics();

            this.props.store.emitter.addListener('GET_DIAGNOSTICS_SUCCESS', () => {
                this.setState({
                    data: this.props.store.userDiagnostics
                })
            });
        } else if (this.props.data) {
            this.setState({ data: this.props.data })
        }
    }

    render() {
        const getSexData = () => {
            const male = [0, 0];
            const female = [0, 0];
            this.state.data.forEach(diagnostic => {
                if (diagnostic.sex === 1) {
                    male[diagnostic.prediction]++;
                } else {
                    female[diagnostic.prediction]++;
                }
            });

            return {
                labels: ['Female', 'Male'],
                datasets: [
                    {
                        type: 'bar',
                        label: 'Healthy',
                        backgroundColor: '#42A5F5',
                        data: [female[1], male[1]]
                    },
                    {
                        type: 'bar',
                        label: 'Diseased',
                        backgroundColor: '#FFAEAE',
                        data: [female[0], male[0]]
                    }
                ]
            }
        }

        const getExangData = () => {
            const exang0 = [0, 0];
            const exang1 = [0, 0];
            this.state.data.forEach(diagnostic => {
                if (diagnostic.exang === 0) {
                    exang0[diagnostic.prediction]++;
                } else {
                    exang1[diagnostic.prediction]++;
                }
            });

            return {
                labels: ['Yes', 'No'],
                datasets: [
                    {
                        type: 'bar',
                        label: 'Healthy',
                        backgroundColor: '#42A5F5',
                        data: [exang0[1], exang1[1]]
                    },
                    {
                        type: 'bar',
                        label: 'Diseased',
                        backgroundColor: '#FFAEAE',
                        data: [exang0[0], exang1[0]]
                    }
                ]
            }
        }

        const getRestecgData = () => {
            const restecgValue0 = [0, 0];
            const restecgValue1 = [0, 0];
            const restecgValue2 = [0, 0];
            this.state.data.forEach(diagnostic => {
                if (diagnostic.restecg === 0) {
                    restecgValue0[diagnostic.prediction]++;
                } else if (diagnostic.restecg === 1) {
                    restecgValue1[diagnostic.prediction]++;
                } else {
                    restecgValue2[diagnostic.prediction]++;
                }
            });

            return {
                labels: ['1', '2', '3'],
                datasets: [
                    {
                        type: 'bar',
                        label: 'Healthy',
                        backgroundColor: '#42A5F5',
                        data: [restecgValue0[1], restecgValue1[1], restecgValue2[1]]
                    },
                    {
                        type: 'bar',
                        label: 'Diseased',
                        backgroundColor: '#FFAEAE',
                        data: [restecgValue0[0], restecgValue1[0], restecgValue2[0]]
                    }
                ]
            }
        }

        const getNumericalData = (variable) => {
            let healthy = {}
            let diseased = {}

            this.state.data.forEach(diagnostic => {
                if (!healthy[diagnostic[`${variable}`]]) {
                    healthy[diagnostic[`${variable}`]] = 0;
                    diseased[diagnostic[`${variable}`]] = 0;

                }

                diagnostic.prediction === 1
                    ?
                    healthy[diagnostic[`${variable}`]] += 1
                    :
                    diseased[diagnostic[`${variable}`]] += 1

            });

            healthy = Object.keys(healthy).reduce((accumulator, currentValue) => {
                accumulator[currentValue] = healthy[currentValue];
                return accumulator;
            }, {})

            diseased = Object.keys(diseased).reduce((accumulator, currentValue) => {
                accumulator[currentValue] = diseased[currentValue];
                return accumulator;
            }, {})

            return {
                labels: Object.keys(healthy),
                datasets: [
                    {
                        type: 'bar',
                        label: 'Healthy',
                        backgroundColor: '#42A5F5',
                        data: Object.values(healthy)
                    },
                    {
                        type: 'bar',
                        label: 'Diseased',
                        backgroundColor: '#FFAEAE',
                        data: Object.values(diseased)
                    }
                ]
            };
        }

        const getOptions = (xLabel) => {
            return {
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                responsive: true,
                scales: {
                    xAxes: [{
                        stacked: true,
                        ticks: {
                            fontColor: '#495057'
                        },
                        gridLines: {
                            color: '#ebedef'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: xLabel,
                            fontSize: 14
                        }
                    }],
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            fontColor: '#42A5F5'
                        },
                        gridLines: {
                            color: '#ebedef'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Patients',
                            fontSize: 14
                        }
                    }]
                },
                legend: {
                    labels: {
                        fontColor: '#495057'
                    }
                }
            };
        }

        const getPieData = () => {
            const predictions = [0, 0]
            this.state.data.forEach(diagnostic => {
                predictions[diagnostic.prediction]++
            });
            return {
                labels: ['Healthy', 'Diseased'],
                datasets: [
                    {
                        data: [predictions[1], predictions[0]],
                        backgroundColor: [
                            "#42A5F5",
                            "#FFAEAE"
                        ],

                    }
                ]
            }
        };

        return (
            <div className="card">
                {
                    this.state.data.length > 0 ?
                        <div>
                            <div style={{ marginTop: '10vh' }}>
                                <Chart type="pie" data={getPieData()} />
                            </div>
                            <div style={{ marginTop: '10vh' }}>
                                <Chart type="bar" data={getNumericalData('age')} options={getOptions('Age')} />
                            </div>
                            <div style={{ marginTop: '10vh' }}>
                                <Chart type="bar" data={getSexData()} options={getOptions('Sex')} />
                            </div>
                            <div style={{ marginTop: '10vh' }}>
                                <Chart type="bar" data={getNumericalData('thalach')} options={getOptions('Max heart rate during stress test')} />
                            </div>
                            <div style={{ marginTop: '10vh' }}>
                                <Chart type="bar" data={getNumericalData('chol')} options={getOptions('Cholesterol (mg/dl)')} />
                            </div>
                            <div style={{ marginTop: '10vh' }}>
                                <Chart type="bar" data={getNumericalData('trestbps')} options={getOptions('Resting blood pressure (mmHg)')} />
                            </div>
                            <div style={{ marginTop: '10vh' }}>
                                <div style={{ fontSize: '2vh' }}>
                                    <p>
                                        1 - Probable left ventricular hypertrophy
                                    </p>
                                    <p>
                                        2 - Normal
                                    </p>
                                    <p>
                                        3 - Abnormalities - T wave or ST segment
                                    </p>
                                </div>
                                <Chart type="bar" data={getRestecgData()} options={getOptions('Electrocardiogram on rest results')} />
                            </div>
                            <div style={{ marginTop: '10vh' }}>
                                <Chart type="bar" data={getExangData()} options={getOptions('Angina during exercise')} />
                            </div>
                            <div style={{ marginTop: '10vh' }}>
                                <p style={{ fontSize: '2vh' }}>Decrease of the ST segment during exercise according to the same one on rest</p>
                                <Chart type="bar" data={getNumericalData('oldpeak')} options={getOptions('Decrease of the ST segment')} />
                            </div>
                            <div style={{ marginTop: '10vh' }}>
                                <div style={{ fontSize: '2vh' }}>
                                    <p>
                                        0 - Descending
                                    </p>
                                    <p>
                                        1 - Flat
                                    </p>
                                    <p>
                                        2 - Ascending
                                    </p>
                                </div>
                                <Chart type="bar" data={getNumericalData('slope')} options={getOptions('Slope of the ST segment')} />
                            </div>
                            <div style={{ marginTop: '10vh' }}>
                                <p style={{ fontSize: '2vh' }}>Number of main blood vessels coloured by the radioactive dye</p>
                                <Chart type="bar" data={getNumericalData('ca')} options={getOptions('CA')} />
                            </div>
                            <ScrollTop className={'custom-scrolltop'} />
                        </div>
                        :
                        <div>
                            No prediction has been made.
                    </div>
                }
            </div>
        );
    }
};

export default Graphs;