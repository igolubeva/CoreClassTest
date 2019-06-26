import React from 'react';
import { callApi } from '../../common/apiMiddleware';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';


const apiUrls = ({
    getData: '/api/sources/',
});

export class DataList extends React.Component {

    state = {
        tableData: [],
    };

    componentDidMount() {
        this.loadData();
    }



    loadData = () => {
        callApi(apiUrls.getData).then((data) => {
            this.setState({
                    tableData: data._embedded.sources,
                });
        }).catch(() => {
        });

    };

    prevData() {
        this.loadData();
    }

    nextData() {
        this.loadData();
    }
    render() {
        const dataText = text =>
            (<div>
                    {text}
                </div>
            );

        return (
            <div>
                {dataText('Пример получения данных с сервера.')}
                <DataTable value={this.state.tableData}>
                    <Column field="id" header="id" />
                    <Column field="name" header="name" />
                    <Column field="value" header="value" />
                </DataTable>
            </div>
        );
    }
}