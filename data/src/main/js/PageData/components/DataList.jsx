import React from 'react';
import { callApi } from '../../common/apiMiddleware';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Dropdown} from 'primereact/dropdown';
import './constants/styles.css';


const apiUrls = ({
    getData: (page, size) => `/api/sources?page=${page}&size=${size}`,
    getDataSort: (page, size, sort) => `/api/sources?page=${page}&size=${size}&sort=${sort}`,
    filterbyName: (name) => `api/sources/search/findByName?name=${name}`,
});
const sortSelectItems = [
    {label: 'name', value: 'name'},
    {label: 'value', value: 'value'},
];
export class DataList extends React.Component {

    state = {
        tableData: [],
        rows: 2,
        startPage: 1,
        nameFilter: '',
        paginator: true,
    };

    componentDidMount() {
        this.loadData(this.state.startPage, this.state.rows);
    }



    loadData = (page, size) => {
        callApi(apiUrls.getData(page, size)).then((data) => {
            this.setState({
                tableData: data._embedded.sources,
                totalRecords: data.page.totalElements,
                loading: false,
                pagination: true,
                });
        }).catch(() => {
        });

    };

    onPage = (event) => {
        this.setState({
            loading: true,
        });
        this.loadData(event.page, this.state.rows);
    };
    onSort = (event) => {
        callApi(apiUrls.getDataSort(
            this.state.startPage, this.state.rows, event.value)).then((data) => {
                this.setState({
                    tableData: data._embedded.sources,
                    totalRecords: data.page.totalElements,
                    loading: false,
                });
        }).catch(() => {
        });
    };
    handleClickFilter = () => {
        if(this.state.nameFilter) {
            callApi(apiUrls.filterbyName(this.state.nameFilter)).then((data) => {
                this.setState({
                    tableData: data._embedded.sources,
                });
            }).catch(() => {
            });
            this.setState({
                nameFilter: '',
                paginator: false,
            });
        }else{
            this.loadData(this.state.startPage, this.state.rows);
        }

    };
    onNameFilterChange = (e) => {
        this.setState({
            nameFilter: e.target.value,
        });
    };
    render() {
        const dataText = text => (
            <div className="header-text">
                {text}
            </div>
            );
        const nameFilter = (
            <span className="p-float-label">
                <InputText
                    id='float-input'
                    style={{ width: '100%' }}
                    className="ui-column-filter"
                    onChange={this.onNameFilterChange} />
                <label htmlFor="float-input">Введите name</label>
            </span>
                );
        return (
            <div>
                {dataText('Задача: В браузере отрисовать таблицу с данными сервера.')}
                <div className="control-item">
                    <span className="label-control">Фильтр:</span>
                    {nameFilter}
                    <Button label="Ок" onClick={this.handleClickFilter} />
                </div>
                <div className="control-item">
                    <span className="label-control">Сортировка:</span>
                    <Dropdown
                        value={this.state.city}
                        options={sortSelectItems}
                        onChange={(e) => {this.onSort(e)}}
                        placeholder="Сортировать по..."/>
                </div>
                <DataTable
                    value={this.state.tableData}
                    paginator={this.state.paginator}
                    rows={this.state.rows}
                    totalRecords={this.state.totalRecords}
                    lazy={true}
                    onPage={this.onPage}
                    loading={this.state.loading}
                >
                    <Column field="id" header="id" />
                    <Column field="name" header="name" />
                    <Column field="value" header="value" />
                </DataTable>
            </div>
        );
    }
}