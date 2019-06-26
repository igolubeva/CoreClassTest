import React from 'react';
import { callApi } from '../../common/apiMiddleware';

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
                    tableData: data,
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
                {dataText('тут будет таблица с данными')}
            </div>
        );
    }
}