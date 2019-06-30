import React from 'react';
import { callApi } from '../../common/apiMiddleware';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import './constants/styles.css';


const apiUrls = ({
    getData: (page, size) => `/api/sources?page=${page}&size=${size}`,
    getDataSort: (page, size, sort) => `/api/sources?page=${page}&size=${size}&sort=${sort}`,
    filterByName: (name,page, size, sort) => `api/sources/search/findBySearch?searchTerm=${name}&page=${page}&size=${size}&sort=${sort}`,
});
const sortSelectItems = [
    {label: 'id', value: 'id'},
    {label: 'name', value: 'name'},
    {label: 'value', value: 'value'},
];
export class DataList extends React.Component {

    state = {
        tableData: [],
        rows: 2,
        nameFilter: '',
        paginator: true,
        first: 0,
        rowsNumberInput: 2,
        ascOrder: true,
        sortValue: 'id',
        curPage: 0,
    };

    componentDidMount() {
        this.loadData(this.state.curPage, this.state.rows);
    }

    getQueryParams = (baseUrl, page='', size='', sort='') => {
        let url = baseUrl;
        return url;
    };

    loadData = (page, size) => {
        callApi(apiUrls.getData(page, size)).then((data) => {
            this.setState({
                tableData: data._embedded.sources,
                totalRecords: data.page.totalElements,
                loading: false,
                pagination: true,
                rows: data.page.size,
                first: data.page.number*data.page.size,
                });
        }).catch(() => {
        });

    };

    onPage = (event) => {
        this.setState({
            loading: true,
            curPage: event.page,
        });
        if(this.state.nameFilter) {
            this.loadFilterData(event.page);
        }else {
            this.loadSortData(event.page);
        }
    };

    onSort = (event) => {
        this.setState({
                loading: true,
                sortValue: event.value,
                ascOrder: !this.state.ascOrder,
        });
        if(this.state.nameFilter) {
            this.loadFilterData();
        }else{
            this.loadSortData(this.state.curPage, event.value);
        }
    };
    loadSortData = (page=this.state.curPage, sortValue=this.state.sortValue) => {
        const sortOrder = this.state.ascOrder ? 'ask' : 'desc';
        callApi(apiUrls.getDataSort(
            page, this.state.rows, sortValue.concat(',', sortOrder))).then((data) => {
                this.setState({
                    tableData: data._embedded.sources,
                    totalRecords: data.page.totalElements,
                    loading: false,
                    pagination: true,
                    rows: data.page.size,
                    first: data.page.number*data.page.size,
                });
            }).catch(() => {
        });
    };
    loadFilterData = (page=this.state.curPage) => {
        const sort = this.state.sortValue;
        callApi(apiUrls.filterByName(this.state.nameFilter, page, this.state.rows, sort)).then((data) => {
            this.setState({
                tableData: data._embedded.sources,
                totalRecords: data.page.totalElements,
                loading: false,
                pagination: true,
                rows: data.page.size,
                first: data.page.number * data.page.size,
            });
        }).catch(() => {
    });
    };
    handleClickFilter = () => {
        this.setState({
            loading: true,
        });
        if(this.state.nameFilter) {
            this.loadFilterData();

        }else {
            this.loadData(this.state.curPage, this.state.rows);
        }

    };
    onNameFilterChange = (e) => {
        this.setState({
            nameFilter: e.target.value,
        });
    };
    rowsNumberChange = (e) => {
        this.setState({
            rowsNumberInput: parseInt(e.target.value, 10),
        });
    };
    onRowsNumberChange = (e) => {
        this.loadData(this.state.firstPage, this.state.rowsNumberInput);
    };
    onInputFilterKeyDown = (event) => {
        if(event.key === 'Enter'){
            this.handleClickFilter();
        }
    };
    onRowNumberKeyDown = (event) => {
            if(event.key === 'Enter'){
                this.loadData(this.state.firstPage, this.state.rowsNumberInput);
            }
        };
    valueTemplate(option) {
        if (!option.value) {
            return option.label;
        }
        else {
            return (
                <div className="p-clearfix">
                    <span style={{float:'right', margin:'.5em .25em 0 0'}}>{option.label} ↑</span>
                </div>
            );
        }
    }
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
                    value={this.state.nameFilter}
                    className="ui-column-filter"
                    onChange={this.onNameFilterChange}
                    onKeyDown={(e) => { this.onInputFilterKeyDown(e) } }
                />
                <label htmlFor="float-input">Введите id, name или value</label>
            </span>
                );
        const rowsNumberInput = (
             <span className="p-float-label">
                 <InputText
                     id='float-input'
                     style={{ width: '100%' }}
                     className="ui-column-filter"
                     onChange={this.rowsNumberChange}
                     value={ this.state.rowsNumberInput }
                     onKeyDown={ (e) => { this.onRowNumberKeyDown(e) } }
                 />
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
                     <span className="label-control">Количество записей на странице:</span>
                     {rowsNumberInput}
                     <Button label="Ок" onClick={this.onRowsNumberChange} />
                 </div>
                <div className="control-item">
                    <span className="label-control">Сортировка:</span>
                    <Dropdown
                        value={this.state.sortValue}
                        options={sortSelectItems}
                        onChange={(e) => {this.onSort(e)}}
                        placeholder="Сортировать по..."
                        itemTemplate={this.valueTemplate}
                        />
                </div>
                <DataTable
                    value={this.state.tableData}
                    paginator={this.state.paginator}
                    rows={this.state.rows}
                    first={this.state.first}
                    totalRecords={this.state.totalRecords}
                    lazy={true}
                    onPage={this.onPage}
                    loading={this.state.loading}
                >
                    <Column field="sourceId" header="id" />
                    <Column field="name" header="name" />
                    <Column field="value" header="value" />
                </DataTable>
            </div>
        );
    }
}