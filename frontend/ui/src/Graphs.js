import React from 'react';
import { Chart } from 'primereact/chart';


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
                        type:'bar',
                        label: 'Healthy',
                        backgroundColor: '#83ba4e',
                        data: [female[1], male[1]]
                    },
                    {
                        type:'bar',
                        label: 'Unhealthy',
                        backgroundColor: '#e65e5e',
                        data: [female[0], male[0]]
                    }
                ]
            }
        }

        const basicData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {   
                    type:'bar',
                    label: 'My First dataset',
                    backgroundColor: '#42A5F5',
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    type:'bar',
                    label: 'My Second dataset',
                    backgroundColor: '#FFAEAE',
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };

        let stackedOptions = {
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
                    }
                }],
                yAxes: [{
                    stacked: true,
                    ticks: {
                        fontColor: '#495057'
                    },
                    gridLines: {
                        color: '#ebedef'
                    }
                }]
            },
            legend: {
                labels: {
                    fontColor: '#495057'
                }
            }
        };

        return (
            <div className="card">
                <h5>Vertical</h5>
                <Chart type="bar" data={getSexData()} options={stackedOptions}/>
            </div>
        );
    }
};

export default Graphs;